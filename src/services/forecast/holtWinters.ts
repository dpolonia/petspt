/**
 * Holt-Winters Triple Exponential Smoothing — pure TypeScript.
 * Methodology aligned with Goiana-da-Silva et al. (2025), Front. Public Health 13:1694713.
 */

export interface TimeSeriesPoint {
  periodo: string;
  valor: number;
}

export interface ForecastResult {
  historico: TimeSeriesPoint[];
  projecao: {
    periodo: string;
    forecast: number;
    ci80_lower: number;
    ci80_upper: number;
    ci95_lower: number;
    ci95_upper: number;
  }[];
  metricas: {
    mse: number;
    rmse: number;
    mape: number;
    alpha: number;
    beta: number;
    gamma: number;
  };
  unmetDemand?: {
    periodo: string;
    excedente: number;
    excedente_ci80_upper: number;
    excedente_ci95_upper: number;
  }[];
  benchmark?: number;
}

export interface HoltWintersOptions {
  seasonalPeriod?: number;
  horizon?: number;
  benchmark?: number;
  alpha?: number;
  beta?: number;
  gamma?: number;
}

export function holtWintersForecast(
  data: TimeSeriesPoint[],
  options: HoltWintersOptions = {}
): ForecastResult {
  const { seasonalPeriod: m = 12, horizon: h = 12, benchmark } = options;
  const values = data.map(d => d.valor);
  const n = values.length;

  if (n < 2 * m) {
    return linearTrendFallback(data, h, benchmark);
  }

  let { alpha, beta, gamma } = options;
  if (alpha === undefined || beta === undefined || gamma === undefined) {
    const optimized = optimizeParameters(values, m);
    alpha = alpha ?? optimized.alpha;
    beta = beta ?? optimized.beta;
    gamma = gamma ?? optimized.gamma;
  }

  // Initialize
  let level = values.slice(0, m).reduce((a, b) => a + b, 0) / m;
  let trend = 0;
  for (let i = 0; i < m; i++) trend += (values[m + i] - values[i]) / m;
  trend /= m;
  const seasonal: number[] = [];
  for (let i = 0; i < m; i++) seasonal.push(values[i] - level);

  // Fit
  const residuals: number[] = [];
  for (let t = 0; t < n; t++) {
    const si = t % m;
    const fitted = level + trend + seasonal[si];
    residuals.push(values[t] - fitted);
    const prevLevel = level;
    level = alpha * (values[t] - seasonal[si]) + (1 - alpha) * (level + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
    seasonal[si] = gamma * (values[t] - level) + (1 - gamma) * seasonal[si];
  }

  const mse = residuals.reduce((sum, r) => sum + r * r, 0) / n;
  const rmse = Math.sqrt(mse);
  const mape = residuals.reduce((sum, r, i) => sum + Math.abs(r / (values[i] || 1)), 0) / n * 100;
  const sigma = Math.sqrt(mse);

  // Forecast
  const lastPeriodo = data[n - 1].periodo;
  const projecao: ForecastResult['projecao'] = [];

  for (let step = 1; step <= h; step++) {
    const forecastValue = level + step * trend + seasonal[(n + step - 1) % m];
    const spread = sigma * Math.sqrt(step);

    projecao.push({
      periodo: nextPeriodo(lastPeriodo, step),
      forecast: Math.max(0, forecastValue),
      ci80_lower: Math.max(0, forecastValue - 1.28 * spread),
      ci80_upper: forecastValue + 1.28 * spread,
      ci95_lower: Math.max(0, forecastValue - 1.96 * spread),
      ci95_upper: forecastValue + 1.96 * spread,
    });
  }

  let unmetDemand: ForecastResult['unmetDemand'];
  if (benchmark !== undefined) {
    unmetDemand = projecao.map(p => ({
      periodo: p.periodo,
      excedente: Math.max(0, p.forecast - benchmark),
      excedente_ci80_upper: Math.max(0, p.ci80_upper - benchmark),
      excedente_ci95_upper: Math.max(0, p.ci95_upper - benchmark),
    }));
  }

  return {
    historico: data, projecao,
    metricas: { mse, rmse, mape, alpha, beta, gamma },
    unmetDemand, benchmark,
  };
}

function optimizeParameters(values: number[], m: number): { alpha: number; beta: number; gamma: number } {
  const grid = [0.01, 0.1, 0.2, 0.3, 0.5, 0.7, 0.9];
  let bestMSE = Infinity;
  let best = { alpha: 0.3, beta: 0.1, gamma: 0.1 };

  for (const a of grid) {
    for (const b of grid) {
      for (const g of grid) {
        const mse = computeMSE(values, m, a, b, g);
        if (mse < bestMSE) { bestMSE = mse; best = { alpha: a, beta: b, gamma: g }; }
      }
    }
  }
  return best;
}

function computeMSE(values: number[], m: number, alpha: number, beta: number, gamma: number): number {
  const n = values.length;
  let level = values.slice(0, m).reduce((a, b) => a + b, 0) / m;
  let trend = 0;
  for (let i = 0; i < m; i++) trend += (values[m + i] - values[i]) / m;
  trend /= m;
  const seasonal: number[] = [];
  for (let i = 0; i < m; i++) seasonal.push(values[i] - level);

  let sse = 0;
  for (let t = 0; t < n; t++) {
    const si = t % m;
    sse += (values[t] - (level + trend + seasonal[si])) ** 2;
    const prevLevel = level;
    level = alpha * (values[t] - seasonal[si]) + (1 - alpha) * (level + trend);
    trend = beta * (level - prevLevel) + (1 - beta) * trend;
    seasonal[si] = gamma * (values[t] - level) + (1 - gamma) * seasonal[si];
  }
  return sse / n;
}

function nextPeriodo(base: string, stepsAhead: number): string {
  const [year, month] = base.split('-').map(Number);
  const total = (year * 12 + month - 1) + stepsAhead;
  return `${Math.floor(total / 12)}-${String((total % 12) + 1).padStart(2, '0')}`;
}

function linearTrendFallback(data: TimeSeriesPoint[], h: number, benchmark?: number): ForecastResult {
  const n = data.length;
  const values = data.map(d => d.valor);
  const meanX = (n - 1) / 2;
  const meanY = values.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) { num += (i - meanX) * (values[i] - meanY); den += (i - meanX) ** 2; }
  const slope = den !== 0 ? num / den : 0;
  const intercept = meanY - slope * meanX;
  const residuals = values.map((v, i) => v - (intercept + slope * i));
  const sigma = Math.sqrt(residuals.reduce((s, r) => s + r * r, 0) / n);
  const lastPeriodo = data[n - 1].periodo;

  const projecao = Array.from({ length: h }, (_, i) => {
    const step = i + 1;
    const forecast = intercept + slope * (n - 1 + step);
    const spread = sigma * Math.sqrt(1 + step / n);
    return {
      periodo: nextPeriodo(lastPeriodo, step),
      forecast: Math.max(0, forecast),
      ci80_lower: Math.max(0, forecast - 1.28 * spread),
      ci80_upper: forecast + 1.28 * spread,
      ci95_lower: Math.max(0, forecast - 1.96 * spread),
      ci95_upper: forecast + 1.96 * spread,
    };
  });

  return { historico: data, projecao, metricas: { mse: sigma ** 2, rmse: sigma, mape: 0, alpha: 0, beta: 0, gamma: 0 }, benchmark };
}
