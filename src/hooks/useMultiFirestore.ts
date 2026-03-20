import { useState, useCallback } from 'react';
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
  load: () => void;
}

// Module-level cache — survives re-renders
let _cache: Record<string, FirestoreDataPoint[]> | null = null;
let _loading = false;

async function fetchAll(slugs: string[]): Promise<Record<string, FirestoreDataPoint[]>> {
  const results = await Promise.all(
    slugs.map(async (slug) => {
      try {
        const snap = await getDoc(doc(db, 'datasets', slug));
        if (snap.exists()) {
          const d = snap.data();
          if (d.storage === 'subcollection') {
            const ps = await getDocs(collection(db, 'datasets', slug, 'periodos'));
            return [slug, ps.docs.map(p => p.data() as FirestoreDataPoint).sort((a, b) => a.periodo.localeCompare(b.periodo))] as const;
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
  const [, forceUpdate] = useState(0);

  const load = useCallback(() => {
    if (_cache || _loading || slugs.length === 0) return;
    _loading = true;
    fetchAll(slugs).then(result => {
      _cache = result;
      _loading = false;
      forceUpdate(n => n + 1);
    }).catch(() => {
      _loading = false;
    });
  }, [slugs, forceUpdate]);

  // Auto-load on first call
  if (!_cache && !_loading && slugs.length > 0) {
    load();
  }

  return {
    data: _cache || {},
    loading: _loading,
    loaded: !!_cache,
    load,
  };
}
