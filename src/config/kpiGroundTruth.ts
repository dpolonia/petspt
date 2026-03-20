/**
 * Ground truth KPI values from PETS evaluation reports and SNS Portal.
 * Sources:
 *   - Plano de Emergencia e Transformacao da Saude (May 2024) — targets
 *   - Relatorio GT PETS (Dec 2024) — actuals
 *   - II Relatorio de Progresso (Apr 2025) — actuals
 *   - SNS Portal Power BI API (Mar 2026) — extracted via querydata endpoint
 *   - SNS Portal HTML inline targets (Mar 2026) — text on eixo pages
 *
 * BREAKTHROUGH: Power BI data extracted programmatically via the public
 * querydata API at wabi-north-europe-api.analysis.windows.net.
 * Full monthly series in data/sns_pets/powerbi_extracted_data.json.
 * Key data points below for validation against Firestore.
 *
 * These are AUTHORITATIVE. Firestore/API data must match or explain deviation.
 */

export interface KPIGroundTruth {
  medidaId: string;
  medidaNome: string;
  dataPoints: {
    periodo: string;
    valor: number;
    fonte: 'PETS_Plan' | 'GT_PETS_Dez2024' | 'GT_PETS_Abr2025' | 'SNS_Portal_PowerBI' | 'SNS_Portal_HTML';
    descricao: string;
    unidade: string;
  }[];
}

