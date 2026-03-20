#!/usr/bin/env node
/**
 * Load Power BI extracted data to Firestore.
 * Creates/updates powerbi_data/{eixoN} documents.
 *
 * Usage: node scripts/loadPowerBIToFirestore.js
 * Requires: GOOGLE_APPLICATION_CREDENTIALS or serviceAccountKey.json
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const saPath = path.join(__dirname, '..', 'serviceAccountKey.json');
    if (fs.existsSync(saPath)) {
      const sa = require(saPath);
      admin.initializeApp({ credential: admin.credential.cert(sa) });
    } else {
      admin.initializeApp({ credential: admin.credential.applicationDefault() });
    }
  } catch (e) {
    console.error('Firebase init failed:', e.message);
    console.error('Place serviceAccountKey.json in project root or set GOOGLE_APPLICATION_CREDENTIALS');
    process.exit(1);
  }
}

const db = admin.firestore();

async function loadPowerBIData() {
  const dataPath = path.join(__dirname, '..', 'data', 'sns_pets', 'powerbi_extracted_data.json');
  const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const eixos = ['eixo1', 'eixo2', 'eixo3', 'eixo4', 'eixo5'];
  let totalPoints = 0;

  for (const eixoKey of eixos) {
    const eixoData = raw[eixoKey];
    if (!eixoData || typeof eixoData !== 'object') continue;

    // Filter to only array series (skip metadata objects)
    const seriesData = {};
    let eixoPoints = 0;

    for (const [key, value] of Object.entries(eixoData)) {
      if (Array.isArray(value)) {
        // Clean data: ensure valor is numeric
        seriesData[key] = value.map(d => ({
          periodo: String(d.periodo),
          valor: typeof d.valor === 'number' ? d.valor : parseFloat(d.valor) || 0,
          ...(d.total !== undefined ? { total: d.total } : {}),
          ...(d.com_mdf !== undefined ? { com_mdf: d.com_mdf } : {}),
          ...(d.sem_mdf !== undefined ? { sem_mdf: d.sem_mdf } : {}),
        }));
        eixoPoints += value.length;
      }
    }

    console.log(`Loading ${eixoKey}: ${Object.keys(seriesData).length} series, ${eixoPoints} points`);

    await db.collection('powerbi_data').doc(eixoKey).set({
      ...seriesData,
      _metadata: {
        source: 'SNS PETS Power BI Dashboard',
        extractionDate: '2026-03-20',
        method: 'API querydata + Playwright interception',
        seriesCount: Object.keys(seriesData).length,
        totalPoints: eixoPoints,
      },
      _lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    });

    totalPoints += eixoPoints;
  }

  // Also load SDM/BI-CSP indicator data
  const sdmPath = path.join(__dirname, '..', 'data', 'bicsp', 'sdm_pets_indicators.json');
  if (fs.existsSync(sdmPath)) {
    const sdmRaw = JSON.parse(fs.readFileSync(sdmPath, 'utf8'));
    const indicators = sdmRaw.indicators || sdmRaw;

    await db.collection('sdm_data').doc('indicators').set({
      indicators: Array.isArray(indicators) ? indicators : [],
      _metadata: {
        source: 'SDM (sdm.min-saude.pt)',
        fetchDate: '2026-03-20',
        totalIndicators: Array.isArray(indicators) ? indicators.length : 0,
      },
      _lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Loaded SDM: ${Array.isArray(indicators) ? indicators.length : 0} indicators`);
  }

  // Load BI-CSP PDF-extracted indicators
  const pdfPath = path.join(__dirname, '..', 'data', 'bicsp', 'operacionalizacao', 'extracted_indicators.json');
  if (fs.existsSync(pdfPath)) {
    const pdfIndicators = JSON.parse(fs.readFileSync(pdfPath, 'utf8'));

    await db.collection('sdm_data').doc('operacionalizacao_indicators').set({
      indicators: pdfIndicators,
      _metadata: {
        source: 'ACSS Operacionalização CSP PDFs (2021-2024)',
        fetchDate: '2026-03-20',
        totalIndicators: pdfIndicators.length,
      },
      _lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Loaded PDF indicators: ${pdfIndicators.length}`);
  }

  console.log(`\nTotal Power BI points loaded: ${totalPoints}`);
  console.log('Collections: powerbi_data (5 docs), sdm_data (2 docs)');
}

loadPowerBIData()
  .then(() => {
    console.log('Done.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
