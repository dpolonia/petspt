/**
 * Wrappers for macro-economic and budget APIs.
 * All public, no authentication required.
 */

const INE_BASE = 'https://www.ine.pt/ine/json_indicador/pindica.jsp';

export async function fetchINE(varcd: string, dim1: string): Promise<unknown> {
  const url = `${INE_BASE}?op=2&varcd=${varcd}&Dim1=${dim1}&lang=PT`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`INE API error: ${response.status}`);
  return response.json();
}

const EUROSTAT_BASE = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';

export async function fetchEurostat(dataset: string, params: Record<string, string> = {}): Promise<unknown> {
  const searchParams = new URLSearchParams({ geo: 'PT', ...params });
  const url = `${EUROSTAT_BASE}/${dataset}?${searchParams.toString()}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Eurostat API error: ${response.status}`);
  return response.json();
}

export async function fetchSNSBudget(ano: number): Promise<{ total_eur: number; fonte: string } | null> {
  // Hardcoded fallback — INE/dados.gov.pt APIs may have CORS issues in browser
  const budgets: Record<number, number> = {
    2023: 13_200_000_000,
    2024: 14_500_000_000,
    2025: 15_200_000_000,
    2026: 15_800_000_000,
  };
  const val = budgets[ano];
  if (!val) return null;
  return { total_eur: val, fonte: 'hardcoded_oe' };
}
