/**
 * Wrapper para a API dados.gov.pt
 * Documentação: https://dados.gov.pt/pt/dataservices/
 *
 * REQUER AUTENTICAÇÃO via API key.
 * Em produção: todas as chamadas passam pelo Cloud Function dadosGovProxy
 *   (a chave é injetada server-side, nunca exposta no browser).
 * Em dev: usa a Cloud Function local ou variável de ambiente (apenas em localhost).
 */

const PROXY_BASE = '/api/dadosgov';

export interface DadosGovQueryParams {
  endpoint: string;        // ex: 'datasets', 'dataservices/xxx'
  queryParams?: Record<string, string>;
}

export interface DadosGovResponse {
  data: unknown[];
  total: number;
  [key: string]: unknown;
}

/**
 * Executa query à API dados.gov.pt através do proxy Cloud Function.
 * A chave API é NUNCA exposta no frontend.
 */
export async function fetchDadosGov(params: DadosGovQueryParams): Promise<DadosGovResponse> {
  const { endpoint, queryParams = {} } = params;

  const searchParams = new URLSearchParams(queryParams);

  const url = `${PROXY_BASE}/${endpoint}?${searchParams.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`dados.gov.pt API error: ${response.status} ${response.statusText} [endpoint: ${endpoint}]`);
  }

  return response.json();
}

/**
 * Pesquisa datasets de saúde no dados.gov.pt
 */
export async function searchHealthDatasets(query = 'saude', pageSize = 20): Promise<DadosGovResponse> {
  return fetchDadosGov({
    endpoint: 'datasets',
    queryParams: { q: query, page_size: String(pageSize) },
  });
}
