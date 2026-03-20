/**
 * Maps PETS measures to Power BI series extracted from SNS PETS dashboards.
 * Series keys match exactly the keys in powerbi_data/{eixo} Firestore documents.
 *
 * Data priority: Power BI (SIGLIC/SICA) > Transparencia SNS > GT PETS reports
 */

export interface MeasurePBISeries {
  seriesKey: string;
  label: string;
  source: string;
  invertido: boolean;
  unidade: string;
  isPrimary: boolean;
}

export interface MeasurePBIMapping {
  medidaId: string;
  eixo: number;
  series: MeasurePBISeries[];
}

export const MEASURE_PBI_MAPPINGS: MeasurePBIMapping[] = [
  // ═══ EIXO 1 — Resposta a Tempo e Horas ═══
  {
    medidaId: 'E1.A1', eixo: 1,
    series: [
      { seriesKey: 'lic_onco_fora_tmrg', label: 'Doentes oncologicos fora TMRG', source: 'SIGLIC', invertido: true, unidade: 'doentes', isPrimary: true },
      { seriesKey: 'doentes_operados_oncologicos', label: 'Cirurgias oncologicas realizadas', source: 'SIGLIC', invertido: false, unidade: 'cirurgias/mes', isPrimary: false },
    ],
  },
  {
    medidaId: 'E1.B1', eixo: 1,
    series: [
      { seriesKey: 'doentes_operados_nao_oncologicos', label: 'Cirurgias nao-oncologicas', source: 'SIGLIC', invertido: false, unidade: 'cirurgias/mes', isPrimary: true },
      { seriesKey: 'lic_nao_onco_fora_tmrg', label: 'Doentes nao-onco fora TMRG', source: 'SIGLIC', invertido: true, unidade: 'doentes', isPrimary: false },
    ],
  },
  {
    medidaId: 'E1.B3', eixo: 1,
    series: [
      { seriesKey: 'consultas_medicas_hospitalares', label: 'Consultas medicas hospitalares', source: 'SICA', invertido: false, unidade: 'consultas/mes', isPrimary: true },
      { seriesKey: 'primeiras_consultas', label: '1as consultas hospitalares', source: 'SICA', invertido: false, unidade: 'consultas/mes', isPrimary: false },
    ],
  },
  {
    medidaId: 'E1.C4', eixo: 1,
    series: [
      { seriesKey: 'lic_nao_onco_fora_tmrg', label: 'LIC nao-onco fora TMRG', source: 'SIGLIC', invertido: true, unidade: 'doentes', isPrimary: true },
    ],
  },

  // ═══ EIXO 2 — Bebes e Maes em Seguranca ═══
  {
    medidaId: 'E2.A1', eixo: 2,
    series: [
      { seriesKey: 'triagens_gravidas', label: 'Triagens SNS24 Gravida', source: 'SNS24', invertido: false, unidade: 'triagens/mes', isPrimary: true },
      { seriesKey: 'encaminhamentos_su', label: 'Encaminhamentos para SU', source: 'SNS24', invertido: true, unidade: 'enc./mes', isPrimary: false },
      { seriesKey: 'encaminhamentos_csp', label: 'Encaminhamentos para CSP', source: 'SNS24', invertido: false, unidade: 'enc./mes', isPrimary: false },
      { seriesKey: 'encaminhamentos_inem', label: 'Encaminhamentos INEM', source: 'SNS24', invertido: false, unidade: 'enc./mes', isPrimary: false },
      { seriesKey: 'encaminhamentos_autocuidados', label: 'Autocuidados', source: 'SNS24', invertido: false, unidade: 'enc./mes', isPrimary: false },
    ],
  },
  {
    medidaId: 'E2.A2', eixo: 2,
    series: [
      { seriesKey: 'total_partos', label: 'Total partos SNS', source: 'SIGLIC', invertido: false, unidade: 'partos/mes', isPrimary: true },
      { seriesKey: 'total_cesarianas', label: 'Cesarianas', source: 'SIGLIC', invertido: true, unidade: 'cesarianas/mes', isPrimary: false },
      { seriesKey: 'partos_sem_cesarianas', label: 'Partos sem cesariana', source: 'SIGLIC', invertido: false, unidade: 'partos/mes', isPrimary: false },
    ],
  },
  {
    medidaId: 'E2.B3', eixo: 2,
    series: [
      { seriesKey: 'ecografias_prenatais', label: 'Ecografias pre-natais', source: 'SIGLIC', invertido: false, unidade: 'ecografias/mes', isPrimary: true },
    ],
  },

  // ═══ EIXO 3 — Cuidados Urgentes e Emergentes ═══
  {
    medidaId: 'E3.A2', eixo: 3,
    series: [
      { seriesKey: 'encaminhamentos_total', label: 'Encaminhamentos SU totais', source: 'SNS24', invertido: false, unidade: 'enc./mes', isPrimary: true },
      { seriesKey: 'agendamentos_csp', label: 'Agendamentos CSP (via SU)', source: 'SNS24', invertido: false, unidade: 'agend./mes', isPrimary: false },
      { seriesKey: 'consultas_csp_agendadas', label: 'Consultas CSP agendadas e realizadas', source: 'SNS24', invertido: false, unidade: 'consultas/mes', isPrimary: false },
    ],
  },
  {
    medidaId: 'E3.B3', eixo: 3,
    series: [
      { seriesKey: 'vacinados', label: 'Utentes vacinados (gripe)', source: 'DGS', invertido: false, unidade: 'utentes', isPrimary: true },
      { seriesKey: 'covacinados', label: 'Utentes covacinados', source: 'DGS', invertido: false, unidade: 'utentes', isPrimary: false },
    ],
  },

  // ═══ EIXO 4 — Saude Proxima e Familiar ═══
  {
    medidaId: 'E4.A1', eixo: 4,
    series: [
      { seriesKey: 'utentes_inscritos_mensal', label: 'Utentes inscritos (total/com MdF/sem MdF)', source: 'ACSS', invertido: false, unidade: 'utentes', isPrimary: true },
    ],
  },
  {
    medidaId: 'E4.A2', eixo: 4,
    series: [
      { seriesKey: 'consultas_csp_total', label: 'Consultas CSP totais', source: 'ACSS', invertido: false, unidade: 'consultas/mes', isPrimary: true },
      { seriesKey: 'consultas_presenciais', label: 'Consultas presenciais', source: 'ACSS', invertido: false, unidade: 'consultas/mes', isPrimary: false },
    ],
  },

  // ═══ EIXO 5 — Saude Mental ═══
  {
    medidaId: 'E5.A1', eixo: 5,
    series: [
      { seriesKey: 'episodios_psicologia_por_ano', label: 'Episodios psicologia (anual)', source: 'ACSS', invertido: false, unidade: 'episodios/ano', isPrimary: true },
      { seriesKey: 'episodios_psicologia_mensal_2025', label: 'Episodios psicologia (mensal 2025)', source: 'ACSS', invertido: false, unidade: 'episodios/mes', isPrimary: false },
    ],
  },
  {
    medidaId: 'E5.B1', eixo: 5,
    series: [
      { seriesKey: 'episodios_psiquiatria_por_ano', label: 'Episodios psiquiatria (anual)', source: 'ACSS', invertido: false, unidade: 'episodios/ano', isPrimary: true },
      { seriesKey: 'episodios_psiquiatria_mensal_2025', label: 'Episodios psiquiatria (mensal 2025)', source: 'ACSS', invertido: false, unidade: 'episodios/mes', isPrimary: false },
      { seriesKey: 'psiquiatria_fora_tmrg', label: 'Consultas psiquiatria fora TMRG', source: 'ACSS', invertido: true, unidade: 'consultas', isPrimary: false },
    ],
  },
];

/** Get Power BI mapping for a specific measure */
export function getPBIMapping(medidaId: string): MeasurePBIMapping | undefined {
  return MEASURE_PBI_MAPPINGS.find(m => m.medidaId === medidaId);
}

/** Get all measures with Power BI data for a given eixo */
export function getPBIMappingsForEixo(eixo: number): MeasurePBIMapping[] {
  return MEASURE_PBI_MAPPINGS.filter(m => m.eixo === eixo);
}

/** Summary stats */
export const PBI_MAPPING_STATS = {
  totalMeasures: MEASURE_PBI_MAPPINGS.length,
  totalSeries: MEASURE_PBI_MAPPINGS.reduce((s, m) => s + m.series.length, 0),
  byEixo: [1, 2, 3, 4, 5].map(e => ({
    eixo: e,
    measures: MEASURE_PBI_MAPPINGS.filter(m => m.eixo === e).length,
    series: MEASURE_PBI_MAPPINGS.filter(m => m.eixo === e).reduce((s, m) => s + m.series.length, 0),
  })),
};
