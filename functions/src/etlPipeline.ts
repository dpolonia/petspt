import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

const db = admin.firestore();
const SNS_BASE = 'https://transparencia.sns.gov.pt/api/explore/v2.1/catalog/datasets';

interface ETLConfig {
  slug: string;
  nome: string;
  camposPeriodo: string[];
  camposInstituicao: string[];
  camposValor: string[];
}

// Field names from docs/API_CATALOG.md
const ETL_DATASETS: ETLConfig[] = [
  { slug: 'intervencoes-cirurgicas', nome: 'Intervencoes Cirurgicas',
    camposPeriodo: ['tempo'], camposInstituicao: ['instituicao'],
    camposValor: ['no_intervencoes_cirurgicas_programadas', 'no_intervencoes_cirurgicas_convencionais', 'no_intervencoes_cirurgicas_de_ambulatorio', 'no_intervencoes_cirurgicas_urgentes'] },
  { slug: 'consultas-em-tempo-real', nome: 'Consultas em Tempo Real',
    camposPeriodo: ['tempo'], camposInstituicao: ['instituicao'],
    camposValor: ['no_primeiras_ce_prestadas_dentro_do_tmrg', 'no_primeiras_ce_realizadas_com_registo_no_cth'] },
  { slug: 'atividade-operacional-do-sns-24', nome: 'SNS 24',
    camposPeriodo: ['periodo'], camposInstituicao: [],
    camposValor: ['valor'] },
  { slug: 'utentes-inscritos-em-cuidados-de-saude-primarios', nome: 'Utentes CSP',
    camposPeriodo: ['periodo'], camposInstituicao: ['aces'],
    camposValor: ['utentes_inscritos_csp', 'total_utentes_com_mdf_atribuido', 'total_utentes_sem_mdf_atribuido'] },
  { slug: 'partos-e-cesarianas', nome: 'Partos e Cesarianas',
    camposPeriodo: ['tempo'], camposInstituicao: ['instituicao'],
    camposValor: ['no_de_partos', 'no_de_cesarianas'] },
  { slug: 'atendimentos-por-tipo-de-urgencia-hospitalar-link', nome: 'Urgencias',
    camposPeriodo: ['tempo'], camposInstituicao: ['instituicao'],
    camposValor: ['urgencias_geral', 'urgencias_pediatricas', 'urgencia_obstetricia', 'total_urgencias'] },
  { slug: 'lotacao-praticada-por-tipo-de-cama', nome: 'Lotacao Camas',
    camposPeriodo: ['tempo'], camposInstituicao: ['instituicao'],
    camposValor: ['lotacao'] },
  { slug: 'rastreios-oncologicos', nome: 'Rastreios Oncologicos',
    camposPeriodo: ['tempo'], camposInstituicao: ['area_csp'],
    camposValor: ['proporcao_mulheres_50_70_a_c_mamogr_2_anos', 'proporcao_mulheres_25_60_a_c_colpoc_atuali', 'proporcao_utentes_50_75_a_c_rastreio_cancro_cr'] },
  { slug: 'inscritos-em-lic-dentro-do-tmrg-180-dias', nome: 'Inscritos LIC TMRG',
    camposPeriodo: ['tempo'], camposInstituicao: ['instituicao'],
    camposValor: ['no_de_doentes_inscritos_dentro_do_tmrg_sigic', 'no_de_doentes_inscritos_sigic'] },
  { slug: 'ocupacao-do-internamento', nome: 'Ocupacao Internamento',
    camposPeriodo: ['tempo'], camposInstituicao: ['instituicao'],
    camposValor: ['no_de_dias_de_internamento', 'lotacao_praticada', 'taxa_anual_de_ocupacao_em_internamento'] },
];

