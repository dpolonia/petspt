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

/**
 * Loads multiple Firestore datasets at once.
 * Handles both inline dados[] and subcollection storage.
 */
export function useMultiFirestore(slugs: string[]): MultiFirestoreResult {
  const [data, setData] = useState<Record<string, FirestoreDataPoint[]>>({});
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const key = slugs.sort().join(',');

  if (key && !loaded && !loading) {
    setLoading(true);
    Promise.all(
      slugs.map(async (slug) => {
        try {
          const snap = await getDoc(doc(db, 'datasets', slug));
          if (snap.exists()) {
            const d = snap.data();

            // If stored as subcollection (>900KB), read from periodos subcollection
            if (d.storage === 'subcollection') {
              const periodosSnap = await getDocs(collection(db, 'datasets', slug, 'periodos'));
              const periodos = periodosSnap.docs
                .map(pd => pd.data() as FirestoreDataPoint)
                .sort((a, b) => a.periodo.localeCompare(b.periodo));
              return [slug, periodos] as const;
            }

            // Otherwise read inline dados array
            return [slug, (d.dados || []) as FirestoreDataPoint[]] as const;
          }
        } catch { /* skip */ }
        return [slug, [] as FirestoreDataPoint[]] as const;
      })
    ).then(results => {
      const map: Record<string, FirestoreDataPoint[]> = {};
      for (const [slug, dados] of results) map[slug] = dados;
      setData(map);
      setLoaded(true);
      setLoading(false);
    });
  }

  return { data, loading, loaded };
}
