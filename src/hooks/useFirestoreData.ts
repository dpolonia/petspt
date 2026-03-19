import { useState } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { fetchAllSNSRecords } from '../services/snsApi';

export interface FirestoreDataPoint {
  periodo: string;
  indicadores: Record<string, number>;
  porULS?: Record<string, Record<string, number>>;
}

interface UseFirestoreDataResult {
  dados: FirestoreDataPoint[];
  metadata: { slug: string; lastUpdated: string; periodoMin: string; periodoMax: string; totalPeriodos: number } | null;
  loading: boolean;
  error: string | null;
  source: 'firestore' | 'api_fallback';
}

export function useFirestoreData(datasetSlug: string | null): UseFirestoreDataResult {
  const [dados, setDados] = useState<FirestoreDataPoint[]>([]);
  const [metadata, setMetadata] = useState<UseFirestoreDataResult['metadata']>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'firestore' | 'api_fallback'>('firestore');
  const [fetched, setFetched] = useState('');

  if (datasetSlug && datasetSlug !== fetched && !loading) {
    setFetched(datasetSlug);
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const docRef = doc(db, 'datasets', datasetSlug);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.storage === 'subcollection') {
            const periodosSnap = await getDocs(collection(db, 'datasets', datasetSlug, 'periodos'));
            setDados(periodosSnap.docs.map(d => d.data() as FirestoreDataPoint).sort((a, b) => a.periodo.localeCompare(b.periodo)));
          } else {
            setDados(data.dados || []);
          }
          setMetadata({ slug: data.slug, lastUpdated: data.lastUpdated, periodoMin: data.periodoMin, periodoMax: data.periodoMax, totalPeriodos: data.totalPeriodos });
          setSource('firestore');
          setLoading(false);
          return;
        }

        // Fallback to API
        setSource('api_fallback');
        const records = await fetchAllSNSRecords({ dataset: datasetSlug, limit: 100 }, 3000);
        const byPeriod = new Map<string, Record<string, number>>();
        for (const r of records as Record<string, unknown>[]) {
          let periodo: string | null = null;
          for (const key of Object.keys(r)) {
            const val = r[key];
            if (typeof val === 'string' && /^\d{4}-\d{2}/.test(val)) { periodo = val.substring(0, 7); break; }
          }
          if (!periodo) continue;
          if (!byPeriod.has(periodo)) byPeriod.set(periodo, {});
          const entry = byPeriod.get(periodo)!;
          for (const [key, val] of Object.entries(r)) {
            if (typeof val === 'number') entry[key] = (entry[key] || 0) + val;
          }
        }
        setDados(Array.from(byPeriod.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([periodo, indicadores]) => ({ periodo, indicadores })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro');
      } finally {
        setLoading(false);
      }
    })();
  }

  return { dados, metadata, loading, error, source };
}
