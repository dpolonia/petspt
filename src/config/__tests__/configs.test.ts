import { describe, it, expect } from 'vitest';
import { FORECAST_CATALOG, getForecastCatalogByEixo, getForecastIndicatorById } from '../forecastCatalog';
import { QGR_TARGETS } from '../qgrTargets';
import { SCENARIO_CATALOG, getScenarioById } from '../scenarioCatalog';
import { ULS_REGISTRY } from '../ulsRegistry';
import { ACSS_CONTRACT_URLS } from '../acssUrls';
import { INDICATORS } from '../indicators';

describe('FORECAST_CATALOG', () => {
  it('has >=8 indicators', () => expect(FORECAST_CATALOG.length).toBeGreaterThanOrEqual(8));
  it('unique IDs', () => {
    const ids = FORECAST_CATALOG.map(i => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('no CAMPO_ placeholders', () => {
    for (const i of FORECAST_CATALOG) {
      expect(i.campoValor).not.toMatch(/^CAMPO_/);
      expect(i.campoPeriodo).not.toMatch(/^CAMPO_/);
    }
  });
  it('getForecastCatalogByEixo filters correctly', () => {
    for (const i of getForecastCatalogByEixo(1)) expect(i.eixo).toBe(1);
  });
  it('getForecastIndicatorById works', () => {
    expect(getForecastIndicatorById(FORECAST_CATALOG[0].id)).toBe(FORECAST_CATALOG[0]);
  });
});

describe('QGR_TARGETS', () => {
  it('has both QGR versions', () => {
    for (const t of QGR_TARGETS) {
      expect(t.qgr_2024_2026).toBeDefined();
      expect(t.qgr_2025_2027).toBeDefined();
    }
  });
  it('cirurgias revised downward in QGR 2025-2027', () => {
    const c = QGR_TARGETS.find(t => t.id === 'QGR_CIRURGIAS');
    if (c?.qgr_2024_2026.ano2025 && c?.qgr_2025_2027.ano2025) {
      expect(c.qgr_2025_2027.ano2025).toBeLessThan(c.qgr_2024_2026.ano2025);
    }
  });
});

describe('SCENARIO_CATALOG', () => {
  it('has >=7 scenarios', () => expect(SCENARIO_CATALOG.length).toBeGreaterThanOrEqual(7));
  it('each has fundamentacao', () => {
    for (const s of SCENARIO_CATALOG) expect(s.fundamentacao?.length).toBeGreaterThan(20);
  });
  it('params have valid ranges', () => {
    for (const s of SCENARIO_CATALOG) for (const p of s.parametros) {
      expect(p.min).toBeLessThan(p.max);
      expect(p.step).toBeGreaterThan(0);
    }
  });
  it('getScenarioById works', () => {
    expect(getScenarioById(SCENARIO_CATALOG[0].id)).toBe(SCENARIO_CATALOG[0]);
  });
});

describe('ULS_REGISTRY', () => {
  it('has >=39 entries', () => expect(ULS_REGISTRY.length).toBeGreaterThanOrEqual(39));
  it('unique codes', () => {
    const codes = ULS_REGISTRY.map(u => u.code);
    expect(new Set(codes).size).toBe(codes.length);
  });
});

describe('ACSS_CONTRACT_URLS', () => {
  it('has >=30 validated URLs', () => {
    expect(ACSS_CONTRACT_URLS.filter(u => u.validado).length).toBeGreaterThanOrEqual(30);
  });
  it('URLs point to acss.min-saude.pt', () => {
    for (const u of ACSS_CONTRACT_URLS) {
      if (u.cp_2024_2026) expect(u.cp_2024_2026).toContain('acss.min-saude.pt');
    }
  });
});

describe('INDICATORS', () => {
  it('has 54 measures', () => expect(INDICATORS.length).toBe(54));
  it('covers all 5 eixos', () => {
    for (let e = 1; e <= 5; e++) expect(INDICATORS.some(i => i.eixo === e)).toBe(true);
  });
});
