/**
 * Risk assessment engine — batch forecasting with traffic-light classification.
 */

import { holtWintersForecast, ForecastResult } from './holtWinters';
import { ForecastableIndicator } from '../../config/forecastCatalog';
import { ULS_REGISTRY, ULS } from '../../config/ulsRegistry';
import { SNSRecord } from '../snsApi';
import { extractPeriodo, extractInstituicao, matchULS } from '../dataTransform';

export type RiskLevel = 'verde' | 'amarelo' | 'vermelho' | 'cinzento';

export interface RiskAssessment {
  ulsCode: string;
  ulsNome: string;
  indicatorId: string;
  indicatorNome: string;
  eixo: number;
  risco: RiskLevel;
  horizonte: number;
  ultimoValorReal: number | null;
  ultimoPeriodo: string | null;
  forecast3m: number | null;
  forecast6m: number | null;
  forecast12m: number | null;
  metaCP: number | null;
  gapVsCP_pct: number | null;
  invertido: boolean;
  dadosInsuficientes: boolean;
  fundamentacao?: string;
}

export interface RiskSummary {
  total: number;
  verdes: number;
  amarelos: number;
  vermelhos: number;
  cinzentos: number;
  porULS: Record<string, { uls: ULS; score: number; alertas: RiskAssessment[] }>;
  porIndicador: Record<string, { indicador: string; eixo: number; verdes: number; amarelos: number; vermelhos: number; cinzentos: number }>;
  topRiscos: RiskAssessment[];
  calculadoEm: string;
}

function classifyRisk(
  forecast: ForecastResult, meta: number | null, invertido: boolean, horizonte: number,
): { risco: RiskLevel; fundamentacao: string } {
  if (meta === null || forecast.projecao.length === 0) {
    return { risco: 'cinzento', fundamentacao: 'Meta ou dados insuficientes' };
  }

  const idx = Math.min(horizonte - 1, forecast.projecao.length - 1);
  const proj = forecast.projecao[idx];

  const forecastOK = invertido ? proj.forecast <= meta : proj.forecast >= meta;
  const ci80OK = invertido ? proj.ci80_upper <= meta : proj.ci80_lower >= meta;

  if (forecastOK && ci80OK) {
    return { risco: 'verde', fundamentacao: 'Projecao e CI 80% dentro da meta' };
  }
  if (forecastOK && !ci80OK) {
    return { risco: 'amarelo', fundamentacao: `CI 80% cruza a meta (risco de ${invertido ? 'ultrapassar' : 'ficar abaixo'})` };
  }

  const gap = invertido
    ? ((proj.forecast - meta) / Math.abs(meta || 1)) * 100
    : ((meta - proj.forecast) / Math.abs(meta || 1)) * 100;

  return { risco: 'vermelho', fundamentacao: `Projecao ${Math.abs(gap).toFixed(1)}% ${invertido ? 'acima' : 'abaixo'} da meta` };
}

