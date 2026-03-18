import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

admin.initializeApp();
const db = admin.firestore();

const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 horas

// ──────────────────────────────────────
// PROXY 1: Transparência SNS (pública)
// ──────────────────────────────────────
export const snsProxy = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');

    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }

    const { dataset, ...queryParams } = req.query as Record<string, string>;
    if (!dataset) { res.status(400).json({ error: 'Missing dataset parameter' }); return; }

    // Verificar cache
    const cacheKey = `sns_${dataset}_${JSON.stringify(queryParams)}`;
    const cacheRef = db.collection('cache').doc(cacheKey.replace(/[/\\]/g, '_').substring(0, 500));
    const cached = await cacheRef.get();

    if (cached.exists) {
      const data = cached.data()!;
      if (Date.now() - data.timestamp < CACHE_TTL_MS) {
        res.json(data.payload);
        return;
      }
    }

    // Fetch da API SNS
    const searchParams = new URLSearchParams(queryParams);
    const url = `https://transparencia.sns.gov.pt/api/explore/v2.1/catalog/datasets/${dataset}/records?${searchParams.toString()}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        res.status(response.status).json({ error: `SNS API error: ${response.statusText}` });
        return;
      }

      const payload = await response.json();

      // Guardar em cache
      await cacheRef.set({ payload, timestamp: Date.now() });

      res.json(payload);
    } catch (error) {
      res.status(500).json({ error: `Proxy error: ${(error as Error).message}` });
    }
  });

// ──────────────────────────────────────
// PROXY 2: dados.gov.pt (autenticada)
// ──────────────────────────────────────
export const dadosGovProxy = functions
  .region('europe-west1')
  .https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');

    if (req.method === 'OPTIONS') { res.status(204).send(''); return; }

    const { endpoint, ...queryParams } = req.query as Record<string, string>;
    if (!endpoint) { res.status(400).json({ error: 'Missing endpoint parameter' }); return; }

    // Obter API key de forma segura (Firebase Functions config)
    const apiKey = functions.config().dados?.api_key;
    if (!apiKey) {
      res.status(500).json({ error: 'DADOS_GOV_API_KEY not configured on server. Run: firebase functions:config:set dados.api_key="YOUR_KEY"' });
      return;
    }

    // Verificar cache
    const cacheKey = `dgov_${endpoint}_${JSON.stringify(queryParams)}`;
    const cacheRef = db.collection('cache').doc(cacheKey.replace(/[/\\]/g, '_').substring(0, 500));
    const cached = await cacheRef.get();

    if (cached.exists) {
      const data = cached.data()!;
      if (Date.now() - data.timestamp < CACHE_TTL_MS) {
        res.json(data.payload);
        return;
      }
    }

    // Fetch da API dados.gov.pt com chave injetada server-side
    const searchParams = new URLSearchParams(queryParams);
    const url = `https://dados.gov.pt/api/1/${endpoint}?${searchParams.toString()}`;

    try {
      const response = await fetch(url, {
        headers: { 'X-API-KEY': apiKey },
      });

      if (!response.ok) {
        res.status(response.status).json({ error: `dados.gov.pt API error: ${response.statusText}` });
        return;
      }

      const payload = await response.json();

      // Guardar em cache
      await cacheRef.set({ payload, timestamp: Date.now() });

      res.json(payload);
    } catch (error) {
      res.status(500).json({ error: `Proxy error: ${(error as Error).message}` });
    }
  });

// ──────────────────────────────────────
// CRON: Refresh diário do cache
// ──────────────────────────────────────
export const scheduledRefresh = functions
  .region('europe-west1')
  .pubsub.schedule('every 24 hours')
  .onRun(async () => {
    // Limpar cache expirado
    const cutoff = Date.now() - CACHE_TTL_MS;
    const expired = await db.collection('cache').where('timestamp', '<', cutoff).get();

    const batch = db.batch();
    expired.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();

    console.log(`Cache cleanup: removed ${expired.size} expired entries`);
    return null;
  });

export { aiSummary } from './aiSummary';
export { contractPipeline, contractPipelineScheduled } from './contractPipeline';
