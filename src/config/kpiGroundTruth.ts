/**
 * Ground truth KPI values from PETS evaluation reports.
 * Sources:
 *   - Plano de Emergencia e Transformacao da Saude (May 2024) — targets
 *   - Relatorio GT PETS (Dec 2024) — actuals
 *   - II Relatorio de Progresso (Apr 2025) — actuals
 *
 * These are AUTHORITATIVE. Firestore/API data must match or explain deviation.
 */

export interface KPIGroundTruth {
  medidaId: string;
  medidaNome: string;
  dataPoints: {
    periodo: string;
    valor: number;
    fonte: 'PETS_Plan' | 'GT_PETS_Dez2024' | 'GT_PETS_Abr2025';
    descricao: string;
    unidade: string;
  }[];
}

export const KPI_GROUND_TRUTH: KPIGroundTruth[] = [
  // ═══ EIXO 1 ═══
  { medidaId: 'E1.A1', medidaNome: 'OncoStop2024', dataPoints: [
    { periodo: '2024-01', valor: 1469, fonte: 'GT_PETS_Abr2025', descricao: 'Periodo homologo 2024', unidade: 'doentes onco fora TMRG' },
    { periodo: '2024-05', valor: 2645, fonte: 'GT_PETS_Dez2024', descricao: 'Inicio PETS — doentes fora TMRG', unidade: 'doentes onco fora TMRG' },
    { periodo: '2024-08', valor: 0, fonte: 'GT_PETS_Dez2024', descricao: 'Zero doentes fora TMRG a 31/Ago', unidade: 'doentes onco fora TMRG' },
    { periodo: '2024-11', valor: 168, fonte: 'GT_PETS_Dez2024', descricao: 'Nov 2024', unidade: 'doentes onco fora TMRG' },
    { periodo: '2025-03', valor: 180, fonte: 'GT_PETS_Abr2025', descricao: '180 fora TMRG sem agendamento', unidade: 'doentes onco fora TMRG' },
  ]},
  { medidaId: 'E1.A2', medidaNome: 'SNS24 Cidadao', dataPoints: [
    { periodo: '2025-03', valor: 16156, fonte: 'GT_PETS_Abr2025', descricao: 'SMS enviadas a doentes com TMRG >200%', unidade: 'SMS' },
    { periodo: '2025-03', valor: 700, fonte: 'GT_PETS_Abr2025', descricao: 'Doentes operados apos contacto', unidade: 'doentes' },
  ]},
  { medidaId: 'E1.B1', medidaNome: 'Cirurgia Nao-Oncologica', dataPoints: [
    { periodo: '2023-03', valor: 173751, fonte: 'GT_PETS_Abr2025', descricao: 'Q1 2023 operados', unidade: 'operados Q1' },
    { periodo: '2024-03', valor: 175263, fonte: 'GT_PETS_Abr2025', descricao: 'Q1 2024 operados', unidade: 'operados Q1' },
    { periodo: '2025-03', valor: 186273, fonte: 'GT_PETS_Abr2025', descricao: 'Q1 2025 operados (+6.3%)', unidade: 'operados Q1' },
    { periodo: '2025-03', valor: 17149, fonte: 'GT_PETS_Abr2025', descricao: 'Fora TMRG Mar/2025', unidade: 'doentes fora TMRG' },
  ]},
  { medidaId: 'E1.B3', medidaNome: 'Consulta Especialidade', dataPoints: [
    { periodo: '2024-03', valor: 376416, fonte: 'GT_PETS_Abr2025', descricao: 'Q1 2024 consultas CTH', unidade: 'consultas' },
    { periodo: '2025-03', valor: 391472, fonte: 'GT_PETS_Abr2025', descricao: 'Q1 2025 consultas CTH (+4%)', unidade: 'consultas' },
  ]},

  // ═══ EIXO 2 ═══
  { medidaId: 'E2.A1', medidaNome: 'SNS Gravida', dataPoints: [
    { periodo: '2025-03', valor: 133500, fonte: 'GT_PETS_Abr2025', descricao: '133.500 chamadas desde inicio PETS', unidade: 'chamadas acumuladas' },
    { periodo: '2025-03', valor: 36500, fonte: 'GT_PETS_Abr2025', descricao: '36.500 gravidas retiradas das urgencias', unidade: 'gravidas' },
  ]},
  { medidaId: 'E2.A2', medidaNome: 'Incentivos Partos', dataPoints: [
    { periodo: '2024-12', valor: 33, fonte: 'GT_PETS_Abr2025', descricao: 'Taxa cesarianas nacional', unidade: '%' },
  ]},

  // ═══ EIXO 3 ═══
  { medidaId: 'E3.A2', medidaNome: 'CAC', dataPoints: [
    { periodo: '2024-01', valor: 2, fonte: 'GT_PETS_Dez2024', descricao: 'CAC iniciais', unidade: 'CAC' },
    { periodo: '2025-03', valor: 15, fonte: 'GT_PETS_Abr2025', descricao: '15 CAC operacionais', unidade: 'CAC' },
    { periodo: '2025-04', valor: 30334, fonte: 'GT_PETS_Abr2025', descricao: 'Utentes atendidos Ago/24-Abr/25', unidade: 'atendimentos acumulados' },
  ]},
  { medidaId: 'E3.B1', medidaNome: 'Libertacao Camas', dataPoints: [
    { periodo: '2024-12', valor: 538, fonte: 'GT_PETS_Dez2024', descricao: 'Camas contratadas Dez/2024', unidade: 'camas' },
    { periodo: '2025-03', valor: 1611, fonte: 'GT_PETS_Abr2025', descricao: 'Camas contratadas Mar/2025', unidade: 'camas' },
  ]},
  { medidaId: 'E3.B4', medidaNome: 'Teleconsultas', dataPoints: [
    { periodo: '2025-03', valor: 7000, fonte: 'GT_PETS_Abr2025', descricao: '7.000 teleconsultas em ~4 meses', unidade: 'teleconsultas' },
  ]},

  // ═══ EIXO 4 ═══
  { medidaId: 'E4.A1', medidaNome: 'Medicos Familia', dataPoints: [
    { periodo: '2024-01', valor: 1746916, fonte: 'GT_PETS_Abr2025', descricao: 'Utentes sem MdF Jan/2024', unidade: 'utentes sem MdF' },
    { periodo: '2025-03', valor: 1600000, fonte: 'GT_PETS_Abr2025', descricao: '1.6M utentes sem MdF (+135.542 com MdF)', unidade: 'utentes sem MdF' },
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

  // ═══ EIXO 5 ═══
  { medidaId: 'E5.A1', medidaNome: 'Psicologos CSP', dataPoints: [
    { periodo: '2025-03', valor: 1385, fonte: 'GT_PETS_Abr2025', descricao: 'Total SNS: 1.385 (+31 desde Mai/2024)', unidade: 'psicologos' },
  ]},
  { medidaId: 'E5.B1', medidaNome: 'ECSM', dataPoints: [
    { periodo: '2025-03', valor: 20, fonte: 'GT_PETS_Abr2025', descricao: '20 ECSM operacionais (2021-2022)', unidade: 'ECSM' },
  ]},
  { medidaId: 'E5.C2', medidaNome: 'CRI', dataPoints: [
    { periodo: '2024-07', valor: 15, fonte: 'GT_PETS_Dez2024', descricao: '15 CRI piloto desde Jul/2024', unidade: 'CRI' },
  ]},
];

export function getGroundTruth(medidaId: string): KPIGroundTruth | undefined {
  return KPI_GROUND_TRUTH.find(g => g.medidaId === medidaId);
}
