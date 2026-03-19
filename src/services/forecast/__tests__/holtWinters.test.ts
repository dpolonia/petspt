import { describe, it, expect } from 'vitest';
import { holtWintersForecast, TimeSeriesPoint } from '../holtWinters';

function syntheticData(n = 36): TimeSeriesPoint[] {
  return Array.from({ length: n }, (_, i) => ({
    periodo: `${2022 + Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, '0')}`,
    valor: 1000 + i * 20 + 100 * Math.sin((2 * Math.PI * i) / 12),
  }));
}

describe('holtWintersForecast', () => {
  const data = syntheticData(36);

  it('returns projections for requested horizon', () => {
    const r = holtWintersForecast(data, { horizon: 12 });
    expect(r.projecao).toHaveLength(12);
    expect(r.historico).toHaveLength(36);
  });

  it('has alpha/beta/gamma between 0 and 1', () => {
    const r = holtWintersForecast(data);
    expect(r.metricas.alpha).toBeGreaterThanOrEqual(0);
    expect(r.metricas.alpha).toBeLessThanOrEqual(1);
    expect(r.metricas.beta).toBeGreaterThanOrEqual(0);
    expect(r.metricas.gamma).toBeGreaterThanOrEqual(0);
  });

  it('CIs expand with horizon', () => {
    const r = holtWintersForecast(data, { horizon: 12 });
    const s1 = r.projecao[0].ci95_upper - r.projecao[0].ci95_lower;
    const s12 = r.projecao[11].ci95_upper - r.projecao[11].ci95_lower;
    expect(s12).toBeGreaterThan(s1);
  });

  it('CI 95% wider than CI 80%', () => {
    const r = holtWintersForecast(data, { horizon: 6 });
    for (const p of r.projecao) {
      expect(p.ci95_upper - p.ci95_lower).toBeGreaterThanOrEqual(p.ci80_upper - p.ci80_lower);
    }
  });

  it('computes unmet demand with benchmark', () => {
    const r = holtWintersForecast(data, { horizon: 12, benchmark: 1500 });
    expect(r.benchmark).toBe(1500);
    expect(r.unmetDemand).toBeDefined();
    expect(r.unmetDemand).toHaveLength(12);
    for (const ud of r.unmetDemand!) expect(ud.excedente).toBeGreaterThanOrEqual(0);
  });

  it('uses linear fallback for short series', () => {
    const r = holtWintersForecast(syntheticData(12), { horizon: 6 });
    expect(r.projecao).toHaveLength(6);
    expect(r.metricas.alpha).toBe(0);
  });

  it('clamps negative values to zero', () => {
    const r = holtWintersForecast(data, { horizon: 12 });
    for (const p of r.projecao) {
      expect(p.forecast).toBeGreaterThanOrEqual(0);
      expect(p.ci80_lower).toBeGreaterThanOrEqual(0);
      expect(p.ci95_lower).toBeGreaterThanOrEqual(0);
    }
  });

  it('has positive RMSE', () => {
    const r = holtWintersForecast(data);
    expect(r.metricas.rmse).toBeGreaterThan(0);
  });

  it('generates consecutive periods', () => {
    const r = holtWintersForecast(data, { horizon: 3 });
    expect(r.projecao[0].periodo).toMatch(/^\d{4}-\d{2}$/);
    expect(r.projecao[0].periodo > data[data.length - 1].periodo).toBe(true);
  });
});
