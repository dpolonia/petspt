export interface MonitorabilityLevel {
  grau: number;
  label: string;
  descricao: string;
  cor: string;
}

export const MONITORABILITY_SCALE: MonitorabilityLevel[] = [
  { grau: 1, label: 'Nao monitorizavel', descricao: 'Nenhum dado publico disponivel. Verificacao independente impossivel.', cor: '#991b1b' },
  { grau: 2, label: 'Quase nao monitorizavel', descricao: 'Referencias qualitativas nos relatorios mas sem dados quantitativos publicos.', cor: '#dc2626' },
  { grau: 3, label: 'Muito limitada', descricao: '1-2 data points nos relatorios sem serie temporal continua nem dados abertos.', cor: '#ea580c' },
  { grau: 4, label: 'Limitada', descricao: 'Dados abertos existem mas nao medem directamente o indicador. Proxy necessario.', cor: '#d97706' },
  { grau: 5, label: 'Parcial', descricao: 'Dados abertos cobrem parcialmente (ex: nacionais mas nao por ULS, ou totais mas nao por tipo).', cor: '#ca8a04' },
  { grau: 6, label: 'Razoavel', descricao: 'Dados abertos cobrem o indicador principal com actualizacao mensal mas faltam dimensoes.', cor: '#65a30d' },
  { grau: 7, label: 'Boa', descricao: 'Dados abertos com actualizacao mensal e decomposicao por ULS. Verificacao independente possivel.', cor: '#16a34a' },
  { grau: 8, label: 'Avancada', descricao: 'Multiplos datasets permitem cruzamento e validacao cruzada. Serie temporal longa.', cor: '#059669' },
  { grau: 9, label: 'Quase total', descricao: 'Dados abertos replicam indicadores dos relatorios GT PETS dentro de 5%.', cor: '#0d9488' },
  { grau: 10, label: 'Total', descricao: 'Replicacao exacta dos indicadores com dados em tempo real. Transparencia plena.', cor: '#0891b2' },
];

export function getLevel(grau: number): MonitorabilityLevel {
  return MONITORABILITY_SCALE.find(l => l.grau === grau) || MONITORABILITY_SCALE[0];
}
