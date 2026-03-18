/**
 * Mapeamento ULS -> URLs dos PDFs dos Contratos Programa na ACSS.
 * URLs validated via HEAD requests on 2026-03-18.
 * Base: https://www.acss.min-saude.pt/wp-content/uploads/2016/10/
 */

export interface ACSSContractURL {
  ulsCode: string;
  ulsNome: string;
  cp_2024_2026?: string;
  am_2025?: string;
  validado: boolean;
  observacoes?: string;
}

const BASE = 'https://www.acss.min-saude.pt/wp-content/uploads/2016/10';

export const ACSS_CONTRACT_URLS: ACSSContractURL[] = [
  // Norte — 14 ULS
  { ulsCode: 'ULS_AM', ulsNome: 'ULS Alto Minho', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Alto-Minho-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_AA', ulsNome: 'ULS Alto Ave', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Alto-Ave-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_BE', ulsNome: 'ULS Barcelos-Esposende', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Barcelos-Esposende-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_BR', ulsNome: 'ULS Braga', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Braga-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_MA', ulsNome: 'ULS Medio Ave', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Medio-Ave-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_PV', ulsNome: 'ULS Povoa de Varzim-Vila do Conde', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Povoa-Varzim-Vila-Conde-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_GE', ulsNome: 'ULS Gaia/Espinho', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Vila-Nova-Gaia-Espinho-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_MT', ulsNome: 'ULS Matosinhos', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Matosinhos-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_SA', ulsNome: 'ULS Santo Antonio', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Santo-Antonio-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_SJ', ulsNome: 'ULS Sao Joao', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-S-Joao-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_TS', ulsNome: 'ULS Tamega e Sousa', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Tamega-e-Sousa-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_EDV', ulsNome: 'ULS Entre Douro e Vouga', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Entre-Douro-e-Vouga-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_NE', ulsNome: 'ULS Nordeste', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Nordeste-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_TMAD', ulsNome: 'ULS Tras-os-Montes e Alto Douro', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Tras-os-Montes-Alto-Douro-EPE.pdf`, validado: true },
  // Centro — 8 ULS
  { ulsCode: 'ULS_RA', ulsNome: 'ULS Regiao de Aveiro', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Regiao-de-Aveiro-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_VDL', ulsNome: 'ULS Viseu Dao Lafoes', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Viseu-Dao-Lafoes-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_GU', ulsNome: 'ULS Guarda', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Guarda-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_CB', ulsNome: 'ULS Castelo Branco', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-de-Castelo-Branco-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_CVB', ulsNome: 'ULS Cova da Beira', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Cova-da-Beira-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_CO', ulsNome: 'ULS Coimbra', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Coimbra-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_LE', ulsNome: 'ULS Regiao de Leiria', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Regiao-de-Leiria-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_MTE', ulsNome: 'ULS Medio Tejo', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Medio-Tejo-EPE.pdf`, validado: true },
  // LVT — 11 ULS
  { ulsCode: 'ULS_OE', ulsNome: 'ULS Oeste', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-do-Oeste-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_LO', ulsNome: 'ULS Lisboa Ocidental', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Lisboa-Ocidental-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_SM', ulsNome: 'ULS Santa Maria', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Santa-Maria-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_SJO', ulsNome: 'ULS Sao Jose', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Sao-Jose-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_LOD', ulsNome: 'ULS Loures/Odivelas', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Loures-Odivelas-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_AS', ulsNome: 'ULS Amadora/Sintra', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Amadora-Sintra-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_ET', ulsNome: 'ULS Estuario do Tejo', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-do-Estuario-do-Tejo-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_AR', ulsNome: 'ULS Arco Ribeirinho', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-do-Arco-Ribeirinho-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_ALS', ulsNome: 'ULS Almada/Seixal', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Almada-Seixal-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_ARR', ulsNome: 'ULS Arrabida', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-da-Arrabida-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_LEZ', ulsNome: 'ULS Leziria', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-da-Leziria-EPE.pdf`, validado: true },
  // Alentejo — 4 ULS
  { ulsCode: 'ULS_AAL', ulsNome: 'ULS Alto Alentejo', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Alto-Alentejo-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_AC', ulsNome: 'ULS Alentejo Central', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Alentejo-Central-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_BA', ulsNome: 'ULS Baixo Alentejo', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Baixo-Alentejo-EPE.pdf`, validado: true },
  { ulsCode: 'ULS_LA', ulsNome: 'ULS Litoral Alentejano', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-Litoral-Alentejano-EPE.pdf`, validado: true },
  // Algarve — 1 ULS
  { ulsCode: 'ULS_ALG', ulsNome: 'ULS Algarve', cp_2024_2026: `${BASE}/Contrato-Programa-2024-2026-ULS-do-Algarve-EPE.pdf`, validado: true },
  // IPOs — 3
  { ulsCode: 'IPO_LX', ulsNome: 'IPO Lisboa', validado: false, observacoes: 'IPO — formato de URL diferente, nao encontrado' },
  { ulsCode: 'IPO_CO', ulsNome: 'IPO Coimbra', validado: false, observacoes: 'IPO — formato de URL diferente, nao encontrado' },
  { ulsCode: 'IPO_PT', ulsNome: 'IPO Porto', validado: false, observacoes: 'IPO — formato de URL diferente, nao encontrado' },
];

export function getValidatedUrls(): ACSSContractURL[] {
  return ACSS_CONTRACT_URLS.filter(u => u.validado && u.cp_2024_2026);
}

export function getUrlForULS(ulsCode: string): ACSSContractURL | undefined {
  return ACSS_CONTRACT_URLS.find(u => u.ulsCode === ulsCode);
}
