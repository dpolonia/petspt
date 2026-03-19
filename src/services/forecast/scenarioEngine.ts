/**
 * What-if scenario engine — transformation layer over Holt-Winters forecasts.
 * All computations run in the browser (zero server cost).
 */

import { ForecastResult } from './holtWinters';

export type TransformationType =
  | 'multiplicative'
  | 'additive'
  | 'target'
  | 'capacity'
  | 'trend_shift';

export interface ScenarioParameter {
  id: string;
  label: string;
  descricao: string;
  type: TransformationType;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  affectsIndicators: string[];
}

export interface ScenarioDefinition {
  id: string;
  nome: string;
  descricao: string;
  categoria: 'orcamental' | 'rh' | 'cobertura' | 'infraestrutura' | 'custom';
  parametros: ScenarioParameter[];
  fundamentacao?: string;
}

export interface ScenarioImpact {
  delta_total: number;
  delta_medio_mensal: number;
  delta_pct: number;
}

export function applyScenario(
  baseForecast: ForecastResult,
  parametros: { type: TransformationType; value: number; targetHorizon?: number }[],
): ForecastResult {
  const result: ForecastResult = JSON.parse(JSON.stringify(baseForecast));

  for (const param of parametros) {
    switch (param.type) {
      case 'multiplicative': {
        const factor = 1 + param.value / 100;
        for (const p of result.projecao) {
          p.forecast *= factor;
          p.ci80_lower *= factor;
          p.ci80_upper *= factor;
          p.ci95_lower *= factor;
          p.ci95_upper *= factor;
        }
        break;
      }
      case 'additive':
        for (const p of result.projecao) {
          p.forecast += param.value;
          p.ci80_lower += param.value;
          p.ci80_upper += param.value;
          p.ci95_lower += param.value;
          p.ci95_upper += param.value;
        }
        break;
      case 'target':
        if (result.projecao.length > 0) {
          const startVal = result.projecao[0].forecast;
          const targetVal = param.value;
          const horizon = param.targetHorizon || result.projecao.length;
          for (let i = 0; i < result.projecao.length; i++) {
            const progress = Math.min(i / horizon, 1);
            const interpolated = startVal + (targetVal - startVal) * progress;
            const diff = interpolated - result.projecao[i].forecast;
            result.projecao[i].forecast = interpolated;
            result.projecao[i].ci80_lower += diff;
            result.projecao[i].ci80_upper += diff;
            result.projecao[i].ci95_lower += diff;
            result.projecao[i].ci95_upper += diff;
          }
        }
        break;
      case 'capacity':
        result.benchmark = param.value;
        if (result.benchmark !== undefined) {
          result.unmetDemand = result.projecao.map(p => ({
            periodo: p.periodo,
            excedente: Math.max(0, p.forecast - result.benchmark!),
            excedente_ci80_upper: Math.max(0, p.ci80_upper - result.benchmark!),
            excedente_ci95_upper: Math.max(0, p.ci95_upper - result.benchmark!),
          }));
        }
        break;
      case 'trend_shift': {
        const trendFactor = param.value / 100;
        for (let i = 0; i < result.projecao.length; i++) {
          const shift = result.projecao[i].forecast * trendFactor * (i + 1) / result.projecao.length;
          result.projecao[i].forecast += shift;
          result.projecao[i].ci80_lower += shift;
          result.projecao[i].ci80_upper += shift;
          result.projecao[i].ci95_lower += shift;
          result.projecao[i].ci95_upper += shift;
        }
        break;
      }
    }

    for (const p of result.projecao) {
      p.forecast = Math.max(0, p.forecast);
      p.ci80_lower = Math.max(0, p.ci80_lower);
      p.ci95_lower = Math.max(0, p.ci95_lower);
    }
  }

  return result;
}

export function computeImpact(bau: ForecastResult, cenario: ForecastResult): ScenarioImpact {
  const diffs = cenario.projecao.map((p, i) => p.forecast - bau.projecao[i].forecast);
  const delta_total = diffs.reduce((sum, d) => sum + d, 0);
  const delta_medio = delta_total / diffs.length;
  const bauMean = bau.projecao.reduce((sum, p) => sum + p.forecast, 0) / bau.projecao.length;
  const delta_pct = bauMean !== 0 ? (delta_medio / bauMean) * 100 : 0;

  return {
    delta_total: Math.round(delta_total),
    delta_medio_mensal: Math.round(delta_medio),
    delta_pct: parseFloat(delta_pct.toFixed(2)),
  };
}