export const KPI_GROUND_TRUTH: KPIGroundTruth[] = [
  // ═══ EIXO 1 ═══ (Power BI API: 37 monthly points Jan/2023-Jan/2026)
  { medidaId: 'E1.A1', medidaNome: 'OncoStop2024', dataPoints: [
    { periodo: '2024-01', valor: 1469, fonte: 'GT_PETS_Abr2025', descricao: 'Periodo homologo 2024', unidade: 'doentes onco fora TMRG' },
    { periodo: '2024-05', valor: 2645, fonte: 'GT_PETS_Dez2024', descricao: 'Inicio PETS — doentes fora TMRG', unidade: 'doentes onco fora TMRG' },
    { periodo: '2024-06', valor: 195, fonte: 'SNS_Portal_PowerBI', descricao: 'LIC onco fora TMRG Jun/2024 (API)', unidade: 'doentes onco fora TMRG' },
    { periodo: '2024-08', valor: 0, fonte: 'GT_PETS_Dez2024', descricao: 'Zero doentes fora TMRG a 31/Ago (API confirma null)', unidade: 'doentes onco fora TMRG' },
    { periodo: '2024-11', valor: 168, fonte: 'SNS_Portal_PowerBI', descricao: 'LIC onco fora TMRG Nov/2024 (API confirma GT)', unidade: 'doentes onco fora TMRG' },
    { periodo: '2024-12', valor: 148, fonte: 'SNS_Portal_PowerBI', descricao: 'LIC onco fora TMRG Dez/2024 (API)', unidade: 'doentes onco fora TMRG' },
    { periodo: '2025-03', valor: 180, fonte: 'SNS_Portal_PowerBI', descricao: 'LIC onco fora TMRG Mar/2025 (API confirma GT)', unidade: 'doentes onco fora TMRG' },
    { periodo: '2025-12', valor: 577, fonte: 'SNS_Portal_PowerBI', descricao: 'LIC onco fora TMRG Dez/2025 (API) — deterioracao', unidade: 'doentes onco fora TMRG' },
    { periodo: '2026-01', valor: 535, fonte: 'SNS_Portal_PowerBI', descricao: 'LIC onco fora TMRG Jan/2026 (API)', unidade: 'doentes onco fora TMRG' },
    // Cirurgias oncologicas realizadas (API: "Doentes Operados - Oncológicos")
    { periodo: '2024-01', valor: 6724, fonte: 'SNS_Portal_PowerBI', descricao: 'Cirurgias onco Jan/2024 (API)', unidade: 'cirurgias onco mensal' },
    { periodo: '2024-12', valor: 5649, fonte: 'SNS_Portal_PowerBI', descricao: 'Cirurgias onco Dez/2024 (API)', unidade: 'cirurgias onco mensal' },
    { periodo: '2025-12', valor: 5562, fonte: 'SNS_Portal_PowerBI', descricao: 'Cirurgias onco Dez/2025 (API)', unidade: 'cirurgias onco mensal' },
    { periodo: '2026-01', valor: 6739, fonte: 'SNS_Portal_PowerBI', descricao: 'Cirurgias onco Jan/2026 (API)', unidade: 'cirurgias onco mensal' },
  ]},
  { medidaId: 'E1.A2', medidaNome: 'SNS24 Cidadao', dataPoints: [
    { periodo: '2025-03', valor: 16156, fonte: 'GT_PETS_Abr2025', descricao: 'SMS enviadas a doentes com TMRG >200%', unidade: 'SMS' },
    { periodo: '2025-03', valor: 700, fonte: 'GT_PETS_Abr2025', descricao: 'Doentes operados apos contacto', unidade: 'doentes' },
  ]},
  { medidaId: 'E1.B1', medidaNome: 'Cirurgia Nao-Oncologica', dataPoints: [
    { periodo: '2023-03', valor: 173751, fonte: 'GT_PETS_Abr2025', descricao: 'Q1 2023 operados', unidade: 'operados Q1' },
    { periodo: '2024-03', valor: 175263, fonte: 'GT_PETS_Abr2025', descricao: 'Q1 2024 operados', unidade: 'operados Q1' },
    { periodo: '2025-03', valor: 186273, fonte: 'GT_PETS_Abr2025', descricao: 'Q1 2025 operados (+6.3%)', unidade: 'operados Q1' },
    { periodo: '2025-03', valor: 17149, fonte: 'SNS_Portal_PowerBI', descricao: 'LIC nao-onco fora TMRG Mar/2025 (API confirma GT)', unidade: 'doentes fora TMRG' },
    { periodo: '2025-12', valor: 22984, fonte: 'SNS_Portal_PowerBI', descricao: 'LIC nao-onco fora TMRG Dez/2025 (API) — deterioracao', unidade: 'doentes fora TMRG' },
    { periodo: '2026-01', valor: 54483, fonte: 'SNS_Portal_PowerBI', descricao: 'Cirurgias nao-onco Jan/2026 (API)', unidade: 'cirurgias nao-onco mensal' },
  ]},
  { medidaId: 'E1.B3', medidaNome: 'Consulta Especialidade', dataPoints: [
    { periodo: '2024-03', valor: 376416, fonte: 'GT_PETS_Abr2025', descricao: 'Q1 2024 consultas CTH', unidade: 'consultas' },
    { periodo: '2025-03', valor: 391472, fonte: 'GT_PETS_Abr2025', descricao: 'Q1 2025 consultas CTH (+4%)', unidade: 'consultas' },
    { periodo: '2025-01', valor: 1306975, fonte: 'SNS_Portal_PowerBI', descricao: 'Consultas hospitalares Jan/2025 (API)', unidade: 'consultas mensal' },
    { periodo: '2025-12', valor: 978280, fonte: 'SNS_Portal_PowerBI', descricao: 'Consultas hospitalares Dez/2025 (API)', unidade: 'consultas mensal' },
    { periodo: '2026-01', valor: 1244973, fonte: 'SNS_Portal_PowerBI', descricao: 'Consultas hospitalares Jan/2026 (API)', unidade: 'consultas mensal' },
    // 1ªs Consultas
    { periodo: '2025-01', valor: 360416, fonte: 'SNS_Portal_PowerBI', descricao: '1as consultas Jan/2025 (API)', unidade: 'primeiras consultas mensal' },
    { periodo: '2026-01', valor: 332126, fonte: 'SNS_Portal_PowerBI', descricao: '1as consultas Jan/2026 (API)', unidade: 'primeiras consultas mensal' },
  ]},

  // ═══ EIXO 2 ═══ (Power BI API: 9 series, 211 data points)
  { medidaId: 'E2.A1', medidaNome: 'SNS Gravida', dataPoints: [
    { periodo: '2025-03', valor: 133500, fonte: 'GT_PETS_Abr2025', descricao: '133.500 chamadas desde inicio PETS', unidade: 'chamadas acumuladas' },
    { periodo: '2025-03', valor: 36500, fonte: 'GT_PETS_Abr2025', descricao: '36.500 gravidas retiradas das urgencias', unidade: 'gravidas' },
    // SNS24 Gravida triagens mensais (API: "Número Total Triagens Utentes Grávidas")
    { periodo: '2025-10', valor: 20364, fonte: 'SNS_Portal_PowerBI', descricao: 'Triagens SNS24 Gravida Out/2025 (API)', unidade: 'triagens mensal' },
    { periodo: '2025-12', valor: 16279, fonte: 'SNS_Portal_PowerBI', descricao: 'Triagens SNS24 Gravida Dez/2025 (API)', unidade: 'triagens mensal' },
    { periodo: '2026-01', valor: 18572, fonte: 'SNS_Portal_PowerBI', descricao: 'Triagens SNS24 Gravida Jan/2026 (API)', unidade: 'triagens mensal' },
    // Encaminhamentos para SU (API: "Serviço de Urgência")
    { periodo: '2025-10', valor: 13627, fonte: 'SNS_Portal_PowerBI', descricao: 'Encaminhamentos SU Out/2025 (API)', unidade: 'encaminhamentos SU mensal' },
    { periodo: '2026-01', valor: 12772, fonte: 'SNS_Portal_PowerBI', descricao: 'Encaminhamentos SU Jan/2026 (API)', unidade: 'encaminhamentos SU mensal' },
    // Encaminhamentos para CSP (API: "Cuidados de Saúde Primários")
    { periodo: '2026-01', valor: 4592, fonte: 'SNS_Portal_PowerBI', descricao: 'Encaminhamentos CSP Jan/2026 (API)', unidade: 'encaminhamentos CSP mensal' },
  ]},
  { medidaId: 'E2.A2', medidaNome: 'Incentivos Partos', dataPoints: [
    { periodo: '2024-12', valor: 33, fonte: 'GT_PETS_Abr2025', descricao: 'Taxa cesarianas nacional', unidade: '%' },
    // Partos e cesarianas mensais (API: V_DESNS_EIXO2_Partos)
    { periodo: '2025-01', valor: 5888, fonte: 'SNS_Portal_PowerBI', descricao: 'Total partos Jan/2025 (API)', unidade: 'partos mensal' },
    { periodo: '2025-12', valor: 5579, fonte: 'SNS_Portal_PowerBI', descricao: 'Total partos Dez/2025 (API)', unidade: 'partos mensal' },
    { periodo: '2026-01', valor: 5405, fonte: 'SNS_Portal_PowerBI', descricao: 'Total partos Jan/2026 (API)', unidade: 'partos mensal' },
    { periodo: '2026-01', valor: 1787, fonte: 'SNS_Portal_PowerBI', descricao: 'Cesarianas Jan/2026 (API)', unidade: 'cesarianas mensal' },
  ]},

  // ═══ EIXO 3 ═══ (Power BI API: 10 series via Playwright-discovered tables)
  { medidaId: 'E3.A2', medidaNome: 'CAC', dataPoints: [
    { periodo: '2024-01', valor: 2, fonte: 'GT_PETS_Dez2024', descricao: 'CAC iniciais', unidade: 'CAC' },
    { periodo: '2025-03', valor: 15, fonte: 'GT_PETS_Abr2025', descricao: '15 CAC operacionais', unidade: 'CAC' },
    { periodo: '2025-04', valor: 30334, fonte: 'GT_PETS_Abr2025', descricao: 'Utentes atendidos Ago/24-Abr/25', unidade: 'atendimentos acumulados' },
    // API: "Centro de Atendimento Clinico" — 23 CAC in Jan 2026
    { periodo: '2026-01', valor: 23, fonte: 'SNS_Portal_PowerBI', descricao: '23 CAC operacionais Jan/2026 (API)', unidade: 'CAC' },
    // API: "Utentes Atendidos" — 89,202 acumulados
    { periodo: '2026-01', valor: 89202, fonte: 'SNS_Portal_PowerBI', descricao: 'Utentes atendidos acumulados Jan/2026 (API)', unidade: 'atendimentos acumulados' },
    // API: "01_Doentes Referenciados" — 61,682 acumulados
    { periodo: '2026-01', valor: 61682, fonte: 'SNS_Portal_PowerBI', descricao: 'Doentes referenciados acumulados (API)', unidade: 'doentes referenciados' },
  ]},
  { medidaId: 'E3.B1', medidaNome: 'Libertacao Camas', dataPoints: [
    { periodo: '2024-12', valor: 538, fonte: 'GT_PETS_Dez2024', descricao: 'Camas contratadas Dez/2024', unidade: 'camas' },
    { periodo: '2025-03', valor: 1611, fonte: 'GT_PETS_Abr2025', descricao: 'Camas contratadas Mar/2025', unidade: 'camas' },
  ]},
  { medidaId: 'E3.B4', medidaNome: 'Teleconsultas', dataPoints: [
    { periodo: '2025-03', valor: 7000, fonte: 'GT_PETS_Abr2025', descricao: '7.000 teleconsultas em ~4 meses', unidade: 'teleconsultas' },
  ]},
  { medidaId: 'E3.A1', medidaNome: 'Encaminhamentos Urgencia', dataPoints: [
    // API: "Total Geral" (encaminhamentos SU) — monthly
    { periodo: '2025-12', valor: 84159, fonte: 'SNS_Portal_PowerBI', descricao: 'Encaminhamentos SU Dez/2025 (API)', unidade: 'encaminhamentos mensal' },
    { periodo: '2026-01', valor: 88591, fonte: 'SNS_Portal_PowerBI', descricao: 'Encaminhamentos SU Jan/2026 (API)', unidade: 'encaminhamentos mensal' },
    // API: "Total de Agendamentos nos CSP"
    { periodo: '2026-01', valor: 4366, fonte: 'SNS_Portal_PowerBI', descricao: 'Agendamentos CSP via SU Jan/2026 (API)', unidade: 'agendamentos mensal' },
    // API: "Consultas CSP Agendadas e Realizadas"
    { periodo: '2026-01', valor: 84225, fonte: 'SNS_Portal_PowerBI', descricao: 'Consultas CSP agendadas+realizadas Jan/2026 (API)', unidade: 'consultas mensal' },
  ]},

  // ═══ EIXO 4 ═══ (Power BI API: 13 series, 25 months utentes + consultas CSP)
  { medidaId: 'E4.A1', medidaNome: 'Medicos Familia', dataPoints: [
    { periodo: '2024-01', valor: 1746916, fonte: 'GT_PETS_Abr2025', descricao: 'Utentes sem MdF Jan/2024', unidade: 'utentes sem MdF' },
    { periodo: '2025-03', valor: 1600000, fonte: 'GT_PETS_Abr2025', descricao: '1.6M utentes sem MdF (+135.542 com MdF)', unidade: 'utentes sem MdF' },
    { periodo: '2024-05', valor: 350000, fonte: 'SNS_Portal_HTML', descricao: 'Meta PETS: 350.000 pessoas com MdF via parceria publico-social', unidade: 'utentes meta' },
    // API: V_DESNS_EIXO4_UTENTES_INSC — full monthly series
    { periodo: '2024-01', valor: 8628210, fonte: 'SNS_Portal_PowerBI', descricao: 'Utentes com MdF Jan/2024 (API)', unidade: 'utentes com MdF' },
    { periodo: '2024-12', valor: 8963243, fonte: 'SNS_Portal_PowerBI', descricao: 'Utentes com MdF Dez/2024 (API, +335K)', unidade: 'utentes com MdF' },
    { periodo: '2025-12', valor: 9159219, fonte: 'SNS_Portal_PowerBI', descricao: 'Utentes com MdF Dez/2025 (API, +196K)', unidade: 'utentes com MdF' },
    { periodo: '2026-01', valor: 9133697, fonte: 'SNS_Portal_PowerBI', descricao: 'Utentes com MdF Jan/2026 (API, -25.5K vs Dez)', unidade: 'utentes com MdF' },
    { periodo: '2026-01', valor: 1601018, fonte: 'SNS_Portal_PowerBI', descricao: 'Utentes sem MdF Jan/2026 (API)', unidade: 'utentes sem MdF' },
    { periodo: '2026-01', valor: 10746324, fonte: 'SNS_Portal_PowerBI', descricao: 'Total utentes inscritos Jan/2026 (API)', unidade: 'utentes total' },
  ]},
  { medidaId: 'E4.A2', medidaNome: 'Batas Brancas', dataPoints: [
    { periodo: '2024-12', valor: 323674, fonte: 'GT_PETS_Dez2024', descricao: '323.674 consultas acumuladas (+49.83%)', unidade: 'consultas acumuladas' },
  ]},
  { medidaId: 'E4.A4', medidaNome: 'Ligue Antes', dataPoints: [
    { periodo: '2024-12', valor: 3500000, fonte: 'GT_PETS_Abr2025', descricao: '3.5M chamadas em 2024', unidade: 'chamadas' },
    { periodo: '2025-03', valor: 1700000, fonte: 'GT_PETS_Abr2025', descricao: '1.7M chamadas Q1 2025', unidade: 'chamadas Q1' },
  ]},
  { medidaId: 'E4.B2', medidaNome: 'Medicos Aposentados', dataPoints: [
    { periodo: '2024-12', valor: 207, fonte: 'GT_PETS_Dez2024', descricao: '207 contratados em 2024', unidade: 'medicos' },
    { periodo: '2025-03', valor: 248, fonte: 'GT_PETS_Abr2025', descricao: '207 + 41 em Q1 2025', unidade: 'medicos' },
  ]},
  { medidaId: 'E4.C2', medidaNome: 'Rastreios Oncologicos', dataPoints: [
    { periodo: '2024-12', valor: 65.42, fonte: 'GT_PETS_Abr2025', descricao: 'Cobertura mama 2024', unidade: '%' },
    { periodo: '2024-12', valor: 59.66, fonte: 'GT_PETS_Abr2025', descricao: 'Cobertura colo 2024', unidade: '%' },
    { periodo: '2024-12', valor: 58.42, fonte: 'GT_PETS_Abr2025', descricao: 'Cobertura colorretal 2024', unidade: '%' },
  ]},

  // ═══ EIXO 5 ═══ (Power BI API: psychology/psychiatry episodes, TMRG data)
  { medidaId: 'E5.A1', medidaNome: 'Psicologos CSP', dataPoints: [
    { periodo: '2025-03', valor: 1385, fonte: 'GT_PETS_Abr2025', descricao: 'Total SNS: 1.385 (+31 desde Mai/2024)', unidade: 'psicologos' },
    // Episodios de psicologia anuais (API: "Nº Total de Episódios de Psicologia")
    { periodo: '2023-12', valor: 335587, fonte: 'SNS_Portal_PowerBI', descricao: 'Episodios psicologia 2023 (API)', unidade: 'episodios anual' },
    { periodo: '2024-12', valor: 357285, fonte: 'SNS_Portal_PowerBI', descricao: 'Episodios psicologia 2024 (API, +6.5%)', unidade: 'episodios anual' },
    { periodo: '2025-12', valor: 393270, fonte: 'SNS_Portal_PowerBI', descricao: 'Episodios psicologia 2025 (API, +10.1%)', unidade: 'episodios anual' },
    { periodo: '2026-01', valor: 35243, fonte: 'SNS_Portal_PowerBI', descricao: 'Episodios psicologia Jan/2026 (API)', unidade: 'episodios mensal' },
  ]},
  { medidaId: 'E5.B1', medidaNome: 'ECSM', dataPoints: [
    { periodo: '2025-03', valor: 20, fonte: 'GT_PETS_Abr2025', descricao: '20 ECSM operacionais (2021-2022)', unidade: 'ECSM' },
    // Episodios de psiquiatria anuais (API: "Nº Total de Episódios de Psiquiatria")
    { periodo: '2023-12', valor: 769197, fonte: 'SNS_Portal_PowerBI', descricao: 'Episodios psiquiatria 2023 (API)', unidade: 'episodios anual' },
    { periodo: '2024-12', valor: 765020, fonte: 'SNS_Portal_PowerBI', descricao: 'Episodios psiquiatria 2024 (API, -0.5%)', unidade: 'episodios anual' },
    { periodo: '2025-12', valor: 754672, fonte: 'SNS_Portal_PowerBI', descricao: 'Episodios psiquiatria 2025 (API, -1.4%)', unidade: 'episodios anual' },
    // Psiquiatria fora TMRG (API: "consultas psiquiatria fora TMRG")
    { periodo: '2023-12', valor: 21591, fonte: 'SNS_Portal_PowerBI', descricao: 'Consultas psiquiatria fora TMRG 2023 (API)', unidade: 'consultas fora TMRG' },
  ]},
  { medidaId: 'E5.C2', medidaNome: 'CRI', dataPoints: [
    { periodo: '2024-07', valor: 15, fonte: 'GT_PETS_Dez2024', descricao: '15 CRI piloto desde Jul/2024', unidade: 'CRI' },
  ]},
];

export function getGroundTruth(medidaId: string): KPIGroundTruth | undefined {
  return KPI_GROUND_TRUTH.find(g => g.medidaId === medidaId);
}
