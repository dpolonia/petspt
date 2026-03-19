import { ScenarioDefinition } from '../services/forecast/scenarioEngine';

export const SCENARIO_CATALOG: ScenarioDefinition[] = [
  {
    id: 'SC_OE_VARIACAO',
    nome: 'Variacao do Orcamento SNS',
    descricao: 'Simula o impacto de diferentes variacoes orcamentais na capacidade do SNS. O QGR assume que metas crescem proporcionalmente ao orcamento.',
    categoria: 'orcamental',
    fundamentacao: 'Despacho 6770/2024 (QGR 2024-2026). Despacho 14012/2025 (QGR 2025-2027). OE 2024: +9,85%. OE 2025: +4,83%.',
    parametros: [{
      id: 'delta_oe_pct', label: 'Variacao OE-SNS (%)',
      descricao: 'Variacao percentual do orcamento do SNS face ao ano anterior',
      type: 'multiplicative', defaultValue: 4.83, min: -5, max: 15, step: 0.5,
      unit: '%', affectsIndicators: ['FC_CIRURGIAS', 'FC_CONSULTAS_CTH', 'FC_URGENCIAS', 'FC_PARTOS'],
    }],
  },
  {
    id: 'SC_CONTRATACAO_RH',
    nome: 'Limite de Contratacao de Profissionais',
    descricao: 'O QGR 2025-2027 reduziu o limite de contratacao de 5% para 1,9%. Simula o impacto de diferentes limites.',
    categoria: 'rh',
    fundamentacao: 'QGR 2024-2026: ate 5% novos recrutamentos. QGR 2025-2027: ate 1,9%. APAH considerou QGR 2024 excessivamente optimista.',
    parametros: [{
      id: 'contratacao_pct', label: 'Limite contratacao (%)',
      descricao: 'Percentagem maxima de novos trabalhadores face ao existente',
      type: 'trend_shift', defaultValue: 1.9, min: 0, max: 10, step: 0.5,
      unit: '%', affectsIndicators: ['FC_CIRURGIAS', 'FC_CONSULTAS_CTH', 'FC_URGENCIAS'],
    }],
  },
  {
    id: 'SC_SNS24_COBERTURA',
    nome: 'Expansao do Ligue Antes, Salve Vidas',
    descricao: 'Se as 12 ULS restantes aderirem, a populacao coberta passa de 76% para ~100%. Cf. Goiana-da-Silva et al. (2025).',
    categoria: 'cobertura',
    fundamentacao: 'Goiana-da-Silva et al. (2025), Front. Public Health 13:1694713. 27 ULS ativas (7,9M utentes). 12 ULS pendentes (~2,5M utentes).',
    parametros: [
      {
        id: 'populacao_adicional', label: 'Aumento procura SNS24 (%)',
        descricao: '12 ULS pendentes representam ~2,5M utentes = +31,6% de procura',
        type: 'multiplicative', defaultValue: 31.6, min: 0, max: 50, step: 5,
        unit: '%', affectsIndicators: ['FC_SNS24_CHAMADAS'],
      },
      {
        id: 'capacidade_sns24', label: 'Capacidade SNS24 (chamadas/mes)',
        descricao: 'Maximo mensal de chamadas atendiveis. Actualmente ~600.000',
        type: 'capacity', defaultValue: 600000, min: 400000, max: 1200000, step: 50000,
        unit: 'chamadas/mes', affectsIndicators: ['FC_SNS24_CHAMADAS'],
      },
    ],
  },
  {
    id: 'SC_MEDICOS_FAMILIA',
    nome: 'Reforco de Medicos de Familia',
    descricao: 'Cada MdF cobre ~1.800 utentes. Simula o impacto da contratacao de MdF adicionais na reducao de utentes sem MdF.',
    categoria: 'rh',
    fundamentacao: 'QGR 2024-2026: meta 98% cobertura MdF em 2026. Necessidade estimada: 851-927 especialistas. Ratio ~1.800 utentes/MdF.',
    parametros: [{
      id: 'novos_mdf', label: 'Reducao utentes sem MdF',
      descricao: '500 MdF x 1.800 utentes = 900K utentes a menos sem MdF',
      type: 'additive', defaultValue: -900000, min: -2000000, max: 0, step: 90000,
      unit: 'utentes', affectsIndicators: ['FC_UTENTES_SEM_MDF'],
    }],
  },
  {
    id: 'SC_META_CESARIANAS',
    nome: 'Meta de Reducao de Cesarianas',
    descricao: 'Portugal tem taxa de cesarianas de ~33%. A meta PETS e <30%. Simula a trajectoria ate ao objectivo.',
    categoria: 'infraestrutura',
    fundamentacao: 'Taxa cesarianas 2024: 33%. Meta OMS: 10-15%. Meta PETS: <30%. Media OECD: ~27%.',
    parametros: [{
      id: 'taxa_alvo', label: 'Taxa cesarianas alvo (%)',
      descricao: 'Percentagem-alvo de cesarianas',
      type: 'target', defaultValue: 30, min: 15, max: 40, step: 1,
      unit: '%', affectsIndicators: ['FC_PARTOS'],
    }],
  },
  {
    id: 'SC_CAMAS_CONTRATADAS',
    nome: 'Expansao de Camas Contratadas',
    descricao: 'O SNS contratou 1.611 camas ao setor social/privado (Mar/2025). Simula expansao adicional.',
    categoria: 'infraestrutura',
    fundamentacao: 'Relatorios GT PETS: 538 camas (Dez/2024) -> 1.611 (Mar/2025). Meta: libertacao de camas de agudos.',
    parametros: [{
      id: 'camas_adicionais', label: 'Camas adicionais contratadas',
      descricao: 'Numero de camas adicionais a contratar ao setor social/privado',
      type: 'additive', defaultValue: 500, min: 0, max: 3000, step: 100,
      unit: 'camas', affectsIndicators: ['FC_CAMAS'],
    }],
  },
  {
    id: 'SC_CAC_EXPANSAO',
    nome: 'Expansao dos Centros de Atendimento Clinico',
    descricao: 'Cada CAC desvia ~170 atendimentos/mes da urgencia hospitalar. Actualmente 15 CAC operacionais.',
    categoria: 'infraestrutura',
    fundamentacao: 'Relatorios GT PETS: 15 CAC, 30.334 atendimentos (Ago/24-Abr/25). Media: ~2.022 atendimentos/CAC/ano.',
    parametros: [{
      id: 'novos_cac', label: 'Reducao urgencias (atendimentos/mes)',
      descricao: 'Cada CAC adicional desvia ~170 atendimentos/mes',
      type: 'additive', defaultValue: -2550, min: -10000, max: 0, step: 170,
      unit: 'atendimentos', affectsIndicators: ['FC_URGENCIAS'],
    }],
  },
];

export function getScenarioById(id: string): ScenarioDefinition | undefined {
  return SCENARIO_CATALOG.find(s => s.id === id);
}
