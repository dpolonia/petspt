/**
 * Dados estáticos extraídos dos Relatórios do GT PETS.
 * Fonte: Relatório GT PETS (20 Dez 2024) e II Relatório de Progresso (Abril 2025).
 */

import { Estado } from '../types';

export interface KPIData {
  baseline?: { periodo: string; valor: number };
  reference?: { periodo: string; valor: number };
  current?: { periodo: string; valor: number };
  dataPoints?: { periodo: string; valor: number }[];
  unidade?: string;
  invertido?: boolean;
}

export interface MedidaEstado {
  id: string;
  eixo: number;
  nome: string;
  nomeCurto: string;
  estado: Estado;
  prioridade: 'urgente' | 'prioritaria' | 'estruturante';
  descricaoProgresso: string;
  legislacao?: string;
  kpiData?: KPIData;
}

export const MEDIDAS_ESTADO: MedidaEstado[] = [
  // ─── EIXO 1 ──────────────────────
  { id: 'E1.A1', eixo: 1, nome: 'Regularização da lista de espera para cirurgia oncológica (OncoStop2024)', nomeCurto: 'OncoStop2024', estado: 'concluida', prioridade: 'urgente', descricaoProgresso: 'Programa alcançou zero doentes oncológicos fora do TMRG a 31/Ago/2024. A 31/Mar/2025: 180 doentes fora TMRG sem agendamento (vs. 1469 no período homólogo de 2024, redução de 87,7%).', kpiData: { baseline: { periodo: '2024-01', valor: 1469 }, reference: { periodo: '2024-06', valor: 2645 }, current: { periodo: '2025-03', valor: 180 }, dataPoints: [{ periodo: '2024-01', valor: 1469 }, { periodo: '2024-05', valor: 2645 }, { periodo: '2024-08', valor: 0 }, { periodo: '2024-11', valor: 168 }, { periodo: '2025-03', valor: 180 }], unidade: 'doentes fora TMRG', invertido: true } },
  { id: 'E1.A2', eixo: 1, nome: 'Aproximação do SNS ao cidadão através da Linha SNS24', nomeCurto: 'SNS24 Cidadão', estado: 'concluida', prioridade: 'urgente', descricaoProgresso: 'Enviadas 16.156 SMS para doentes com TMRG ultrapassado em >200%. Mais de 700 doentes intervencionados após esta ação.', kpiData: { current: { periodo: '2025-03', valor: 16156 }, unidade: 'SMS enviadas' } },
  { id: 'E1.B1', eixo: 1, nome: 'Programa cirúrgico para doentes não-oncológicos', nomeCurto: 'Cirurgia Não-Oncológica', estado: 'concluida', prioridade: 'prioritaria', descricaoProgresso: 'Q1 2025: 186.273 operados (+6,3% vs. 2024, +7,2% vs. 2023). Doentes fora TMRG: 17.149 em Mar/2025 (-12,4% vs. período homólogo).', legislacao: 'Portaria n.º 212/2024/1, de 18/Set; Portaria n.º 305/2024/1, de 27/Nov', kpiData: { baseline: { periodo: '2024-01', valor: 175263 }, reference: { periodo: '2024-06', valor: 175263 }, current: { periodo: '2025-03', valor: 186273 }, dataPoints: [{ periodo: '2023-03', valor: 173751 }, { periodo: '2024-03', valor: 175263 }, { periodo: '2025-03', valor: 186273 }], unidade: 'operados Q1' } },
  { id: 'E1.B2', eixo: 1, nome: 'Nova prioridade clínica para doentes oncológicos', nomeCurto: 'Prioridade Oncológica', estado: 'em_curso', prioridade: 'prioritaria', descricaoProgresso: 'Em curso — reestruturação regulamentar para inclusão em novo enquadramento legislativo.' },
  { id: 'E1.B3', eixo: 1, nome: 'Reforço do acesso à consulta especializada', nomeCurto: 'Consulta Especialidade', estado: 'concluida', prioridade: 'prioritaria', descricaoProgresso: 'Q1 2025: 391.472 consultas CTH (+4% vs. Q1 2024).', kpiData: { baseline: { periodo: '2024-03', valor: 376416 }, current: { periodo: '2025-03', valor: 391472 }, dataPoints: [{ periodo: '2024-03', valor: 376416 }, { periodo: '2025-03', valor: 391472 }], unidade: 'consultas CTH Q1' } },
  { id: 'E1.C1', eixo: 1, nome: 'Monitorização à distância do doente crónico', nomeCurto: 'Teleconsulta Crónicos', estado: 'em_curso', prioridade: 'estruturante', descricaoProgresso: 'Em implementação — programa de teleconsulta e devices.' },
  { id: 'E1.C2', eixo: 1, nome: 'Revisão de protocolos para consulta de especialidade nos CSP', nomeCurto: 'Protocolos CSP→Hospital', estado: 'em_curso', prioridade: 'estruturante', descricaoProgresso: 'Em curso — revisão dos protocolos de referenciação.' },
  { id: 'E1.C3', eixo: 1, nome: 'Alargamento da Hospitalização Domiciliária', nomeCurto: 'Hospitalização Domiciliária', estado: 'em_curso', prioridade: 'estruturante', descricaoProgresso: 'Em curso — alargamento a doentes pós-operatórios.' },
  { id: 'E1.C4', eixo: 1, nome: 'Revisão dos protocolos para inclusão de doente em LIC', nomeCurto: 'Protocolos LIC', estado: 'em_curso', prioridade: 'estruturante', descricaoProgresso: 'Em curso — esgotar alternativas terapêuticas antes de inscrição na LIC.' },
  { id: 'E1.C5', eixo: 1, nome: 'Monitorização de acompanhamento à atividade adicional', nomeCurto: 'Monitorização TMRG', estado: 'em_curso', prioridade: 'estruturante', descricaoProgresso: 'Em curso — regulamentação de fiscalização do cumprimento dos TMRG.' },

  // ─── EIXO 2 ──────────────────────
  { id: 'E2.A1', eixo: 2, nome: 'Criação de canal SNS Grávida', nomeCurto: 'SNS Grávida', estado: 'concluida', prioridade: 'urgente', descricaoProgresso: '133.500 chamadas desde início do PETS. 36.500 grávidas retiradas das urgências.', kpiData: { current: { periodo: '2025-03', valor: 133500 }, dataPoints: [{ periodo: '2024-06', valor: 0 }, { periodo: '2024-12', valor: 80000 }, { periodo: '2025-03', valor: 133500 }], unidade: 'chamadas' } },
  { id: 'E2.A2', eixo: 2, nome: 'Incentivos financeiros para partos', nomeCurto: 'Incentivos Partos', estado: 'parcial', prioridade: 'urgente', descricaoProgresso: 'Despacho 10466-C/2024 publicado. Ecografias actualizadas: 70€/120€/70€ por trimestre.', legislacao: 'Despacho 10466-C/2024' },
  { id: 'E2.A3', eixo: 2, nome: 'Convenções com setor privado', nomeCurto: 'Convenções Privado', estado: 'parcial', prioridade: 'urgente', descricaoProgresso: 'Protocolo mantido com privados em LVT. Alargamento ao setor social expectável.' },
  { id: 'E2.B1', eixo: 2, nome: 'Atendimento Referenciado Ginecologia (ARGU)', nomeCurto: 'ARGU', estado: 'concluida', prioridade: 'prioritaria', descricaoProgresso: 'Sistema implementado com diversos níveis de referenciação.' },
  { id: 'E2.B2', eixo: 2, nome: 'Rácios de pessoal nos locais de parto', nomeCurto: 'Rácios Pessoal', estado: 'concluida', prioridade: 'prioritaria', descricaoProgresso: 'Sem informação disponível para aferir grau de execução.' },
  { id: 'E2.B3', eixo: 2, nome: 'Tabela MCDT ecografias pré-natais', nomeCurto: 'Tabela Ecografias', estado: 'concluida', prioridade: 'prioritaria', descricaoProgresso: 'Concretizada com Despacho 10466-C/2024.', legislacao: 'Despacho 10466-C/2024' },
  { id: 'E2.B4', eixo: 2, nome: 'Atendimento Pediátrico Referenciado', nomeCurto: 'APR Pediatria', estado: 'concluida', prioridade: 'prioritaria', descricaoProgresso: 'Sistema implementado com maior efetividade que em Dez/2024.' },
  { id: 'E2.C1', eixo: 2, nome: 'Separação Ginecologia/Obstetrícia', nomeCurto: 'Separação Gineco/Obst.', estado: 'nao_implementada', prioridade: 'estruturante', descricaoProgresso: 'Não implementada — difícil implementação a médio prazo.' },
  { id: 'E2.C2', eixo: 2, nome: 'Acompanhamento por EESMO', nomeCurto: 'EESMO', estado: 'nao_implementada', prioridade: 'estruturante', descricaoProgresso: 'Sem informação disponível. Não concretizada.' },
  { id: 'E2.C3', eixo: 2, nome: 'Estruturas blocos de parto', nomeCurto: 'Blocos Parto', estado: 'nao_implementada', prioridade: 'estruturante', descricaoProgresso: 'Não implementada.' },

  // ─── EIXO 3 ──────────────────────
  { id: 'E3.A1', eixo: 3, nome: 'Requalificação Serviços de Urgência', nomeCurto: 'Requalificação SU', estado: 'em_curso', prioridade: 'urgente', descricaoProgresso: 'Em fase inicial. 40M€ previstos. Portaria no GSEAO.' },
  { id: 'E3.A2', eixo: 3, nome: 'Centros de Atendimento Clínico', nomeCurto: 'CAC', estado: 'concluida', prioridade: 'urgente', descricaoProgresso: '15 CAC operacionais (vs. 2 iniciais). 30.334 utentes atendidos (Ago/24–Abr/25).', kpiData: { baseline: { periodo: '2024-01', valor: 2 }, current: { periodo: '2025-03', valor: 15 }, dataPoints: [{ periodo: '2024-01', valor: 2 }, { periodo: '2024-06', valor: 2 }, { periodo: '2024-09', valor: 5 }, { periodo: '2024-10', valor: 8 }, { periodo: '2024-11', valor: 10 }, { periodo: '2024-12', valor: 12 }, { periodo: '2025-01', valor: 15 }, { periodo: '2025-03', valor: 15 }], unidade: 'CAC operacionais' } },
  { id: 'E3.A3', eixo: 3, nome: 'Consulta dia seguinte CSP', nomeCurto: 'Consulta Dia Seguinte', estado: 'concluida', prioridade: 'urgente', descricaoProgresso: 'Implementada em 26+ ULS.', kpiData: { baseline: { periodo: '2024-01', valor: 0 }, current: { periodo: '2025-03', valor: 26 }, dataPoints: [{ periodo: '2024-01', valor: 0 }, { periodo: '2024-06', valor: 10 }, { periodo: '2024-12', valor: 20 }, { periodo: '2025-03', valor: 26 }], unidade: 'ULS com consulta dia seguinte' } },
  { id: 'E3.B1', eixo: 3, nome: 'Libertação de camas', nomeCurto: 'Libertação Camas', estado: 'concluida', prioridade: 'prioritaria', descricaoProgresso: '1.611 camas contratadas ao setor privado e social (vs. 538 em Dez/2024).', kpiData: { baseline: { periodo: '2024-01', valor: 0 }, current: { periodo: '2025-03', valor: 1611 }, dataPoints: [{ periodo: '2024-01', valor: 0 }, { periodo: '2024-12', valor: 538 }, { periodo: '2025-03', valor: 1611 }], unidade: 'camas contratadas' } },
  { id: 'E3.B2', eixo: 3, nome: 'Especialidade Medicina de Urgência', nomeCurto: 'Especialidade Urgência', estado: 'concluida', prioridade: 'prioritaria', descricaoProgresso: 'Aprovada pela OM em 23/Set/2024. Aguarda abertura de vagas.' },
  { id: 'E3.B3', eixo: 3, nome: 'Vacinação Gripe e VSR', nomeCurto: 'Vacinação Gripe/VSR', estado: 'concluida', prioridade: 'prioritaria', descricaoProgresso: 'Normas publicadas. Campanhas em curso.' },
  { id: 'E3.B4', eixo: 3, nome: 'Teleconsultas situações menores', nomeCurto: 'Teleconsultas', estado: 'concluida', prioridade: 'prioritaria', descricaoProgresso: '7.000 teleconsultas realizadas em ~4 meses.', kpiData: { baseline: { periodo: '2024-01', valor: 0 }, current: { periodo: '2025-03', valor: 7000 }, dataPoints: [{ periodo: '2024-01', valor: 0 }, { periodo: '2024-10', valor: 1500 }, { periodo: '2024-12', valor: 4000 }, { periodo: '2025-03', valor: 7000 }], unidade: 'teleconsultas' } },
  { id: 'E3.B5', eixo: 3, nome: 'Algoritmo SNS24', nomeCurto: 'Algoritmo SNS24', estado: 'concluida', prioridade: 'prioritaria', descricaoProgresso: 'Desenvolvido. Sem dados quantitativos de avaliação.' },
  { id: 'E3.B6', eixo: 3, nome: 'Campanhas farmácias comunitárias', nomeCurto: 'Campanhas Farmácias', estado: 'concluida', prioridade: 'prioritaria', descricaoProgresso: 'Campanhas implementadas: Vacinação, Ligue Antes, Salve Vidas.' },
  { id: 'E3.B7', eixo: 3, nome: 'Dept. Urgência e Emergência na DE-SNS', nomeCurto: 'Dept. Urgência', estado: 'concluida', prioridade: 'prioritaria', descricaoProgresso: 'UUEM criada.', legislacao: 'Despacho 12638/2024' },
  { id: 'E3.B8', eixo: 3, nome: 'Transporte inter-hospitalar doente crítico', nomeCurto: 'Transporte Crítico', estado: 'concluida', prioridade: 'prioritaria', descricaoProgresso: 'Despacho 840/2025 publicado.', legislacao: 'Despacho 840/2025' },
  { id: 'E3.C1', eixo: 3, nome: 'Modelo Centros Atendimento Clínico', nomeCurto: 'Modelo CAC', estado: 'concluida', prioridade: 'estruturante', descricaoProgresso: 'Ver medida A.2 (expansão para 15 CAC).' },
  { id: 'E3.C2', eixo: 3, nome: 'Apoio médico a lares (ERPI)', nomeCurto: 'Apoio ERPI', estado: 'em_curso', prioridade: 'estruturante', descricaoProgresso: 'Sem dados que permitam avaliação.' },

  // ─── EIXO 4 ──────────────────────
  { id: 'E4.A1', eixo: 4, nome: 'Atribuição de Médicos de Família', nomeCurto: 'Médicos Família', estado: 'concluida', prioridade: 'urgente', descricaoProgresso: 'Mar/2025: +135.542 cidadãos com MdF vs. Jan/2024. 1,6M utentes ainda sem MdF.', kpiData: { baseline: { periodo: '2024-01', valor: 1746916 }, current: { periodo: '2025-03', valor: 1600000 }, dataPoints: [{ periodo: '2024-01', valor: 1746916 }, { periodo: '2024-06', valor: 1700000 }, { periodo: '2024-12', valor: 1650000 }, { periodo: '2025-03', valor: 1600000 }], unidade: 'utentes sem MdF', invertido: true } },
  { id: 'E4.A2', eixo: 4, nome: 'Batas Brancas (parceria setor social)', nomeCurto: 'Batas Brancas', estado: 'em_curso', prioridade: 'urgente', descricaoProgresso: '323.674 consultas acumuladas até Dez/2024 (+49,83%). 8 ULS, 22 instituições sociais.', kpiData: { baseline: { periodo: '2024-01', valor: 0 }, current: { periodo: '2024-12', valor: 323674 }, dataPoints: [{ periodo: '2024-01', valor: 0 }, { periodo: '2024-06', valor: 150000 }, { periodo: '2024-12', valor: 323674 }], unidade: 'consultas acumuladas' } },
  { id: 'E4.A3', eixo: 4, nome: 'PPP Hospital de Cascais', nomeCurto: 'PPP Cascais', estado: 'concluida', prioridade: 'urgente', descricaoProgresso: 'Operacional desde 4/Nov/2024 em Cascais e Sintra.', legislacao: 'RCM 131/2024' },
  { id: 'E4.A4', eixo: 4, nome: 'Linha acesso médico no dia', nomeCurto: 'Ligue Antes', estado: 'concluida', prioridade: 'urgente', descricaoProgresso: '2024: 3,5M chamadas. Q1 2025: 1,7M chamadas. Taxa resposta: 87%.', kpiData: { current: { periodo: '2025-03', valor: 5200000 }, dataPoints: [{ periodo: '2024-06', valor: 0 }, { periodo: '2024-12', valor: 3500000 }, { periodo: '2025-03', valor: 5200000 }], unidade: 'chamadas acumuladas' } },
  { id: 'E4.B1', eixo: 4, nome: 'USF-modelo C', nomeCurto: 'USF-C', estado: 'em_curso', prioridade: 'prioritaria', descricaoProgresso: '19 candidaturas registadas. Estima-se 191.000 utentes.', legislacao: 'DL 81/2024', kpiData: { baseline: { periodo: '2024-01', valor: 0 }, current: { periodo: '2025-03', valor: 19 }, dataPoints: [{ periodo: '2024-01', valor: 0 }, { periodo: '2024-09', valor: 5 }, { periodo: '2025-03', valor: 19 }], unidade: 'candidaturas USF-C' } },
  { id: 'E4.B2', eixo: 4, nome: 'Médicos aposentados', nomeCurto: 'Médicos Aposentados', estado: 'concluida', prioridade: 'prioritaria', descricaoProgresso: '207 contratados em 2024 + 41 em Q1 2025.', kpiData: { baseline: { periodo: '2024-01', valor: 0 }, current: { periodo: '2025-03', valor: 248 }, dataPoints: [{ periodo: '2024-01', valor: 0 }, { periodo: '2024-12', valor: 207 }, { periodo: '2025-03', valor: 248 }], unidade: 'medicos contratados' } },
  { id: 'E4.B3', eixo: 4, nome: 'Transição USF-A/UCSP → USF-B', nomeCurto: 'Transição USF-B', estado: 'em_curso', prioridade: 'prioritaria', descricaoProgresso: 'Critérios revistos. IDG ≥60%.', legislacao: 'Portaria 454-A/2023; Portaria 270/2024/1' },
  { id: 'E4.B4', eixo: 4, nome: 'Parcerias médicos/cooperativas', nomeCurto: 'Cooperativas Médicas', estado: 'em_curso', prioridade: 'prioritaria', descricaoProgresso: 'Sem informação disponível.' },
  { id: 'E4.B5', eixo: 4, nome: 'Carteira adicional voluntária', nomeCurto: 'Carteira Adicional', estado: 'em_curso', prioridade: 'prioritaria', descricaoProgresso: 'Proposta em análise pela SEGS.' },
  { id: 'E4.C1', eixo: 4, nome: 'MCDT química seca/radiologia CSP', nomeCurto: 'MCDT nos CSP', estado: 'em_curso', prioridade: 'estruturante', descricaoProgresso: 'Sem informação disponível.' },
  { id: 'E4.C2', eixo: 4, nome: 'Rastreios oncológicos CSP', nomeCurto: 'Rastreios Oncológicos', estado: 'em_curso', prioridade: 'estruturante', descricaoProgresso: 'Mama: 65,42% (2024). Colo: 59,66%. Colorretal: 58,42%. Tendência de subida.', kpiData: { baseline: { periodo: '2023-12', valor: 54.74 }, current: { periodo: '2024-12', valor: 65.42 }, dataPoints: [{ periodo: '2023-12', valor: 54.74 }, { periodo: '2024-12', valor: 65.42 }], unidade: '% cobertura mama' } },
  { id: 'E4.C3', eixo: 4, nome: 'CAMP', nomeCurto: 'CAMP', estado: 'em_curso', prioridade: 'estruturante', descricaoProgresso: 'Sem informação disponível.' },

  // ─── EIXO 5 ──────────────────────
  { id: 'E5.A1', eixo: 5, nome: 'Contratação de psicólogos CSP', nomeCurto: 'Psicólogos CSP', estado: 'concluida', prioridade: 'urgente', descricaoProgresso: '31 novas contratações desde Mai/2024. Total SNS: 1.385. 60 vagas em concurso.', kpiData: { baseline: { periodo: '2024-01', valor: 1354 }, current: { periodo: '2025-03', valor: 1385 }, dataPoints: [{ periodo: '2024-01', valor: 1354 }, { periodo: '2024-06', valor: 1360 }, { periodo: '2025-03', valor: 1385 }], unidade: 'psicologos no SNS' } },
  { id: 'E5.A2', eixo: 5, nome: 'SM Forças de Segurança', nomeCurto: 'SM Forças Segurança', estado: 'concluida', prioridade: 'urgente', descricaoProgresso: 'Despachos 10294-C/2024 e 12894/2024 publicados.', legislacao: 'Despacho 10294-C/2024; Despacho 12894/2024' },
  { id: 'E5.A3', eixo: 5, nome: 'Desinstitucionalização SM', nomeCurto: 'Desinstitucionalização', estado: 'em_curso', prioridade: 'urgente', descricaoProgresso: 'Aviso de abertura publicado em 12/Fev/2025. 500 respostas previstas.', kpiData: { baseline: { periodo: '2024-01', valor: 0 }, current: { periodo: '2025-03', valor: 0 }, dataPoints: [{ periodo: '2024-01', valor: 0 }, { periodo: '2025-02', valor: 0 }], unidade: 'respostas residenciais', invertido: false } },
  { id: 'E5.B1', eixo: 5, nome: 'Equipas Comunitárias SM (ECSM)', nomeCurto: 'ECSM', estado: 'concluida', prioridade: 'prioritaria', descricaoProgresso: '20 ECSM de 2021-2022 operacionais. Avisos para 20 adicionais publicados.', kpiData: { baseline: { periodo: '2024-01', valor: 20 }, current: { periodo: '2025-03', valor: 20 }, dataPoints: [{ periodo: '2024-01', valor: 20 }, { periodo: '2025-03', valor: 20 }], unidade: 'ECSM operacionais' } },
  { id: 'E5.B2', eixo: 5, nome: 'Programas ansiedade/depressão CSP', nomeCurto: 'Ansiedade/Depressão', estado: 'em_curso', prioridade: 'prioritaria', descricaoProgresso: 'Programa desenhado. 5 pilotos previstos. Ainda não em funcionamento.' },
  { id: 'E5.B3', eixo: 5, nome: 'Internamento agudo SLSM', nomeCurto: 'Internamento SLSM', estado: 'concluida', prioridade: 'prioritaria', descricaoProgresso: 'Peniche (ULS Oeste) concluído. HFF e Viseu em construção.' },
  { id: 'E5.B4', eixo: 5, nome: 'Serviços regionais SM complexidade', nomeCurto: 'Serviços Regionais SM', estado: 'em_curso', prioridade: 'prioritaria', descricaoProgresso: '8 obras concluídas, 12 em curso.', kpiData: { baseline: { periodo: '2024-01', valor: 0 }, current: { periodo: '2025-03', valor: 8 }, dataPoints: [{ periodo: '2024-01', valor: 0 }, { periodo: '2024-12', valor: 5 }, { periodo: '2025-03', valor: 8 }], unidade: 'obras concluidas' } },
  { id: 'E5.C1', eixo: 5, nome: 'Serviços forenses', nomeCurto: 'Forenses', estado: 'em_curso', prioridade: 'estruturante', descricaoProgresso: 'HMLemos: 20 camas abertas. Sobral Cid e JMatos: estimativa início 2026.', kpiData: { baseline: { periodo: '2024-01', valor: 0 }, current: { periodo: '2025-03', valor: 20 }, dataPoints: [{ periodo: '2024-01', valor: 0 }, { periodo: '2024-12', valor: 20 }, { periodo: '2025-03', valor: 20 }], unidade: 'camas forenses' } },
  { id: 'E5.C2', eixo: 5, nome: 'CRI em SLSM', nomeCurto: 'CRI', estado: 'concluida', prioridade: 'estruturante', descricaoProgresso: '15 projetos-piloto em funcionamento desde Jul/2024.', legislacao: 'Portaria 73/2024', kpiData: { baseline: { periodo: '2024-01', valor: 0 }, current: { periodo: '2025-03', valor: 15 }, dataPoints: [{ periodo: '2024-01', valor: 0 }, { periodo: '2024-07', valor: 15 }, { periodo: '2025-03', valor: 15 }], unidade: 'CRI operacionais' } },
];

