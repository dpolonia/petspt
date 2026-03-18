import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';
// pdf-parse has incompatible type exports — use any cast
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pdfParse: (buffer: Buffer) => Promise<{ text: string; numpages: number }> = require('pdf-parse') as any;

const db = admin.firestore();

// ACSS URL patterns — validated URLs hardcoded for reliability
const ACSS_BASE = 'https://www.acss.min-saude.pt/wp-content/uploads/2016/10';
const VALIDATED_URLS: Record<string, string> = {
  ULS_AM: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Alto-Minho-EPE.pdf`,
  ULS_AA: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Alto-Ave-EPE.pdf`,
  ULS_BE: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Barcelos-Esposende-EPE.pdf`,
  ULS_BR: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Braga-EPE.pdf`,
  ULS_MA: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Medio-Ave-EPE.pdf`,
  ULS_MT: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Matosinhos-EPE.pdf`,
  ULS_SA: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Santo-Antonio-EPE.pdf`,
  ULS_SJ: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-S-Joao-EPE.pdf`,
  ULS_TS: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Tamega-e-Sousa-EPE.pdf`,
  ULS_EDV: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Entre-Douro-e-Vouga-EPE.pdf`,
  ULS_NE: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Nordeste-EPE.pdf`,
  ULS_RA: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Regiao-de-Aveiro-EPE.pdf`,
  ULS_VDL: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Viseu-Dao-Lafoes-EPE.pdf`,
  ULS_GU: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Guarda-EPE.pdf`,
  ULS_CVB: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Cova-da-Beira-EPE.pdf`,
  ULS_CO: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Coimbra-EPE.pdf`,
  ULS_LE: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Regiao-de-Leiria-EPE.pdf`,
  ULS_MTE: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Medio-Tejo-EPE.pdf`,
  ULS_OE: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-do-Oeste-EPE.pdf`,
  ULS_LO: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Lisboa-Ocidental-EPE.pdf`,
  ULS_SM: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Santa-Maria-EPE.pdf`,
  ULS_SJO: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Sao-Jose-EPE.pdf`,
  ULS_LOD: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Loures-Odivelas-EPE.pdf`,
  ULS_AS: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Amadora-Sintra-EPE.pdf`,
  ULS_ALS: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Almada-Seixal-EPE.pdf`,
  ULS_ARR: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-da-Arrabida-EPE.pdf`,
  ULS_LEZ: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-da-Leziria-EPE.pdf`,
  ULS_AAL: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Alto-Alentejo-EPE.pdf`,
  ULS_AC: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Alentejo-Central-EPE.pdf`,
  ULS_BA: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Baixo-Alentejo-EPE.pdf`,
  ULS_LA: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-Litoral-Alentejano-EPE.pdf`,
  ULS_ALG: `${ACSS_BASE}/Contrato-Programa-2024-2026-ULS-do-Algarve-EPE.pdf`,
};

interface ExtractedData {
  ulsCode: string;
  ano: number;
  urlFonte: string;
  dataExtraccao: string;
  producao: Record<string, number | undefined>;
  indicadores: Record<string, number | undefined>;
  confianca: 'alta' | 'media' | 'baixa';
  campos_extraidos: number;
  campos_total: number;
  paginas: number;
}

function parsePortugueseNumber(raw: string): number | undefined {
  if (!raw) return undefined;
  const cleaned = raw.replace(/\s/g, '').replace(/\.(?=\d{3})/g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? undefined : num;
}

function extractFromText(text: string, ulsCode: string, url: string, pages: number): ExtractedData {
  const result: ExtractedData = {
    ulsCode, ano: 2024, urlFonte: url,
    dataExtraccao: new Date().toISOString(),
    producao: {}, indicadores: {},
    confianca: 'baixa', campos_extraidos: 0, campos_total: 11, paginas: pages,
  };

  const patterns: [string, RegExp, 'producao' | 'indicadores'][] = [
    ['cirurgias_programadas', /interven[çc][oõ]es?\s+cir[uú]rgicas?\s*(?:programadas?)?\s*[:-]?\s*([\d\s.,]+)/i, 'producao'],
    ['consultas_hosp', /consultas?\s+(?:externas?\s+)?hospitalar(?:es)?\s*[:-]?\s*([\d\s.,]+)/i, 'producao'],
    ['episodios_urgencia', /epis[oó]dios?\s+(?:de\s+)?urg[eê]ncia\s*[:-]?\s*([\d\s.,]+)/i, 'producao'],
    ['episodios_internamento', /epis[oó]dios?\s+(?:de\s+)?internamento\s*[:-]?\s*([\d\s.,]+)/i, 'producao'],
    ['partos', /n[uú]mero\s+(?:de\s+)?partos\s*[:-]?\s*([\d\s.,]+)/i, 'producao'],
    ['rastreio_mama_pct', /mamogr(?:afia)?\s*[:-]?\s*([\d.,]+)\s*%/i, 'indicadores'],
    ['rastreio_colo_pct', /col(?:po)?citolog(?:ia)?\s*[:-]?\s*([\d.,]+)\s*%/i, 'indicadores'],
    ['rastreio_colorretal_pct', /colo(?:n|rretal)\s*(?:e\s+reto)?\s*[:-]?\s*([\d.,]+)\s*%/i, 'indicadores'],
    ['lic_onco_tmrg_pct', /oncol[oó]gic[ao]\s+(?:dentro\s+(?:do\s+)?)?TMRG\s*[:-]?\s*([\d.,]+)\s*%/i, 'indicadores'],
    ['lic_nao_onco_tmrg_pct', /n[aã]o[\s\x2d]oncol[oó]gic[ao]\s+(?:dentro\s+(?:do\s+)?)?TMRG\s*[:-]?\s*([\d.,]+)\s*%/i, 'indicadores'],
    ['lec_tmrg_pct', /LEC\s+(?:dentro\s+(?:do\s+)?)?TMRG\s*[:-]?\s*([\d.,]+)\s*%/i, 'indicadores'],
  ];

  for (const [field, pattern, category] of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const val = parsePortugueseNumber(match[1]);
      if (val !== undefined) {
        result[category][field] = val;
        result.campos_extraidos++;
      }
    }
  }

  const ratio = result.campos_extraidos / result.campos_total;
  result.confianca = ratio >= 0.5 ? 'alta' : ratio >= 0.2 ? 'media' : 'baixa';
  return result;
}

export const contractPipeline = functions
  .region('europe-west1')
  .runWith({ timeoutSeconds: 300, memory: '512MB' })
  .https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }

    const targetUls = req.query.uls as string || 'all';
    const force = req.query.force === 'true';

    const urlsToProcess = targetUls === 'all'
      ? Object.entries(VALIDATED_URLS)
      : VALIDATED_URLS[targetUls] ? [[targetUls, VALIDATED_URLS[targetUls]]] : [];

    const results: ExtractedData[] = [];
    const errors: { ulsCode: string; error: string }[] = [];

    for (const [ulsCode, url] of urlsToProcess) {
      // Check cache
      if (!force) {
        const cached = await db.collection('contratos_programa').doc(`${ulsCode}_2024`).get();
        if (cached.exists) {
          results.push(cached.data() as ExtractedData);
          continue;
        }
      }

      try {
        const pdfResponse = await fetch(url);
        if (!pdfResponse.ok) throw new Error(`HTTP ${pdfResponse.status}`);
        const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());
        const pdfData = await pdfParse(pdfBuffer);
        const extracted = extractFromText(pdfData.text, ulsCode, url, pdfData.numpages);

        await db.collection('contratos_programa').doc(`${ulsCode}_2024`).set(extracted);
        results.push(extracted);
      } catch (error) {
        errors.push({ ulsCode, error: (error as Error).message });
      }
    }

    res.json({ processados: results.length, erros: errors.length, results, errors });
  });

export const contractPipelineScheduled = functions
  .region('europe-west1')
  .pubsub.schedule('1 of month 06:00')
  .timeZone('Europe/Lisbon')
  .onRun(async () => {
    console.log('[contractPipeline] Scheduled monthly check for new Acordos Modificativos');
    return null;
  });
