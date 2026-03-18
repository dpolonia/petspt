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
      const msg = err instanceof Error ? err.message : 'Erro ao carregar dados da API SNS';
      setError(msg);
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
