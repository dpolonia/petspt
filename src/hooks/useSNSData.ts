import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchSNSData, SNSQueryParams, SNSRecord } from '../services/snsApi';

interface UseSNSDataResult {
  data: SNSRecord[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const cache = new Map<string, { data: SNSRecord[]; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000;

function getCacheKey(params: SNSQueryParams): string {
  return JSON.stringify(params);
}

export function useSNSData(params: SNSQueryParams | null): UseSNSDataResult {
  const [data, setData] = useState<SNSRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paramsRef = useRef(params ? JSON.stringify(params) : null);

  const fetchData = useCallback(async () => {
    if (!params) return;

    const key = getCacheKey(params);
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setData(cached.data);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetchSNSData(params);
      const records = response.results || [];
      cache.set(key, { data: records, timestamp: Date.now() });
      setData(records);
    } catch (err) {
      // Retry without where/orderBy/groupBy/select if query failed (400 Bad Request)
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('400') && (params.where || params.orderBy || params.groupBy || params.select)) {
        try {
          const fallback: SNSQueryParams = { dataset: params.dataset, limit: params.limit || 100 };
          const response = await fetchSNSData(fallback);
          const records = response.results || [];
          cache.set(getCacheKey(fallback), { data: records, timestamp: Date.now() });
          setData(records);
          setLoading(false);
          return;
        } catch { /* fallback also failed */ }
      }
      setError(msg || 'Erro ao carregar dados da API SNS');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    const newKey = params ? JSON.stringify(params) : null;
    if (newKey !== paramsRef.current) {
      paramsRef.current = newKey;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
