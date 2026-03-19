export type TrendColor = 'verde' | 'amarelo' | 'laranja' | 'vermelho' | 'cinzento';

export interface MeasureTrendResult {
  cor: TrendColor;
  label: string;
  baselineValue: number | null;
  referenceValue: number | null;
  currentValue: number | null;
  currentPeriodo: string | null;
  mesesDesfavoraveis: number;
  tendenciaSlope: number | null;
  tendenciaConvergente: boolean;
  dataSource: 'api_dinamica' | 'dados_fixos' | 'sem_dados';
  timeSeries: { periodo: string; valor: number }[];
}

export function calculateMeasureTrend(
  timeSeries: { periodo: string; valor: number }[],
  invertido = false,
): MeasureTrendResult {
  const filtered = timeSeries.filter(d => d.periodo >= '2024-01').sort((a, b) => a.periodo.localeCompare(b.periodo));

  if (filtered.length < 2) {
    return { cor: 'cinzento', label: 'Sem dados suficientes', baselineValue: null, referenceValue: null, currentValue: null, currentPeriodo: null, mesesDesfavoraveis: 0, tendenciaSlope: null, tendenciaConvergente: false, dataSource: 'sem_dados', timeSeries: filtered };
  }

  const baseline = filtered.find(d => d.periodo === '2024-01') || filtered[0];
  const reference = filtered.find(d => d.periodo === '2024-06') || filtered.find(d => d.periodo <= '2024-06' && d.periodo >= '2024-04') || baseline;
  const current = filtered[filtered.length - 1];

  const last12 = filtered.slice(-12);
  let mesesDesfavoraveis = 0;
  for (const d of last12) {
    const isFav = invertido ? d.valor <= reference.valor : d.valor >= reference.valor;
    if (!isFav) mesesDesfavoraveis++;
  }

  const last6 = filtered.slice(-6);
  let slope = 0;
  if (last6.length >= 3) {
    const n = last6.length;
    const meanX = (n - 1) / 2;
    const meanY = last6.reduce((s, d) => s + d.valor, 0) / n;
    let num = 0, den = 0;
    for (let i = 0; i < n; i++) { num += (i - meanX) * (last6[i].valor - meanY); den += (i - meanX) ** 2; }
    slope = den !== 0 ? num / den : 0;
  }

  const tendenciaConvergente = invertido ? slope < 0 : slope > 0;

  let cor: TrendColor;
  let label: string;
  if (mesesDesfavoraveis === 0) { cor = 'verde'; label = 'Consolidada'; }
  else if (mesesDesfavoraveis <= 4 && tendenciaConvergente) { cor = 'amarelo'; label = `Em progresso (${mesesDesfavoraveis}/12 abaixo)`; }
  else if (mesesDesfavoraveis <= 8) { cor = 'laranja'; label = `Atencao (${mesesDesfavoraveis}/12 abaixo)`; }
  else { cor = 'vermelho'; label = `Em regressao (${mesesDesfavoraveis}/12 abaixo)`; }

  return { cor, label, baselineValue: baseline.valor, referenceValue: reference.valor, currentValue: current.valor, currentPeriodo: current.periodo, mesesDesfavoraveis, tendenciaSlope: slope, tendenciaConvergente, dataSource: 'api_dinamica', timeSeries: filtered };
}

export const DEFAULT_TREND: MeasureTrendResult = {
  cor: 'cinzento', label: 'Nao avaliavel', baselineValue: null, referenceValue: null, currentValue: null, currentPeriodo: null, mesesDesfavoraveis: 0, tendenciaSlope: null, tendenciaConvergente: false, dataSource: 'sem_dados', timeSeries: [],
};