export function assessRiskForIndicator(
  records: SNSRecord[],
  indicator: ForecastableIndicator,
  contractMetas: Map<string, number>,
  horizonte: number = 12,
): RiskAssessment[] {
  const results: RiskAssessment[] = [];

  for (const uls of ULS_REGISTRY) {
    const ulsRecords = records.filter(r => {
      const inst = extractInstituicao(r, indicator.campoInstituicao ? [indicator.campoInstituicao] : []);
      return inst ? matchULS(inst) === uls.code : false;
    });

    // Build time series
    const byPeriod = new Map<string, number>();
    for (const r of ulsRecords) {
      const p = extractPeriodo(r, [indicator.campoPeriodo]);
      const v = Number(r[indicator.campoValor]);
      if (p && !isNaN(v)) byPeriod.set(p, (byPeriod.get(p) || 0) + v);
    }
    const timeSeries = Array.from(byPeriod.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([periodo, valor]) => ({ periodo, valor }));

    if (timeSeries.length < 6) {
      results.push({
        ulsCode: uls.code, ulsNome: uls.nome,
        indicatorId: indicator.id, indicatorNome: indicator.nome, eixo: indicator.eixo,
        risco: 'cinzento', horizonte,
        ultimoValorReal: timeSeries.length > 0 ? timeSeries[timeSeries.length - 1].valor : null,
        ultimoPeriodo: timeSeries.length > 0 ? timeSeries[timeSeries.length - 1].periodo : null,
        forecast3m: null, forecast6m: null, forecast12m: null,
        metaCP: contractMetas.get(uls.code) ?? null,
        gapVsCP_pct: null, invertido: indicator.invertido ?? false, dadosInsuficientes: true,
      });
      continue;
    }

    const forecast = holtWintersForecast(timeSeries, { horizon: horizonte });
    const metaCP = contractMetas.get(uls.code) ?? null;
    const { risco, fundamentacao } = classifyRisk(forecast, metaCP, indicator.invertido ?? false, horizonte);

    const f3 = forecast.projecao[Math.min(2, forecast.projecao.length - 1)]?.forecast ?? null;
    const f6 = forecast.projecao[Math.min(5, forecast.projecao.length - 1)]?.forecast ?? null;
    const f12 = forecast.projecao[Math.min(11, forecast.projecao.length - 1)]?.forecast ?? null;
    const gapCP = (metaCP && f12) ? parseFloat((((f12 - metaCP) / Math.abs(metaCP || 1)) * 100).toFixed(1)) : null;

    results.push({
      ulsCode: uls.code, ulsNome: uls.nome,
      indicatorId: indicator.id, indicatorNome: indicator.nome, eixo: indicator.eixo,
      risco, horizonte,
      ultimoValorReal: timeSeries[timeSeries.length - 1].valor,
      ultimoPeriodo: timeSeries[timeSeries.length - 1].periodo,
      forecast3m: f3, forecast6m: f6, forecast12m: f12,
      metaCP, gapVsCP_pct: gapCP,
      invertido: indicator.invertido ?? false, dadosInsuficientes: false, fundamentacao,
    });
  }

  return results;
}

export function computeRiskSummary(assessments: RiskAssessment[]): RiskSummary {
  const summary: RiskSummary = {
    total: assessments.length,
    verdes: assessments.filter(a => a.risco === 'verde').length,
    amarelos: assessments.filter(a => a.risco === 'amarelo').length,
    vermelhos: assessments.filter(a => a.risco === 'vermelho').length,
    cinzentos: assessments.filter(a => a.risco === 'cinzento').length,
    porULS: {},
    porIndicador: {},
    topRiscos: [],
    calculadoEm: new Date().toISOString(),
  };

  for (const a of assessments) {
    if (!summary.porULS[a.ulsCode]) {
      const uls = ULS_REGISTRY.find(u => u.code === a.ulsCode)!;
      summary.porULS[a.ulsCode] = { uls, score: 0, alertas: [] };
    }
    const ulsEntry = summary.porULS[a.ulsCode];
    ulsEntry.alertas.push(a);
    ulsEntry.score += a.risco === 'vermelho' ? 3 : a.risco === 'amarelo' ? 1 : 0;

    if (!summary.porIndicador[a.indicatorId]) {
      summary.porIndicador[a.indicatorId] = { indicador: a.indicatorNome, eixo: a.eixo, verdes: 0, amarelos: 0, vermelhos: 0, cinzentos: 0 };
    }
    const indEntry = summary.porIndicador[a.indicatorId];
    if (a.risco === 'verde') indEntry.verdes++;
    else if (a.risco === 'amarelo') indEntry.amarelos++;
    else if (a.risco === 'vermelho') indEntry.vermelhos++;
    else indEntry.cinzentos++;
  }

  summary.topRiscos = assessments
    .filter(a => a.risco === 'vermelho')
    .sort((a, b) => Math.abs(b.gapVsCP_pct ?? 0) - Math.abs(a.gapVsCP_pct ?? 0))
    .slice(0, 10);

  return summary;
}
