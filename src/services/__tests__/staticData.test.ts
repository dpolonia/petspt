import { describe, it, expect } from 'vitest';
import { MEDIDAS_ESTADO, getMedidasByEixo, getScorecard, STATIC_DATA } from '../staticData';

describe('staticData', () => {
  it('has 54 medidas', () => expect(MEDIDAS_ESTADO.length).toBe(54));

  it('covers all 5 eixos', () => {
    for (let e = 1; e <= 5; e++) {
      expect(getMedidasByEixo(e).length).toBeGreaterThan(0);
    }
  });

  it('scorecard totals match', () => {
    const sc = getScorecard();
    expect(sc.concluidas + sc.em_curso + sc.parciais + sc.nao_implementadas).toBe(sc.total);
    expect(sc.total).toBe(54);
  });

  it('has KPI data for all 5 eixos', () => {
    expect(Object.keys(STATIC_DATA.kpis)).toHaveLength(5);
  });
});
