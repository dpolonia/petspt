/**
 * Wrapper para a API ODS v2.1 do Portal Transparência SNS
 * Documentação: https://transparencia.sns.gov.pt/api/explore/v2.1/console
 *
 * Esta API é PÚBLICA e não requer autenticação.
 */

const BASE_URL = 'https://transparencia.sns.gov.pt/api/explore/v2.1/catalog/datasets';

export interface SNSQueryParams {
  dataset: string;
  select?: string;
  where?: string;
  groupBy?: string;
  orderBy?: string;
  limit?: number;
  offset?: number;
}

export interface SNSRecord {
  [key: string]: unknown;
}

export interface SNSResponse {
  total_count: number;
  results: SNSRecord[];
}

/**
 * Executa query à API Transparência SNS.
 * Em produção, as chamadas passam pelo proxy Cloud Function para contornar CORS.
 * Em dev, usa-se o proxy do Vite ou chamada direta.
 */
export async function fetchSNSData(params: SNSQueryParams): Promise<SNSResponse> {
  const {
    dataset,
    select = '*',
    where,
    groupBy,
    orderBy,
    limit = 100,
    offset = 0,
  } = params;

  const searchParams = new URLSearchParams();
  searchParams.set('select', select);
  if (where) searchParams.set('where', where);
  if (groupBy) searchParams.set('group_by', groupBy);
  if (orderBy) searchParams.set('order_by', orderBy);
  searchParams.set('limit', String(limit));
  searchParams.set('offset', String(offset));

  // API Transparencia SNS is public with CORS — always call directly
  const url = `${BASE_URL}/${dataset}/records?${searchParams.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`SNS API error: ${response.status} ${response.statusText} [dataset: ${dataset}]`);
  }

  // Validate response is JSON before parsing
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json') && !contentType.includes('text/json')) {
    const preview = await response.text();
    throw new Error(
      `SNS API returned non-JSON (${contentType}) for ${dataset}. Preview: ${preview.substring(0, 80)}...`
    );
  }

  return response.json();
}

/**
 * Busca todos os registos de um dataset com paginação automática.
 * Usa limit/offset para iterar. Parâmetro maxRecords para segurança.
 */
export async function fetchAllSNSRecords(
  params: Omit<SNSQueryParams, 'offset'>,
  maxRecords = 10000
): Promise<SNSRecord[]> {
  const allRecords: SNSRecord[] = [];
  let offset = 0;
  const limit = params.limit || 100;

  while (offset < maxRecords) {
    const response = await fetchSNSData({ ...params, limit, offset });
    allRecords.push(...response.results);

    if (response.results.length < limit) break;
    offset += limit;
  }

  return allRecords;
}

/**
 * Lista datasets disponíveis no catálogo SNS.
 */
export async function listSNSDatasets(): Promise<unknown[]> {
  const url = `${BASE_URL}?limit=100`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`SNS catalog error: ${response.status}`);
  return (await response.json()).results;
}
