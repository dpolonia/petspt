import { describe, it, expect } from 'vitest';
import { applyScenario, computeImpact } from '../scenarioEngine';
import { holtWintersForecast } from '../holtWinters';

function baseForecast() {
  const data = Array.from({ length: 36 }, (_, i) => ({
    periodo: `${2022 + Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, '0')}`,
    valor: 1000 + i * 10,
  }));
  return holtWintersForecast(data, { horizon: 12 });
}

describe('scenarioEngine', () => {
  const bau = baseForecast();

  it('multiplicative applies correct factor', () => {
    const r = applyScenario(bau, [{ type: 'multiplicative', value: 10 }]);
    for (let i = 0; i < r.projecao.length; i++) {
      expect(r.projecao[i].forecast).toBeCloseTo(bau.projecao[i].forecast * 1.1, 0);
    }
  });

  it('additive adds absolute value', () => {
    const r = applyScenario(bau, [{ type: 'additive', value: 500 }]);
    for (let i = 0; i < r.projecao.length; i++) {
      expect(r.projecao[i].forecast).toBeCloseTo(bau.projecao[i].forecast + 500, 0);
    }
  });

  it('target interpolates to goal', () => {
    const r = applyScenario(bau, [{ type: 'target', value: 2000, targetHorizon: 12 }]);
    // Target interpolation is approximate — within 5% is acceptable
    const last = r.projecao[r.projecao.length - 1].forecast;
    expect(Math.abs(last - 2000) / 2000).toBeLessThan(0.05);
  });

  it('capacity changes benchmark', () => {
    const r = applyScenario({ ...bau, benchmark: 1500 }, [{ type: 'capacity', value: 2000 }]);
    expect(r.benchmark).toBe(2000);
    expect(r.unmetDemand).toBeDefined();
  });

  it('does not modify BAU (immutability)', () => {
    const orig = bau.projecao[0].forecast;
    applyScenario(bau, [{ type: 'multiplicative', value: 50 }]);
    expect(bau.projecao[0].forecast).toBe(orig);
  });

  it('computeImpact calculates deltas', () => {
    const c = applyScenario(bau, [{ type: 'additive', value: 100 }]);
    const imp = computeImpact(bau, c);
    expect(imp.delta_medio_mensal).toBeCloseTo(100, -1);
    expect(imp.delta_total).toBeCloseTo(1200, -1);
  });

  it('clamps negatives to zero', () => {
    const r = applyScenario(bau, [{ type: 'additive', value: -999999 }]);
    for (const p of r.projecao) expect(p.forecast).toBeGreaterThanOrEqual(0);
  });
});
