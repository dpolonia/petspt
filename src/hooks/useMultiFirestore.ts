import { useState } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

interface FirestoreDataPoint {
  periodo: string;
  indicadores: Record<string, number>;
}

interface MultiFirestoreResult {
  data: Record<string, FirestoreDataPoint[]>;
  loading: boolean;
  loaded: boolean;
}

async function loadDatasets(slugs: string[]): Promise<Record<string, FirestoreDataPoint[]>> {
  const results = await Promise.all(
    slugs.map(async (slug) => {
      try {
        const snap = await getDoc(doc(db, 'datasets', slug));
        if (snap.exists()) {
          const d = snap.data();
          if (d.storage === 'subcollection') {
            const periodosSnap = await getDocs(collection(db, 'datasets', slug, 'periodos'));
            return [slug, periodosSnap.docs.map(pd => pd.data() as FirestoreDataPoint).sort((a, b) => a.periodo.localeCompare(b.periodo))] as const;
          }
          return [slug, (d.dados || []) as FirestoreDataPoint[]] as const;
        }
      } catch { /* skip */ }
      return [slug, [] as FirestoreDataPoint[]] as const;
    })
  );
  const map: Record<string, FirestoreDataPoint[]> = {};
  for (const [slug, dados] of results) map[slug] = dados;
  return map;
}

export function useMultiFirestore(slugs: string[]): MultiFirestoreResult {
  const [data, setData] = useState<Record<string, FirestoreDataPoint[]>>({});
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false);

  // Trigger fetch once on first render with slugs
  if (slugs.length > 0 && !started && !loading && !loaded) {
    setStarted(true);
    setLoading(true);
    loadDatasets(slugs).then(result => {
      setData(result);
      setLoaded(true);
      setLoading(false);
    });
  }

  return { data, loading, loaded };
}
