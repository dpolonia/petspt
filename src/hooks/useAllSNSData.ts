import { useState, useCallback } from 'react';
import { fetchAllSNSRecords, SNSQueryParams, SNSRecord } from '../services/snsApi';

/**
 * Hook for fetching ALL records with automatic pagination.
 * Call refetch() to trigger data loading (not automatic on mount).
 * For automatic loading, use the autoFetch wrapper below.
 */
export function useAllSNSData(
  params: Omit<SNSQueryParams, 'offset'> | null,
  maxRecords = 3000,
) {
  const [data, setData] = useState<SNSRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState('');

  const paramsKey = params ? JSON.stringify(params) : '';

  // Auto-fetch when params change (triggered during render, not in effect)
  if (paramsKey && paramsKey !== fetched && !loading) {
    setFetched(paramsKey);
    setLoading(true);
    setError(null);
    fetchAllSNSRecords(params!, maxRecords)
      .then(records => { setData(records); setLoading(false); })
      .catch(err => { setError(err instanceof Error ? err.message : 'Erro'); setLoading(false); });
  }

  const refetch = useCallback(() => {
    if (!params) return;
    setLoading(true);
    setError(null);
    fetchAllSNSRecords(params, maxRecords)
      .then(records => { setData(records); setLoading(false); })
      .catch(err => { setError(err instanceof Error ? err.message : 'Erro'); setLoading(false); });
  }, [params, maxRecords]);

  return { data, loading, error, refetch };
}
