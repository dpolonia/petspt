/**
 * Hook to read Power BI extracted data from Firestore.
 * Data from SIGLIC/SICA via Power BI API extraction.
 *
 * Priority: PowerBI (SIGLIC/SICA) > Transparencia SNS > GT PETS reports
 *
 * Firestore structure:
 *   powerbi_data/{eixoN} → { series_key: [{ periodo, valor }], ... }
 */

import { useState, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface PowerBIDataPoint {
  periodo: string;
  valor: number;
  [key: string]: string | number | undefined;
}

export interface PowerBIEixoData {
  [seriesKey: string]: PowerBIDataPoint[];
}

interface UsePowerBIDataResult {
  data: PowerBIEixoData;
  loading: boolean;
  loaded: boolean;
}

const SESSION_KEY = 'pbi_data_';
let _cache: Record<string, PowerBIEixoData> = {};
let _loading: Record<string, boolean> = {};

export function usePowerBIData(eixo: number): UsePowerBIDataResult {
  const [, forceUpdate] = useState(0);
  const key = `eixo${eixo}`;

  const load = useCallback(() => {
    if (_cache[key] || _loading[key]) return;

    // Check sessionStorage first
    const cached = sessionStorage.getItem(SESSION_KEY + key);
    if (cached) {
      try {
        _cache[key] = JSON.parse(cached);
        forceUpdate(n => n + 1);
        return;
      } catch { /* ignore */ }
    }

    _loading[key] = true;
    forceUpdate(n => n + 1);

    getDoc(doc(db, 'powerbi_data', key))
      .then(snap => {
        if (snap.exists()) {
          const raw = snap.data();
          const parsed: PowerBIEixoData = {};
          for (const [k, v] of Object.entries(raw)) {
            if (Array.isArray(v) && v.length > 0 && v[0]?.periodo !== undefined) {
              parsed[k] = v.filter((d: PowerBIDataPoint) =>
                d.periodo && (typeof d.valor === 'number' || !isNaN(Number(d.valor)))
              ).map((d: PowerBIDataPoint) => ({
                ...d,
                valor: typeof d.valor === 'number' ? d.valor : Number(d.valor),
              }));
            }
          }
          _cache[key] = parsed;
          try {
            sessionStorage.setItem(SESSION_KEY + key, JSON.stringify(parsed));
          } catch { /* quota exceeded */ }
        } else {
          _cache[key] = {};
        }
      })
      .catch(() => {
        _cache[key] = {};
      })
      .finally(() => {
        _loading[key] = false;
        forceUpdate(n => n + 1);
      });
  }, [key, forceUpdate]);

  if (!_cache[key] && !_loading[key]) load();

  return {
    data: _cache[key] || {},
    loading: !!_loading[key],
    loaded: !!_cache[key],
  };
}

/** Get a specific series from Power BI data */
export function getPBISeries(data: PowerBIEixoData, seriesKey: string): PowerBIDataPoint[] {
  return data[seriesKey] || [];
}

/** Filter Power BI data to a date range */
export function filterPBIFromBaseline(
  series: PowerBIDataPoint[],
  baseline: string = '2024-01',
): PowerBIDataPoint[] {
  return series.filter(d => d.periodo >= baseline);
}