export function getMedidasByEixo(eixo: number): MedidaEstado[] {
  return MEDIDAS_ESTADO.filter(m => m.eixo === eixo);
}

export function getScorecard(): { concluidas: number; em_curso: number; parciais: number; nao_implementadas: number; total: number } {
  const all = MEDIDAS_ESTADO;
  return {
    concluidas: all.filter(m => m.estado === 'concluida').length,
    em_curso: all.filter(m => m.estado === 'em_curso').length,
    parciais: all.filter(m => m.estado === 'parcial').length,
    nao_implementadas: all.filter(m => m.estado === 'nao_implementada').length,
    total: all.length,
  };
}

export const STATIC_DATA = {
  eixo1: {
    oncostop: {
      doentes_fora_tmrg_inicio_mai2024: 2645,
      doentes_fora_tmrg_ago2024: 0,
      doentes_fora_tmrg_mar2025: 180,
      doentes_fora_tmrg_homolog_mar2024: 1469,
      reducao_percentual: 87.7,
      cirurgias_onco_2024_total: 71510,
      cirurgias_onco_q1_2023: 18245,
      cirurgias_onco_q1_2024: 18914,
      cirurgias_onco_q1_2025: 20376,
    },
    cirurgia_nao_onco: {
      operados_q1_2023: 173751,
      operados_q1_2024: 175263,
      operados_q1_2025: 186273,
      fora_tmrg_mar2025: 17149,
      fora_tmrg_mar2024: 19567,
      reducao_fora_tmrg_percent: 12.4,
    },
    consultas_especialidade: {
      cth_q1_2024: 376416,
      cth_q1_2025: 391472,
    },
  },
  kpis: {
    eixo1: { label: 'Doentes oncológicos fora TMRG', valor: 180, anterior: 2645, unidade: 'doentes', tendencia: 'descida' as const },
    eixo2: { label: 'Taxa de cesarianas no SNS', valor: 33, anterior: null, unidade: '%', tendencia: 'estavel' as const },
    eixo3: { label: 'CAC operacionais', valor: 15, anterior: 2, unidade: 'centros', tendencia: 'subida' as const },
    eixo4: { label: 'Utentes sem Médico de Família', valor: 1600000, anterior: 1746916, unidade: 'utentes', tendencia: 'descida' as const },
    eixo5: { label: 'Consultas de psicologia (variação)', valor: 11.27, anterior: null, unidade: '%', tendencia: 'subida' as const },
  },
};
