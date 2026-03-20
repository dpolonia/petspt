/**
 * Systematic mapping of 54 PETS measures to data sources.
 * Priority chain: Power BI SIGLIC/SICA > BI-CSP IDG/IDE > Transparencia SNS > SDM > GT PETS
 * Sources: Power BI API (2164 pts), Transparencia SNS (140 datasets), BI-CSP (209 indicators), GT PETS reports
 * Last verified: 2026-03-20
 */

export interface MeasureDataMapping {
  medidaId: string;
  eixo: number;
  primaryDataset?: {
    portal: 'transparencia_sns' | 'dados_gov';
    slug: string;
    campoValor: string;
    campoPeriodo: string;
    campoInstituicao?: string;
    filtro?: string;
    invertido: boolean;
    unidade: string;
  };
  powerBiSource?: {
    eixo: number;
    measure: string;
    table: string;
    points: number;
  };
  sdmIndicatorId?: number;
  crossRefIds?: string[];
  dataAvailability: 'api_mensal' | 'powerbi_mensal' | 'dados_fixos' | 'sem_dados';
}

export const MEASURE_DATA_MAPPINGS: MeasureDataMapping[] = [
  // ═══ EIXO 1 ═══
  { medidaId: 'E1.A1', eixo: 1, powerBiSource: { eixo: 1, measure: 'Doentes Operados - Oncológicos', table: 'Medidas', points: 37 }, dataAvailability: 'powerbi_mensal' }, // Power BI: monthly oncological surgeries + LIC fora TMRG (Jan 2023 - Jan 2026)
  { medidaId: 'E1.A2', eixo: 1, primaryDataset: { portal: 'transparencia_sns', slug: 'atividade-operacional-do-sns-24', campoValor: 'valor', campoPeriodo: 'periodo', filtro: "indicador = 'Chamadas Atendidas'", invertido: false, unidade: 'chamadas' }, crossRefIds: ['CR_TAXA_RESP_SNS24'], dataAvailability: 'api_mensal' },
  { medidaId: 'E1.B1', eixo: 1, primaryDataset: { portal: 'transparencia_sns', slug: 'intervencoes-cirurgicas', campoValor: 'no_intervencoes_cirurgicas_programadas', campoPeriodo: 'tempo', campoInstituicao: 'instituicao', invertido: false, unidade: 'cirurgias' }, dataAvailability: 'api_mensal' },
  { medidaId: 'E1.B2', eixo: 1, primaryDataset: { portal: 'transparencia_sns', slug: 'inscritos-em-lic-dentro-do-tmrg-180-dias', campoValor: 'de_inscritos_em_lic_dentro_do_tmrg', campoPeriodo: 'tempo', campoInstituicao: 'instituicao', invertido: false, unidade: '% dentro TMRG' }, dataAvailability: 'api_mensal' },
  { medidaId: 'E1.B3', eixo: 1, primaryDataset: { portal: 'transparencia_sns', slug: 'consultas-em-tempo-real', campoValor: 'no_primeiras_ce_realizadas_com_registo_no_cth', campoPeriodo: 'tempo', campoInstituicao: 'instituicao', invertido: false, unidade: 'consultas' }, crossRefIds: ['CR_PCT_CTH_TMRG'], dataAvailability: 'api_mensal' },
  { medidaId: 'E1.C1', eixo: 1, primaryDataset: { portal: 'transparencia_sns', slug: 'teleconsultas-atraves-da-plataforma-live', campoValor: 'valor', campoPeriodo: 'periodo', invertido: false, unidade: 'teleconsultas' }, dataAvailability: 'api_mensal' },
  { medidaId: 'E1.C2', eixo: 1, dataAvailability: 'dados_fixos' },
  { medidaId: 'E1.C3', eixo: 1, dataAvailability: 'dados_fixos' },
  { medidaId: 'E1.C4', eixo: 1, primaryDataset: { portal: 'transparencia_sns', slug: 'inscritos-em-lic-dentro-do-tmrg-180-dias', campoValor: 'no_de_doentes_inscritos_sigic', campoPeriodo: 'tempo', campoInstituicao: 'instituicao', invertido: true, unidade: 'doentes' }, dataAvailability: 'api_mensal' },
  { medidaId: 'E1.C5', eixo: 1, dataAvailability: 'dados_fixos' },

  // ═══ EIXO 2 ═══
  { medidaId: 'E2.A1', eixo: 2, primaryDataset: { portal: 'transparencia_sns', slug: 'atividade-operacional-do-sns-24', campoValor: 'valor', campoPeriodo: 'periodo', filtro: "indicador = 'Chamadas Recebidas'", invertido: false, unidade: 'chamadas' }, dataAvailability: 'api_mensal' },
  { medidaId: 'E2.A2', eixo: 2, primaryDataset: { portal: 'transparencia_sns', slug: 'partos-e-cesarianas', campoValor: 'no_de_partos', campoPeriodo: 'tempo', campoInstituicao: 'instituicao', invertido: false, unidade: 'partos' }, crossRefIds: ['CR_TAXA_CESARIANAS'], dataAvailability: 'api_mensal' },
  { medidaId: 'E2.A3', eixo: 2, dataAvailability: 'dados_fixos' },
  { medidaId: 'E2.B1', eixo: 2, dataAvailability: 'dados_fixos' },
  { medidaId: 'E2.B2', eixo: 2, dataAvailability: 'dados_fixos' },
  { medidaId: 'E2.B3', eixo: 2, dataAvailability: 'dados_fixos' },
  { medidaId: 'E2.B4', eixo: 2, primaryDataset: { portal: 'transparencia_sns', slug: 'atendimentos-por-tipo-de-urgencia-hospitalar-link', campoValor: 'urgencias_pediatricas', campoPeriodo: 'tempo', campoInstituicao: 'instituicao', invertido: true, unidade: 'atendimentos' }, dataAvailability: 'api_mensal' },
  { medidaId: 'E2.C1', eixo: 2, dataAvailability: 'sem_dados' },
  { medidaId: 'E2.C2', eixo: 2, dataAvailability: 'sem_dados' },
  { medidaId: 'E2.C3', eixo: 2, dataAvailability: 'sem_dados' },

  // ═══ EIXO 3 ═══
  { medidaId: 'E3.A1', eixo: 3, powerBiSource: { eixo: 3, measure: 'Total Geral', table: 'V_DESNS_EIXO3_SU_ENCAMINHA_CSP', points: 37 }, sdmIndicatorId: 411, dataAvailability: 'powerbi_mensal' },
  { medidaId: 'E3.A2', eixo: 3, powerBiSource: { eixo: 3, measure: 'Utentes Atendidos', table: 'V_DESNS_EIXO3_SNS24_CAC', points: 216 }, dataAvailability: 'powerbi_mensal' },
  { medidaId: 'E3.A3', eixo: 3, primaryDataset: { portal: 'transparencia_sns', slug: 'consultas-em-tempo-real', campoValor: 'no_primeiras_ce_realizadas_com_registo_no_cth', campoPeriodo: 'tempo', invertido: false, unidade: 'consultas' }, dataAvailability: 'api_mensal' },
  { medidaId: 'E3.B1', eixo: 3, primaryDataset: { portal: 'transparencia_sns', slug: 'lotacao-praticada-por-tipo-de-cama', campoValor: 'lotacao', campoPeriodo: 'tempo', campoInstituicao: 'instituicao', invertido: false, unidade: 'camas' }, crossRefIds: ['CR_TAXA_OCUPACAO'], dataAvailability: 'api_mensal' },
  { medidaId: 'E3.B2', eixo: 3, dataAvailability: 'dados_fixos' },
  { medidaId: 'E3.B3', eixo: 3, primaryDataset: { portal: 'transparencia_sns', slug: 'atendimentos-nos-csp-gripe', campoValor: 'valor', campoPeriodo: 'periodo', invertido: false, unidade: 'vacinacoes' }, dataAvailability: 'api_mensal' },
  { medidaId: 'E3.B4', eixo: 3, primaryDataset: { portal: 'transparencia_sns', slug: 'consultas-em-telemedicina', campoValor: 'valor', campoPeriodo: 'periodo', invertido: false, unidade: 'teleconsultas' }, dataAvailability: 'api_mensal' },
  { medidaId: 'E3.B5', eixo: 3, dataAvailability: 'dados_fixos' },
  { medidaId: 'E3.B6', eixo: 3, dataAvailability: 'dados_fixos' },
  { medidaId: 'E3.B7', eixo: 3, dataAvailability: 'dados_fixos' },
  { medidaId: 'E3.B8', eixo: 3, dataAvailability: 'dados_fixos' },
  { medidaId: 'E3.C1', eixo: 3, dataAvailability: 'dados_fixos' },
  { medidaId: 'E3.C2', eixo: 3, dataAvailability: 'dados_fixos' },

  // ═══ EIXO 4 ═══
  { medidaId: 'E4.A1', eixo: 4, primaryDataset: { portal: 'transparencia_sns', slug: 'utentes-inscritos-em-cuidados-de-saude-primarios', campoValor: 'total_utentes_sem_mdf_atribuido', campoPeriodo: 'periodo', campoInstituicao: 'aces', invertido: true, unidade: 'utentes' }, crossRefIds: ['CR_UTENTES_SEM_MDF_PCT'], dataAvailability: 'api_mensal' },
  { medidaId: 'E4.A2', eixo: 4, powerBiSource: { eixo: 4, measure: 'Nº Total', table: 'V_DESNS_EIXO4_CONS_MEDICAS_CSP', points: 25 }, sdmIndicatorId: 2, dataAvailability: 'powerbi_mensal' },
  { medidaId: 'E4.A3', eixo: 4, dataAvailability: 'dados_fixos' },
  { medidaId: 'E4.A4', eixo: 4, primaryDataset: { portal: 'transparencia_sns', slug: 'atividade-operacional-do-sns-24', campoValor: 'valor', campoPeriodo: 'periodo', filtro: "indicador = 'Chamadas Recebidas'", invertido: false, unidade: 'chamadas' }, dataAvailability: 'api_mensal' },
  { medidaId: 'E4.B1', eixo: 4, powerBiSource: { eixo: 4, measure: 'Nº Utentes Inscritos', table: 'V_DESNS_EIXO4_UTENTES_INSC', points: 25 }, sdmIndicatorId: 6, dataAvailability: 'powerbi_mensal' },
  { medidaId: 'E4.B2', eixo: 4, primaryDataset: { portal: 'transparencia_sns', slug: 'trabalhadores-por-grupo-profissional', campoValor: 'valor', campoPeriodo: 'periodo', invertido: false, unidade: 'trabalhadores' }, dataAvailability: 'api_mensal' },
  { medidaId: 'E4.B3', eixo: 4, primaryDataset: { portal: 'transparencia_sns', slug: 'evolucao-do-numero-de-unidades-funcionais', campoValor: 'valor', campoPeriodo: 'periodo', invertido: false, unidade: 'USF' }, dataAvailability: 'api_mensal' },
  { medidaId: 'E4.B4', eixo: 4, dataAvailability: 'dados_fixos' },
  { medidaId: 'E4.B5', eixo: 4, dataAvailability: 'dados_fixos' },
  { medidaId: 'E4.C1', eixo: 4, dataAvailability: 'sem_dados' },
  { medidaId: 'E4.C2', eixo: 4, primaryDataset: { portal: 'transparencia_sns', slug: 'rastreios-oncologicos', campoValor: 'proporcao_mulheres_50_70_a_c_mamogr_2_anos', campoPeriodo: 'tempo', campoInstituicao: 'area_csp', invertido: false, unidade: '%' }, dataAvailability: 'api_mensal' },
  { medidaId: 'E4.C3', eixo: 4, dataAvailability: 'sem_dados' },

  // ═══ EIXO 5 ═══
  { medidaId: 'E5.A1', eixo: 5, primaryDataset: { portal: 'transparencia_sns', slug: 'trabalhadores-por-grupo-profissional', campoValor: 'valor', campoPeriodo: 'periodo', invertido: false, unidade: 'psicologos' }, powerBiSource: { eixo: 5, measure: 'Nº Total de Episódios de Psicologia', table: 'Métricas', points: 16 }, dataAvailability: 'api_mensal' },
  { medidaId: 'E5.A2', eixo: 5, dataAvailability: 'dados_fixos' },
  { medidaId: 'E5.A3', eixo: 5, dataAvailability: 'dados_fixos' },
  { medidaId: 'E5.B1', eixo: 5, powerBiSource: { eixo: 5, measure: 'Nº Total de Episódios de Psiquiatria (SICA 1as e subsequentes)', table: 'Métricas', points: 16 }, dataAvailability: 'powerbi_mensal' },
  { medidaId: 'E5.B2', eixo: 5, dataAvailability: 'dados_fixos' },
  { medidaId: 'E5.B3', eixo: 5, primaryDataset: { portal: 'transparencia_sns', slug: 'lotacao-praticada-por-tipo-de-cama', campoValor: 'lotacao', campoPeriodo: 'tempo', campoInstituicao: 'instituicao', invertido: false, unidade: 'camas' }, dataAvailability: 'api_mensal' },
  { medidaId: 'E5.B4', eixo: 5, dataAvailability: 'dados_fixos' },
  { medidaId: 'E5.C1', eixo: 5, dataAvailability: 'dados_fixos' },
  { medidaId: 'E5.C2', eixo: 5, dataAvailability: 'dados_fixos' },
];

// Summary
export const MAPPING_STATS = {
  total: MEASURE_DATA_MAPPINGS.length,
  withAPI: MEASURE_DATA_MAPPINGS.filter(m => m.dataAvailability === 'api_mensal').length,
  withPowerBI: MEASURE_DATA_MAPPINGS.filter(m => m.dataAvailability === 'powerbi_mensal').length,
  withStatic: MEASURE_DATA_MAPPINGS.filter(m => m.dataAvailability === 'dados_fixos').length,
  withoutData: MEASURE_DATA_MAPPINGS.filter(m => m.dataAvailability === 'sem_dados').length,
  withSDM: MEASURE_DATA_MAPPINGS.filter(m => m.sdmIndicatorId).length,
  uniqueDatasets: [...new Set(MEASURE_DATA_MAPPINGS.filter(m => m.primaryDataset).map(m => m.primaryDataset!.slug))].length,
  totalPowerBiPoints: MEASURE_DATA_MAPPINGS.filter(m => m.powerBiSource).reduce((s, m) => s + (m.powerBiSource?.points || 0), 0),
};
