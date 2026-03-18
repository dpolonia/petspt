/**
 * Forecasting territorial: applies Holt-Winters to each ULS individually.
 */

import { holtWintersForecast, TimeSeriesPoint, ForecastResult, HoltWintersOptions } from './holtWinters';
import { ULS_REGISTRY, ULS } from '../../config/ulsRegistry';
import { getContractForULS } from '../../config/contractTargets';
import { SNSRecord } from '../snsApi';
import { extractPeriodo, extractInstituicao, matchULS } from '../dataTransform';

export interface ULSForecastResult {
  uls: ULS;
  forecast: ForecastResult;
  dataPoints: number;
  contractTarget?: {
    ano: number;
    valor: number;
    fonte: 'cp_pdf' | 'projecao_oe';
  };
  gap?: number; // forecast avg - contract target (negative = below target)
}

export function forecastByULS(
  records: SNSRecord[],
  valueField: string,
  periodoFieldHint: string,
  instituicaoFieldHint: string,
  options: HoltWintersOptions = {},
  contractField?: string,
): ULSForecastResult[] {
  const results: ULSForecastResult[] = [];

  for (const uls of ULS_REGISTRY) {
    // Filter records for this ULS
    const ulsRecords = records.filter(r => {
      const inst = extractInstituicao(r, [instituicaoFieldHint]);
      if (!inst) return false;
      return matchULS(inst) === uls.code;
    });

    if (ulsRecords.length < 4) continue;

    // Build time series
    const byPeriod = new Map<string, number>();
    for (const r of ulsRecords) {
      const p = extractPeriodo(r, [periodoFieldHint]);
      const v = Number(r[valueField]);
      if (p && !isNaN(v)) byPeriod.set(p, (byPeriod.get(p) || 0) + v);
    }

    const timeSeries: TimeSeriesPoint[] = Array.from(byPeriod.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([periodo, valor]) => ({ periodo, valor }));

    if (timeSeries.length < 4) continue;

    const forecast = holtWintersForecast(timeSeries, options);

    // Get contract target
    const contract = getContractForULS(uls.code, 2025);
    let contractTarget;
    let gap;

    if (contract && contractField) {
      const targetVal = contract.metas[contractField as keyof typeof contract.metas];
      if (targetVal != null) {
        contractTarget = { ano: 2025, valor: targetVal as number, fonte: contract.fonte };
        const avgForecast = forecast.projecao.reduce((s, p) => s + p.forecast, 0) / forecast.projecao.length;
        gap = avgForecast - (targetVal as number);
      }
    }

    results.push({ uls, forecast, dataPoints: timeSeries.length, contractTarget, gap });
  }

  return results.sort((a, b) => (a.gap ?? 0) - (b.gap ?? 0));
}
