import { useState, useCallback } from 'react';
import { FORECAST_CATALOG } from '../config/forecastCatalog';
import { fetchSNSData } from '../services/snsApi';
import { assessRiskForIndicator, computeRiskSummary, RiskAssessment, RiskSummary } from '../services/forecast/riskEngine';

const CACHE_KEY = 'petspt_risk_analysis';

export function useRiskAnalysis(horizonte: number = 12) {
  const [assessments, setAssessments] = useState<RiskAssessment[]>(() => {
    try { const c = sessionStorage.getItem(CACHE_KEY); return c ? JSON.parse(c).assessments || [] : []; } catch { return []; }
  });
  const [summary, setSummary] = useState<RiskSummary | null>(() => {
    try { const c = sessionStorage.getItem(CACHE_KEY); return c ? JSON.parse(c).summary || null : null; } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0, current: '' });
  const [lastUpdated] = useState<string | null>(() => {
    try { const c = sessionStorage.getItem(CACHE_KEY); return c ? JSON.parse(c).calculadoEm || null : null; } catch { return null; }
  });

  const refresh = useCallback(async () => {
    setLoading(true);
    const allAssessments: RiskAssessment[] = [];
    const eligible = FORECAST_CATALOG.filter(i => i.campoInstituicao);
    setProgress({ completed: 0, total: eligible.length, current: '' });

    for (let idx = 0; idx < eligible.length; idx++) {
      const indicator = eligible[idx];
      setProgress({ completed: idx, total: eligible.length, current: indicator.nome });

      try {
        const response = await fetchSNSData({
          dataset: indicator.dataset,
          where: indicator.filtroWhere,
          limit: 500,
        });

        const contractMetas = new Map<string, number>();
        const results = assessRiskForIndicator(response.results, indicator, contractMetas, horizonte);
        allAssessments.push(...results);
        setAssessments([...allAssessments]);
      } catch (err) {
        console.error(`[RiskAnalysis] ${indicator.id}:`, err);
      }

      // Throttle: 200ms between API calls
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setProgress({ completed: eligible.length, total: eligible.length, current: 'Concluido' });
    const riskSummary = computeRiskSummary(allAssessments);
    setSummary(riskSummary);
    setAssessments(allAssessments);

    sessionStorage.setItem(CACHE_KEY, JSON.stringify({
      assessments: allAssessments, summary: riskSummary, calculadoEm: riskSummary.calculadoEm,
    }));

    setLoading(false);
  }, [horizonte]);

  return { summary, assessments, loading, progress, refresh, lastUpdated };
}
