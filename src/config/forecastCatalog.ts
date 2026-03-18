/**
 * Catalog of indicators eligible for prospective analysis.
 * Field names from docs/API_CATALOG.md.
 */

export interface ForecastableIndicator {
  id: string;
  nome: string;
  descricao: string;
  eixo: number;
  dataset: string;
  campoValor: string;
  campoPeriodo: string;
  campoInstituicao?: string;
  unidade: string;
  benchmark?: number;
  benchmarkLabel?: string;
  invertido?: boolean;
  filtroWhere?: string;
  referencia?: string;
}

export const FORECAST_CATALOG: ForecastableIndicator[] = [
  {
    id: 'FC_CIRURGIAS',
    nome: 'Cirurgias realizadas (total)',
    descricao: 'Intervencoes cirurgicas programadas no SNS',
    eixo: 1,
    dataset: 'intervencoes-cirurgicas',
    campoValor: 'no_intervencoes_cirurgicas_programadas',
    campoPeriodo: 'tempo',
    campoInstituicao: 'instituicao',
    unidade: 'cirurgias',
  },
  {
    id: 'FC_CONSULTAS_CTH',
    nome: 'Consultas a Tempo e Horas',
    descricao: 'Primeiras consultas hospitalares realizadas com registo no CTH',
    eixo: 1,
    dataset: 'consultas-em-tempo-real',
    campoValor: 'no_primeiras_ce_realizadas_com_registo_no_cth',
    campoPeriodo: 'tempo',
    campoInstituicao: 'instituicao',
    unidade: 'consultas',
  },
  {
    id: 'FC_PARTOS',
    nome: 'Partos no SNS',
    descricao: 'Total de partos realizados mensalmente',
    eixo: 2,
    dataset: 'partos-e-cesarianas',
    campoValor: 'no_de_partos',
    campoPeriodo: 'tempo',
    campoInstituicao: 'instituicao',
    unidade: 'partos',
  },
  {
    id: 'FC_URGENCIAS',
    nome: 'Atendimentos em urgencia',
    descricao: 'Total mensal de atendimentos nos servicos de urgencia',
    eixo: 3,
    dataset: 'atendimentos-por-tipo-de-urgencia-hospitalar-link',
    campoValor: 'total_urgencias',
    campoPeriodo: 'tempo',
    campoInstituicao: 'instituicao',
    unidade: 'atendimentos',
  },
  {
    id: 'FC_SNS24_CHAMADAS',
    nome: 'Chamadas SNS24 (recebidas)',
    descricao: 'Volume mensal de chamadas recebidas pela linha SNS24. Cf. Goiana-da-Silva et al. (2025).',
    eixo: 3,
    dataset: 'atividade-operacional-do-sns-24',
    campoValor: 'valor',
    campoPeriodo: 'periodo',
    filtroWhere: "indicador = 'Chamadas Recebidas'",
    unidade: 'chamadas',
    benchmark: 600000,
    benchmarkLabel: 'Capacidade instalada SNS24 (~600.000/mes)',
    referencia: 'Goiana-da-Silva et al. (2025). Front. Public Health 13:1694713.',
  },
  {
    id: 'FC_UTENTES_SEM_MDF',
    nome: 'Utentes sem Medico de Familia',
    descricao: 'Evolucao mensal do numero de utentes sem MdF atribuido',
    eixo: 4,
    dataset: 'utentes-inscritos-em-cuidados-de-saude-primarios',
    campoValor: 'total_utentes_sem_mdf_atribuido',
    campoPeriodo: 'periodo',
    campoInstituicao: 'aces',
    unidade: 'utentes',
    invertido: true,
    benchmark: 0,
    benchmarkLabel: 'Meta: zero utentes sem MdF',
  },
  {
    id: 'FC_CAMAS',
    nome: 'Lotacao hospitalar (total camas)',
    descricao: 'Total de camas praticadas nos hospitais do SNS',
    eixo: 3,
    dataset: 'lotacao-praticada-por-tipo-de-cama',
    campoValor: 'lotacao',
    campoPeriodo: 'tempo',
    campoInstituicao: 'instituicao',
    unidade: 'camas',
  },
  {
    id: 'FC_RASTREIOS_MAMA',
    nome: 'Cobertura rastreio mama',
    descricao: 'Proporcao de mulheres 50-70 anos com mamografia nos ultimos 2 anos',
    eixo: 4,
    dataset: 'rastreios-oncologicos',
    campoValor: 'proporcao_mulheres_50_70_a_c_mamogr_2_anos',
    campoPeriodo: 'tempo',
    campoInstituicao: 'area_csp',
    unidade: '%',
  },
];

export function getForecastCatalogByEixo(eixo: number): ForecastableIndicator[] {
  return FORECAST_CATALOG.filter(i => i.eixo === eixo);
}

export function getForecastIndicatorById(id: string): ForecastableIndicator | undefined {
  return FORECAST_CATALOG.find(i => i.id === id);
}
