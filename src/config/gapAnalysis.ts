/**
 * Gap Analysis: what's needed vs what's available for full PETS monitoring.
 * Based on: IPP-JCS Policy Brief (Oct 2024), SNS Portal, GT PETS Reports, Open Data APIs.
 */

export type DataGapStatus = 'disponivel' | 'parcial' | 'portal_sns_only' | 'relatorio_only' | 'inexistente';

export interface MeasureGapAnalysis {
  medidaId: string;
  eixo: number;
  grauActual: number;
  grauPotencial: number;
  gapScore: number;
  gapStatus: DataGapStatus;
  indicadorNecessario: string;
  recomendacao: string;
  prioridade: 'critica' | 'alta' | 'media' | 'baixa';
  entidade: string;
}

export const GAP_ANALYSIS: MeasureGapAnalysis[] = [
  // ═══ EIXO 1 ═══
  { medidaId: 'E1.A1', eixo: 1, grauActual: 4, grauPotencial: 9, gapScore: 5, gapStatus: 'parcial', indicadorNecessario: 'LIC com decomposicao por patologia oncologica', recomendacao: 'Publicar dataset LIC com campo patologia por ULS', prioridade: 'critica', entidade: 'ACSS' },
  { medidaId: 'E1.A2', eixo: 1, grauActual: 5, grauPotencial: 8, gapScore: 3, gapStatus: 'parcial', indicadorNecessario: 'SNS24 com decomposicao por tipo de contacto', recomendacao: 'Adicionar campo tipo_contacto ao dataset SNS24', prioridade: 'media', entidade: 'SPMS' },
  { medidaId: 'E1.B1', eixo: 1, grauActual: 7, grauPotencial: 9, gapScore: 2, gapStatus: 'disponivel', indicadorNecessario: 'Cirurgias com dados mensais (nao cumulativos)', recomendacao: 'Publicar dados mensais em vez de YTD', prioridade: 'media', entidade: 'ACSS' },
  { medidaId: 'E1.B2', eixo: 1, grauActual: 2, grauPotencial: 5, gapScore: 3, gapStatus: 'relatorio_only', indicadorNecessario: 'Estado de processos legislativos', recomendacao: 'Publicar tracker legislativo do PETS', prioridade: 'baixa', entidade: 'MS' },
  { medidaId: 'E1.B3', eixo: 1, grauActual: 8, grauPotencial: 9, gapScore: 1, gapStatus: 'disponivel', indicadorNecessario: 'Consultas CTH com dados mensais', recomendacao: 'Dados ja disponiveis, melhorar documentacao', prioridade: 'baixa', entidade: 'ACSS' },
  { medidaId: 'E1.C1', eixo: 1, grauActual: 5, grauPotencial: 8, gapScore: 3, gapStatus: 'parcial', indicadorNecessario: 'Teleconsultas por tipo de doente', recomendacao: 'Decompor teleconsultas por cronico/agudo', prioridade: 'media', entidade: 'SPMS' },
  { medidaId: 'E1.C2', eixo: 1, grauActual: 1, grauPotencial: 6, gapScore: 5, gapStatus: 'inexistente', indicadorNecessario: 'N.o protocolos CSP-Hospital revistos', recomendacao: 'Publicar lista de protocolos e estado', prioridade: 'alta', entidade: 'ACSS' },
  { medidaId: 'E1.C3', eixo: 1, grauActual: 2, grauPotencial: 8, gapScore: 6, gapStatus: 'inexistente', indicadorNecessario: 'Episodios de hospitalizacao domiciliaria', recomendacao: 'Publicar dataset HD por ULS e mes', prioridade: 'alta', entidade: 'ACSS' },
  { medidaId: 'E1.C4', eixo: 1, grauActual: 6, grauPotencial: 8, gapScore: 2, gapStatus: 'parcial', indicadorNecessario: 'LIC com detalhes de protocolo de inclusao', recomendacao: 'Melhorar granularidade LIC', prioridade: 'media', entidade: 'ACSS' },
  { medidaId: 'E1.C5', eixo: 1, grauActual: 1, grauPotencial: 5, gapScore: 4, gapStatus: 'inexistente', indicadorNecessario: 'Indicadores de fiscalizacao TMRG', recomendacao: 'Publicar resultados de fiscalizacao', prioridade: 'alta', entidade: 'IGAS' },

  // ═══ EIXO 2 ═══
  { medidaId: 'E2.A1', eixo: 2, grauActual: 5, grauPotencial: 9, gapScore: 4, gapStatus: 'parcial', indicadorNecessario: 'Dados SNS Gravida separados do SNS24', recomendacao: 'Publicar dataset SNS Gravida independente', prioridade: 'alta', entidade: 'SPMS' },
  { medidaId: 'E2.A2', eixo: 2, grauActual: 7, grauPotencial: 9, gapScore: 2, gapStatus: 'disponivel', indicadorNecessario: 'Partos com dados mensais e tipo', recomendacao: 'Dados ja bons, adicionar tipo de parto', prioridade: 'baixa', entidade: 'ACSS' },
  { medidaId: 'E2.A3', eixo: 2, grauActual: 2, grauPotencial: 7, gapScore: 5, gapStatus: 'inexistente', indicadorNecessario: 'Partos em convencao setor privado', recomendacao: 'Publicar dados de convencoes para partos', prioridade: 'alta', entidade: 'ACSS' },
  { medidaId: 'E2.B1', eixo: 2, grauActual: 3, grauPotencial: 7, gapScore: 4, gapStatus: 'relatorio_only', indicadorNecessario: 'N.o ULS com ARGU operacional', recomendacao: 'Publicar lista ULS com ARGU', prioridade: 'media', entidade: 'ACSS' },
  { medidaId: 'E2.B2', eixo: 2, grauActual: 3, grauPotencial: 7, gapScore: 4, gapStatus: 'parcial', indicadorNecessario: 'Racios pessoal em blocos de parto', recomendacao: 'Decompor trabalhadores por servico obstetrico', prioridade: 'media', entidade: 'ACSS' },
  { medidaId: 'E2.B3', eixo: 2, grauActual: 1, grauPotencial: 3, gapScore: 2, gapStatus: 'inexistente', indicadorNecessario: 'Tabela precos MCDT actualizada', recomendacao: 'Publicar tabela MCDT em formato aberto', prioridade: 'baixa', entidade: 'ACSS' },
  { medidaId: 'E2.B4', eixo: 2, grauActual: 6, grauPotencial: 8, gapScore: 2, gapStatus: 'parcial', indicadorNecessario: 'Urgencias pediatricas com flag APR', recomendacao: 'Adicionar campo APR ao dataset urgencias', prioridade: 'media', entidade: 'ACSS' },
  { medidaId: 'E2.C1', eixo: 2, grauActual: 1, grauPotencial: 3, gapScore: 2, gapStatus: 'inexistente', indicadorNecessario: 'Estado separacao especialidades', recomendacao: 'Medida organizacional — tracker', prioridade: 'baixa', entidade: 'MS' },
  { medidaId: 'E2.C2', eixo: 2, grauActual: 1, grauPotencial: 6, gapScore: 5, gapStatus: 'inexistente', indicadorNecessario: 'N.o gravidas com EESMO', recomendacao: 'Publicar dados acompanhamento EESMO', prioridade: 'alta', entidade: 'ACSS' },
  { medidaId: 'E2.C3', eixo: 2, grauActual: 1, grauPotencial: 3, gapScore: 2, gapStatus: 'inexistente', indicadorNecessario: 'Modelo organizacional blocos parto', recomendacao: 'Tracker organizacional', prioridade: 'baixa', entidade: 'MS' },

  // ═══ EIXO 3 ═══
  { medidaId: 'E3.A1', eixo: 3, grauActual: 2, grauPotencial: 7, gapScore: 5, gapStatus: 'inexistente', indicadorNecessario: 'Execucao financeira requalificacao SU', recomendacao: 'Publicar dados execucao PRR/obras', prioridade: 'alta', entidade: 'ACSS' },
  { medidaId: 'E3.A2', eixo: 3, grauActual: 3, grauPotencial: 9, gapScore: 6, gapStatus: 'relatorio_only', indicadorNecessario: 'Dataset de CAC: n.o operacionais e atendimentos', recomendacao: 'Publicar dataset CAC mensal por ULS', prioridade: 'critica', entidade: 'ACSS' },
  { medidaId: 'E3.A3', eixo: 3, grauActual: 5, grauPotencial: 8, gapScore: 3, gapStatus: 'parcial', indicadorNecessario: 'Consultas dia seguinte identificadas', recomendacao: 'Flag consulta dia seguinte no dataset', prioridade: 'media', entidade: 'SPMS' },
  { medidaId: 'E3.B1', eixo: 3, grauActual: 7, grauPotencial: 9, gapScore: 2, gapStatus: 'disponivel', indicadorNecessario: 'Camas por tipo (proprias vs contratadas)', recomendacao: 'Decompor por regime contratual', prioridade: 'media', entidade: 'ACSS' },
  { medidaId: 'E3.B2', eixo: 3, grauActual: 2, grauPotencial: 4, gapScore: 2, gapStatus: 'relatorio_only', indicadorNecessario: 'Vagas internato medicina urgencia', recomendacao: 'Publicar dados formacao medica', prioridade: 'baixa', entidade: 'ACSS' },
  { medidaId: 'E3.B3', eixo: 3, grauActual: 5, grauPotencial: 8, gapScore: 3, gapStatus: 'parcial', indicadorNecessario: 'Vacinacao gripe E VSR separadas', recomendacao: 'Publicar dados VSR', prioridade: 'media', entidade: 'DGS' },
  { medidaId: 'E3.B4', eixo: 3, grauActual: 6, grauPotencial: 8, gapScore: 2, gapStatus: 'disponivel', indicadorNecessario: 'Teleconsultas por complexidade', recomendacao: 'Adicionar campo complexidade', prioridade: 'baixa', entidade: 'SPMS' },
  { medidaId: 'E3.B5', eixo: 3, grauActual: 2, grauPotencial: 5, gapScore: 3, gapStatus: 'inexistente', indicadorNecessario: 'Metricas algoritmo SNS24', recomendacao: 'Publicar dados avaliacao algoritmo', prioridade: 'media', entidade: 'SPMS' },
  { medidaId: 'E3.B6', eixo: 3, grauActual: 1, grauPotencial: 5, gapScore: 4, gapStatus: 'inexistente', indicadorNecessario: 'N.o farmacias aderentes + campanhas', recomendacao: 'Publicar dados programas farmacias', prioridade: 'media', entidade: 'INFARMED' },
  { medidaId: 'E3.B7', eixo: 3, grauActual: 2, grauPotencial: 4, gapScore: 2, gapStatus: 'relatorio_only', indicadorNecessario: 'Actividade UUEM', recomendacao: 'Publicar relatorios UUEM', prioridade: 'baixa', entidade: 'ACSS' },
  { medidaId: 'E3.B8', eixo: 3, grauActual: 2, grauPotencial: 7, gapScore: 5, gapStatus: 'inexistente', indicadorNecessario: 'N.o transportes inter-hospitalares', recomendacao: 'Publicar dados transporte critico', prioridade: 'alta', entidade: 'INEM' },
  { medidaId: 'E3.C1', eixo: 3, grauActual: 3, grauPotencial: 9, gapScore: 6, gapStatus: 'relatorio_only', indicadorNecessario: 'Dataset CAC (ver E3.A2)', recomendacao: 'Ver E3.A2', prioridade: 'critica', entidade: 'ACSS' },
  { medidaId: 'E3.C2', eixo: 3, grauActual: 1, grauPotencial: 7, gapScore: 6, gapStatus: 'inexistente', indicadorNecessario: 'Consultas medicas em ERPI', recomendacao: 'Publicar dados apoio ERPI por ULS', prioridade: 'alta', entidade: 'ACSS' },

  // ═══ EIXO 4 ═══
  { medidaId: 'E4.A1', eixo: 4, grauActual: 8, grauPotencial: 10, gapScore: 2, gapStatus: 'disponivel', indicadorNecessario: 'Utentes CSP ja muito bom', recomendacao: 'Publicar dados mensais (nao cumulativos)', prioridade: 'baixa', entidade: 'ACSS' },
  { medidaId: 'E4.A2', eixo: 4, grauActual: 3, grauPotencial: 9, gapScore: 6, gapStatus: 'relatorio_only', indicadorNecessario: 'Dataset Batas Brancas (consultas + ULS)', recomendacao: 'Publicar dataset Batas Brancas mensal', prioridade: 'critica', entidade: 'ACSS' },
  { medidaId: 'E4.A3', eixo: 4, grauActual: 2, grauPotencial: 6, gapScore: 4, gapStatus: 'inexistente', indicadorNecessario: 'Dados operacionais PPP Cascais', recomendacao: 'Publicar dados PPP', prioridade: 'media', entidade: 'ACSS' },
  { medidaId: 'E4.A4', eixo: 4, grauActual: 6, grauPotencial: 9, gapScore: 3, gapStatus: 'parcial', indicadorNecessario: 'SNS24 com flag Ligue Antes', recomendacao: 'Separar dados Ligue Antes', prioridade: 'media', entidade: 'SPMS' },
  { medidaId: 'E4.B1', eixo: 4, grauActual: 4, grauPotencial: 8, gapScore: 4, gapStatus: 'parcial', indicadorNecessario: 'Unidades funcionais por tipo A/B/C', recomendacao: 'Decompor USF por tipo', prioridade: 'alta', entidade: 'ACSS' },
  { medidaId: 'E4.B2', eixo: 4, grauActual: 3, grauPotencial: 7, gapScore: 4, gapStatus: 'parcial', indicadorNecessario: 'Trabalhadores: aposentados recontratados', recomendacao: 'Adicionar campo regime contratacao', prioridade: 'media', entidade: 'ACSS' },
  { medidaId: 'E4.B3', eixo: 4, grauActual: 4, grauPotencial: 8, gapScore: 4, gapStatus: 'parcial', indicadorNecessario: 'USF por tipo com transicoes', recomendacao: 'Historico de transicoes A→B', prioridade: 'media', entidade: 'ACSS' },
  { medidaId: 'E4.B4', eixo: 4, grauActual: 1, grauPotencial: 5, gapScore: 4, gapStatus: 'inexistente', indicadorNecessario: 'Dados cooperativas medicas', recomendacao: 'Publicar dados parcerias', prioridade: 'media', entidade: 'ACSS' },
  { medidaId: 'E4.B5', eixo: 4, grauActual: 1, grauPotencial: 5, gapScore: 4, gapStatus: 'inexistente', indicadorNecessario: 'Carteira adicional voluntaria', recomendacao: 'Publicar dados adesao', prioridade: 'media', entidade: 'ACSS' },
  { medidaId: 'E4.C1', eixo: 4, grauActual: 1, grauPotencial: 7, gapScore: 6, gapStatus: 'inexistente', indicadorNecessario: 'MCDT nos CSP (quimica seca, radiologia)', recomendacao: 'Publicar dados equipamentos CSP', prioridade: 'alta', entidade: 'ACSS' },
  { medidaId: 'E4.C2', eixo: 4, grauActual: 8, grauPotencial: 10, gapScore: 2, gapStatus: 'disponivel', indicadorNecessario: 'Rastreios ja excelente', recomendacao: 'Manter e expandir', prioridade: 'baixa', entidade: 'ACSS' },
  { medidaId: 'E4.C3', eixo: 4, grauActual: 1, grauPotencial: 6, gapScore: 5, gapStatus: 'inexistente', indicadorNecessario: 'N.o CAMP operacionais', recomendacao: 'Publicar dados CAMP', prioridade: 'alta', entidade: 'ACSS' },

  // ═══ EIXO 5 ═══
  { medidaId: 'E5.A1', eixo: 5, grauActual: 5, grauPotencial: 8, gapScore: 3, gapStatus: 'parcial', indicadorNecessario: 'Trabalhadores por especialidade (psicologos)', recomendacao: 'Decompor por especialidade', prioridade: 'alta', entidade: 'ACSS' },
  { medidaId: 'E5.A2', eixo: 5, grauActual: 2, grauPotencial: 5, gapScore: 3, gapStatus: 'relatorio_only', indicadorNecessario: 'Dados programa SM forcas seguranca', recomendacao: 'Publicar dados programa', prioridade: 'media', entidade: 'ACSS' },
  { medidaId: 'E5.A3', eixo: 5, grauActual: 2, grauPotencial: 8, gapScore: 6, gapStatus: 'inexistente', indicadorNecessario: 'Respostas residenciais SM criadas', recomendacao: 'Publicar dados desinstitucionalizacao', prioridade: 'critica', entidade: 'ACSS' },
  { medidaId: 'E5.B1', eixo: 5, grauActual: 3, grauPotencial: 9, gapScore: 6, gapStatus: 'relatorio_only', indicadorNecessario: 'Dataset ECSM: n.o operacionais por ULS', recomendacao: 'Publicar dataset ECSM mensal', prioridade: 'critica', entidade: 'ACSS' },
  { medidaId: 'E5.B2', eixo: 5, grauActual: 1, grauPotencial: 7, gapScore: 6, gapStatus: 'inexistente', indicadorNecessario: 'Dados programas ansiedade/depressao', recomendacao: 'Publicar dados pilotos', prioridade: 'alta', entidade: 'ACSS' },
  { medidaId: 'E5.B3', eixo: 5, grauActual: 5, grauPotencial: 8, gapScore: 3, gapStatus: 'parcial', indicadorNecessario: 'Camas psiquiatria especificamente', recomendacao: 'Adicionar campo especialidade ao lotacao', prioridade: 'alta', entidade: 'ACSS' },
  { medidaId: 'E5.B4', eixo: 5, grauActual: 3, grauPotencial: 7, gapScore: 4, gapStatus: 'relatorio_only', indicadorNecessario: 'Obras SM: estado por hospital', recomendacao: 'Publicar tracker obras SM', prioridade: 'media', entidade: 'ACSS' },
  { medidaId: 'E5.C1', eixo: 5, grauActual: 3, grauPotencial: 7, gapScore: 4, gapStatus: 'relatorio_only', indicadorNecessario: 'Servicos forenses: camas e construcao', recomendacao: 'Publicar dados forenses', prioridade: 'media', entidade: 'ACSS' },
  { medidaId: 'E5.C2', eixo: 5, grauActual: 3, grauPotencial: 9, gapScore: 6, gapStatus: 'relatorio_only', indicadorNecessario: 'Dataset CRI: n.o por ULS e actividade', recomendacao: 'Publicar dataset CRI mensal', prioridade: 'critica', entidade: 'ACSS' },
];

// Summary stats
export const GAP_STATS = {
  total: GAP_ANALYSIS.length,
  grauMedioActual: Math.round(GAP_ANALYSIS.reduce((s, m) => s + m.grauActual, 0) / GAP_ANALYSIS.length * 10) / 10,
  grauMedioPotencial: Math.round(GAP_ANALYSIS.reduce((s, m) => s + m.grauPotencial, 0) / GAP_ANALYSIS.length * 10) / 10,
  gapMedio: Math.round(GAP_ANALYSIS.reduce((s, m) => s + m.gapScore, 0) / GAP_ANALYSIS.length * 10) / 10,
  criticas: GAP_ANALYSIS.filter(g => g.prioridade === 'critica').length,
  altas: GAP_ANALYSIS.filter(g => g.prioridade === 'alta').length,
  datasetsNecessarios: GAP_ANALYSIS.filter(g => g.gapStatus !== 'disponivel').length,
  porEntidade: Object.entries(
    GAP_ANALYSIS.reduce((acc, g) => { acc[g.entidade] = (acc[g.entidade] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).sort(([, a], [, b]) => b - a),
};
