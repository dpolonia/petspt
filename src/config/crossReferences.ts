/**
 * Cross-reference definitions for derived indicators.
 * Each combines 2+ datasets to calculate a composite metric.
 */

export interface DataCrossReference {
  id: string;
  nome: string;
  formula: string;
  medidaIds: string[];
  unidade: string;
  invertido: boolean;
}

export const DATA_CROSS_REFERENCES: DataCrossReference[] = [
  {
    id: 'CR_TAXA_CESARIANAS',
    nome: 'Taxa de Cesarianas (%)',
    formula: '(cesarianas / total_partos) x 100',
    medidaIds: ['E2.A2', 'E2.A3'],
    unidade: '%',
    invertido: true,
  },
  {
    id: 'CR_TAXA_RESP_SNS24',
    nome: 'Taxa de Resposta SNS24 (%)',
    formula: '(chamadas_atendidas / chamadas_recebidas) x 100',
    medidaIds: ['E1.A2', 'E3.A1'],
    unidade: '%',
    invertido: false,
  },
  {
    id: 'CR_TAXA_OCUPACAO',
    nome: 'Taxa de Ocupacao de Internamento (%)',
    formula: '(dias_internamento / (camas x dias_mes)) x 100',
    medidaIds: ['E3.B1'],
    unidade: '%',
    invertido: false,
  },
  {
    id: 'CR_UTENTES_SEM_MDF_PCT',
    nome: '% Utentes sem Medico de Familia',
    formula: '(sem_mdf / total_inscritos) x 100',
    medidaIds: ['E4.A1'],
    unidade: '%',
    invertido: true,
  },
  {
    id: 'CR_PCT_CTH_TMRG',
    nome: '% Consultas CTH dentro do TMRG',
    formula: '(dentro_tmrg / total_cth) x 100',
    medidaIds: ['E1.B3'],
    unidade: '%',
    invertido: false,
  },
  {
    id: 'CR_LIC_TMRG',
    nome: '% Inscritos LIC dentro do TMRG',
    formula: '(dentro_tmrg / total_inscritos) x 100',
    medidaIds: ['E1.A1', 'E1.C4'],
    unidade: '%',
    invertido: false,
  },
];
