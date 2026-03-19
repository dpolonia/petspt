import { describe, it, expect } from 'vitest';
import { computeRiskSummary, RiskAssessment } from '../riskEngine';

function mock(overrides: Partial<RiskAssessment> = {}): RiskAssessment {
  return {
    ulsCode: 'ULS_TEST', ulsNome: 'ULS Teste', indicatorId: 'FC_TEST', indicatorNome: 'Test',
    eixo: 1, risco: 'verde', horizonte: 12, ultimoValorReal: 1000, ultimoPeriodo: '2025-03',
    forecast3m: 1100, forecast6m: 1200, forecast12m: 1300, metaCP: 1200,
    gapVsCP_pct: 8.3, invertido: false, dadosInsuficientes: false, ...overrides,
  };
}

describe('computeRiskSummary', () => {
  it('counts risk levels correctly', () => {
    const s = computeRiskSummary([
      mock({ risco: 'verde', ulsCode: 'A' }), mock({ risco: 'verde', ulsCode: 'B' }),
      mock({ risco: 'amarelo', ulsCode: 'C' }), mock({ risco: 'vermelho', ulsCode: 'D' }),
      mock({ risco: 'cinzento', ulsCode: 'E' }),
    ]);
    expect(s.verdes).toBe(2);
    expect(s.amarelos).toBe(1);
    expect(s.vermelhos).toBe(1);
    expect(s.cinzentos).toBe(1);
    expect(s.total).toBe(5);
  });

  it('computes ULS score (vermelho=3, amarelo=1)', () => {
    const s = computeRiskSummary([
      mock({ ulsCode: 'X', risco: 'vermelho', indicatorId: 'I1' }),
      mock({ ulsCode: 'X', risco: 'amarelo', indicatorId: 'I2' }),
      mock({ ulsCode: 'X', risco: 'verde', indicatorId: 'I3' }),
    ]);
    expect(s.porULS['X'].score).toBe(4);
  });

  it('topRiscos ordered by gap severity', () => {
    const s = computeRiskSummary([
      mock({ ulsCode: 'A', risco: 'vermelho', gapVsCP_pct: -5 }),
      mock({ ulsCode: 'B', risco: 'vermelho', gapVsCP_pct: -20 }),
      mock({ ulsCode: 'C', risco: 'vermelho', gapVsCP_pct: -10 }),
    ]);
    expect(s.topRiscos[0].ulsCode).toBe('B');
  });

  it('topRiscos max 10 entries', () => {
    const a = Array.from({ length: 20 }, (_, i) => mock({ ulsCode: `U${i}`, risco: 'vermelho', gapVsCP_pct: -i }));
    expect(computeRiskSummary(a).topRiscos).toHaveLength(10);
  });
});
