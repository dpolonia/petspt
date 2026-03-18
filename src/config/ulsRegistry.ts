/**
 * Registo oficial das 39 ULS + 3 IPO do SNS português.
 * Cada ULS tem um código, nome, região e cor para gráficos stacked.
 */

export interface ULS {
  code: string;
  nome: string;
  regiao: 'Norte' | 'Centro' | 'LVT' | 'Alentejo' | 'Algarve';
  cor: string;
}

export const ULS_REGISTRY: ULS[] = [
  // Norte
  { code: 'ULS_AM', nome: 'ULS Alto Minho', regiao: 'Norte', cor: '#1f77b4' },
  { code: 'ULS_AA', nome: 'ULS Alto Ave', regiao: 'Norte', cor: '#2ca02c' },
  { code: 'ULS_BE', nome: 'ULS Barcelos-Esposende', regiao: 'Norte', cor: '#d62728' },
  { code: 'ULS_BR', nome: 'ULS Braga', regiao: 'Norte', cor: '#9467bd' },
  { code: 'ULS_MA', nome: 'ULS Médio Ave', regiao: 'Norte', cor: '#8c564b' },
  { code: 'ULS_PV', nome: 'ULS Póvoa de Varzim-Vila do Conde', regiao: 'Norte', cor: '#e377c2' },
  { code: 'ULS_GE', nome: 'ULS Gaia/Espinho', regiao: 'Norte', cor: '#7f7f7f' },
  { code: 'ULS_MT', nome: 'ULS Matosinhos', regiao: 'Norte', cor: '#bcbd22' },
  { code: 'ULS_SA', nome: 'ULS Santo António', regiao: 'Norte', cor: '#17becf' },
  { code: 'ULS_SJ', nome: 'ULS São João', regiao: 'Norte', cor: '#aec7e8' },
  { code: 'ULS_TS', nome: 'ULS Tâmega e Sousa', regiao: 'Norte', cor: '#ffbb78' },
  { code: 'ULS_EDV', nome: 'ULS Entre Douro e Vouga', regiao: 'Norte', cor: '#98df8a' },
  { code: 'ULS_NE', nome: 'ULS Nordeste', regiao: 'Norte', cor: '#ff9896' },
  { code: 'ULS_TMAD', nome: 'ULS Trás-os-Montes e Alto Douro', regiao: 'Norte', cor: '#c5b0d5' },

  // Centro
  { code: 'ULS_RA', nome: 'ULS Região de Aveiro', regiao: 'Centro', cor: '#c49c94' },
  { code: 'ULS_VDL', nome: 'ULS Viseu Dão Lafões', regiao: 'Centro', cor: '#f7b6d2' },
  { code: 'ULS_GU', nome: 'ULS Guarda', regiao: 'Centro', cor: '#c7c7c7' },
  { code: 'ULS_CB', nome: 'ULS Castelo Branco', regiao: 'Centro', cor: '#dbdb8d' },
  { code: 'ULS_CVB', nome: 'ULS Cova da Beira', regiao: 'Centro', cor: '#9edae5' },
  { code: 'ULS_CO', nome: 'ULS Coimbra', regiao: 'Centro', cor: '#393b79' },
  { code: 'ULS_LE', nome: 'ULS Região de Leiria', regiao: 'Centro', cor: '#5254a3' },
  { code: 'ULS_MTE', nome: 'ULS Médio Tejo', regiao: 'Centro', cor: '#6b6ecf' },

  // LVT
  { code: 'ULS_OE', nome: 'ULS Oeste', regiao: 'LVT', cor: '#9c9ede' },
  { code: 'ULS_LO', nome: 'ULS Lisboa Ocidental', regiao: 'LVT', cor: '#637939' },
  { code: 'ULS_SM', nome: 'ULS Santa Maria', regiao: 'LVT', cor: '#8ca252' },
  { code: 'ULS_SJO', nome: 'ULS São José', regiao: 'LVT', cor: '#b5cf6b' },
  { code: 'ULS_LOD', nome: 'ULS Loures/Odivelas', regiao: 'LVT', cor: '#cedb9c' },
  { code: 'ULS_AS', nome: 'ULS Amadora/Sintra', regiao: 'LVT', cor: '#8c6d31' },
  { code: 'ULS_ET', nome: 'ULS Estuário do Tejo', regiao: 'LVT', cor: '#bd9e39' },
  { code: 'ULS_AR', nome: 'ULS Arco Ribeirinho', regiao: 'LVT', cor: '#e7ba52' },
  { code: 'ULS_ALS', nome: 'ULS Almada/Seixal', regiao: 'LVT', cor: '#e7cb94' },
  { code: 'ULS_ARR', nome: 'ULS Arrábida', regiao: 'LVT', cor: '#843c39' },
  { code: 'ULS_LEZ', nome: 'ULS Lezíria', regiao: 'LVT', cor: '#ad494a' },

  // Alentejo
  { code: 'ULS_AAL', nome: 'ULS Alto Alentejo', regiao: 'Alentejo', cor: '#d6616b' },
  { code: 'ULS_AC', nome: 'ULS Alentejo Central', regiao: 'Alentejo', cor: '#e7969c' },
  { code: 'ULS_BA', nome: 'ULS Baixo Alentejo', regiao: 'Alentejo', cor: '#7b4173' },
  { code: 'ULS_LA', nome: 'ULS Litoral Alentejano', regiao: 'Alentejo', cor: '#a55194' },

  // Algarve
  { code: 'ULS_ALG', nome: 'ULS Algarve', regiao: 'Algarve', cor: '#ce6dbd' },

  // IPOs
  { code: 'IPO_LX', nome: 'IPO Lisboa', regiao: 'LVT', cor: '#de9ed6' },
  { code: 'IPO_CO', nome: 'IPO Coimbra', regiao: 'Centro', cor: '#3182bd' },
  { code: 'IPO_PT', nome: 'IPO Porto', regiao: 'Norte', cor: '#e6550d' },
];

// Helpers
export function getULSByRegiao(regiao: ULS['regiao']): ULS[] {
  return ULS_REGISTRY.filter(u => u.regiao === regiao);
}

export function getULSColor(code: string): string {
  return ULS_REGISTRY.find(u => u.code === code)?.cor ?? '#999999';
}

export const REGIOES = ['Norte', 'Centro', 'LVT', 'Alentejo', 'Algarve'] as const;
