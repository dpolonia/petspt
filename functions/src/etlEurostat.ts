import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

const db = admin.firestore();
const EUROSTAT_BASE = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';

interface EurostatConfig {
  code: string;
  nome: string;
  indicadorPETS: string;
  unidade: string;
  params: Record<string, string>;
}

const EUROSTAT_DATASETS: EurostatConfig[] = [
  { code: 'hlth_sha11_hf', nome: 'Despesa em saude (% PIB)', indicadorPETS: 'Contexto financeiro', unidade: '% PIB', params: { unit: 'PC_GDP', icha11_hf: 'TOT_HF' } },
  { code: 'hlth_co_proc2', nome: 'Cesarianas por 1.000 nados-vivos', indicadorPETS: 'Taxa cesarianas (Eixo 2)', unidade: 'por 1.000 nados-vivos', params: { icd10: 'O82', unit: 'P_LBIRD' } },
  { code: 'hlth_rs_bdsrg', nome: 'Camas hospitalares por 100.000 hab.', indicadorPETS: 'Camas (Eixo 3)', unidade: 'por 100.000 hab.', params: { unit: 'P_HTHAB' } },
];

const COUNTRIES = ['PT', 'ES', 'FR', 'IT', 'DE', 'EU27_2020'];

export const etlEurostat = functions
  .region('europe-west1')
  .runWith({ timeoutSeconds: 300, memory: '512MB' })
  .https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }

    const results: { code: string; status: string }[] = [];

    for (const config of EUROSTAT_DATASETS) {
      try {
        const geoParam = COUNTRIES.join(',');
        const extraParams = Object.entries(config.params).map(([k, v]) => `${k}=${v}`).join('&');
        const url = `${EUROSTAT_BASE}/${config.code}?geo=${geoParam}&sinceTimePeriod=2018&${extraParams}`;

        const response = await fetch(url);
        if (!response.ok) { results.push({ code: config.code, status: `HTTP ${response.status}` }); continue; }

        const data = await response.json();
        await db.collection('eurostat').doc(config.code).set({
          code: config.code, nome: config.nome, indicadorPETS: config.indicadorPETS,
          unidade: config.unidade, paises: COUNTRIES,
          rawData: data, lastUpdated: new Date().toISOString(),
        });
        results.push({ code: config.code, status: 'OK' });
      } catch (error) {
        results.push({ code: config.code, status: `ERROR: ${(error as Error).message}` });
      }
    }

    res.json({ results });
  });