async function fetchAllRecords(slug: string, maxRecords = 10000): Promise<Record<string, unknown>[]> {
  const all: Record<string, unknown>[] = [];
  let offset = 0;
  while (offset < maxRecords) {
    const url = `${SNS_BASE}/${slug}/records?limit=100&offset=${offset}`;
    const response = await fetch(url);
    if (!response.ok) break;
    const data = await response.json() as { results: Record<string, unknown>[]; total_count: number };
    all.push(...data.results);
    if (data.results.length < 100) break;
    offset += 100;
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  return all;
}

interface AggregatedRecord {
  periodo: string;
  indicadores: Record<string, number>;
  porULS?: Record<string, Record<string, number>>;
}

function aggregate(records: Record<string, unknown>[], config: ETLConfig): AggregatedRecord[] {
  const byPeriod = new Map<string, { nacional: Record<string, number>; porULS: Record<string, Record<string, number>> }>();

  for (const r of records) {
    let periodo: string | null = null;
    for (const f of config.camposPeriodo) {
      const v = r[f];
      if (v && typeof v === 'string') { periodo = v.substring(0, 7); break; }
    }
    if (!periodo) continue;

    let inst: string | null = null;
    for (const f of config.camposInstituicao) {
      const v = r[f];
      if (v && typeof v === 'string') { inst = v; break; }
    }

    if (!byPeriod.has(periodo)) byPeriod.set(periodo, { nacional: {}, porULS: {} });
    const entry = byPeriod.get(periodo)!;

    for (const field of config.camposValor) {
      const val = Number(r[field]);
      if (!isNaN(val)) {
        entry.nacional[field] = (entry.nacional[field] || 0) + val;
        if (inst) {
          if (!entry.porULS[inst]) entry.porULS[inst] = {};
          entry.porULS[inst][field] = (entry.porULS[inst][field] || 0) + val;
        }
      }
    }
  }

  return Array.from(byPeriod.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([periodo, data]) => {
      const result: AggregatedRecord = { periodo, indicadores: data.nacional };
      if (Object.keys(data.porULS).length > 0) result.porULS = data.porULS;
      return result;
    });
}

export const etlFullLoad = functions
  .region('europe-west1')
  .runWith({ timeoutSeconds: 540, memory: '1GB' })
  .https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }

    const targetSlug = req.query.dataset as string || 'all';
    const datasets = targetSlug === 'all' ? ETL_DATASETS : ETL_DATASETS.filter(d => d.slug === targetSlug);
    const results: { slug: string; records: number; periodos: number; status: string }[] = [];

    for (const config of datasets) {
      try {
        const raw = await fetchAllRecords(config.slug);
        const aggregated = aggregate(raw, config);
        const docData = {
          slug: config.slug, nome: config.nome,
          lastUpdated: new Date().toISOString(),
          totalRawRecords: raw.length,
          periodoMin: aggregated[0]?.periodo || null,
          periodoMax: aggregated[aggregated.length - 1]?.periodo || null,
          totalPeriodos: aggregated.length,
          dados: aggregated,
        };

        const docSize = JSON.stringify(docData).length;
        if (docSize > 900000) {
          await db.collection('datasets').doc(config.slug).set({ ...docData, dados: null, storage: 'subcollection' });
          const batch = db.batch();
          for (const record of aggregated) {
            batch.set(db.collection('datasets').doc(config.slug).collection('periodos').doc(record.periodo), record);
          }
          await batch.commit();
        } else {
          await db.collection('datasets').doc(config.slug).set(docData);
        }

        results.push({ slug: config.slug, records: raw.length, periodos: aggregated.length, status: `OK (${(docSize / 1024).toFixed(0)}KB)` });
      } catch (error) {
        results.push({ slug: config.slug, records: 0, periodos: 0, status: `ERROR: ${(error as Error).message}` });
      }
    }

    res.json({ timestamp: new Date().toISOString(), datasets: results });
  });

export const etlIncrementalRefresh = functions
  .region('europe-west1')
  .runWith({ timeoutSeconds: 300, memory: '512MB' })
  .pubsub.schedule('every day 06:00')
  .timeZone('Europe/Lisbon')
  .onRun(async () => {
    console.log('[ETL Refresh] Starting...');
    // Simplified: re-run full load for each dataset (incremental logic can be added later)
    for (const config of ETL_DATASETS) {
      try {
        const raw = await fetchAllRecords(config.slug, 5000);
        const aggregated = aggregate(raw, config);
        await db.collection('datasets').doc(config.slug).set({
          slug: config.slug, nome: config.nome,
          lastUpdated: new Date().toISOString(),
          totalRawRecords: raw.length,
          periodoMin: aggregated[0]?.periodo || null,
          periodoMax: aggregated[aggregated.length - 1]?.periodo || null,
          totalPeriodos: aggregated.length,
          dados: aggregated,
        });
      } catch (error) {
        console.error(`[ETL Refresh] ${config.slug}:`, error);
      }
    }
    return null;
  });
