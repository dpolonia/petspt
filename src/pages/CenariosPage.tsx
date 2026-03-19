import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SCENARIO_CATALOG } from '../config/scenarioCatalog';
import { getForecastIndicatorById } from '../config/forecastCatalog';
import { holtWintersForecast } from '../services/forecast/holtWinters';
import { applyScenario, computeImpact, ScenarioImpact } from '../services/forecast/scenarioEngine';
import { useSNSData } from '../hooks/useSNSData';
import { toTimeSeries } from '../services/dataTransform';
import ScenarioSlider from '../components/charts/ScenarioSlider';
import ScenarioComparisonChart from '../components/charts/ScenarioComparisonChart';
import { ForecastResult } from '../services/forecast/holtWinters';

function getDefaults(scenarioId: string): Record<string, number> {
  const s = SCENARIO_CATALOG.find(sc => sc.id === scenarioId);
  if (!s) return {};
  const defaults: Record<string, number> = {};
  for (const p of s.parametros) defaults[p.id] = p.defaultValue;
  return defaults;
}

export default function CenariosPage() {
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get('cenario') || '';

  const [selectedId, setSelectedId] = useState(preselected);
  const [paramValues, setParamValues] = useState<Record<string, number>>(() => getDefaults(preselected));
  const [horizon, setHorizon] = useState(12);

  const scenario = SCENARIO_CATALOG.find(s => s.id === selectedId);

  const handleScenarioChange = (id: string) => {
    setSelectedId(id);
    setParamValues(getDefaults(id));
  };

  const indicatorId = scenario?.parametros[0]?.affectsIndicators[0];
  const indicator = indicatorId ? getForecastIndicatorById(indicatorId) : null;

  const apiQuery = useMemo(() => {
    if (!indicator) return null;
    return {
      dataset: indicator.dataset,
      where: indicator.filtroWhere,
      orderBy: indicator.campoPeriodo,
      limit: 100,
    };
  }, [indicator]);

  const { data: apiData, loading, error } = useSNSData(apiQuery);

  const results = useMemo<{ bau: ForecastResult; cenarioResult: ForecastResult; impacto: ScenarioImpact } | null>(() => {
    if (!apiData.length || !indicator || !scenario) return null;

    const timeSeries = toTimeSeries(apiData, indicator.campoValor, indicator.campoPeriodo);
    if (timeSeries.length < 4) return null;

    const points = timeSeries.map(p => ({ periodo: p.periodo, valor: p.valor as number }));
    const bau = holtWintersForecast(points, { horizon, benchmark: indicator.benchmark });

    const transforms = scenario.parametros.map(p => ({
      type: p.type,
      value: paramValues[p.id] ?? p.defaultValue,
      targetHorizon: horizon,
    }));

    const cenarioResult = applyScenario(bau, transforms);
    const impacto = computeImpact(bau, cenarioResult);

    return { bau, cenarioResult, impacto };
  }, [apiData, indicator, scenario, paramValues, horizon]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 font-bold text-lg">?</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Simulador de Cenarios What-If</h1>
            <p className="text-sm text-gray-500">Ajuste pressupostos e veja o impacto nas projecoes em tempo real</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Control panel */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Cenario</label>
            <select value={selectedId}
              onChange={e => handleScenarioChange(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white">
              <option value="">Seleccionar cenario...</option>
              {SCENARIO_CATALOG.map(s => (
                <option key={s.id} value={s.id}>[{s.categoria}] {s.nome}</option>
              ))}
            </select>
          </div>

          {scenario && (
            <>
              <div className="bg-indigo-50 rounded-lg p-3 text-xs text-indigo-800">{scenario.descricao}</div>

              {scenario.parametros.map(p => (
                <ScenarioSlider key={p.id} parametro={p}
                  value={paramValues[p.id] ?? p.defaultValue}
                  onChange={v => setParamValues(prev => ({ ...prev, [p.id]: v }))} />
              ))}

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Horizonte</label>
                <select value={horizon} onChange={e => setHorizon(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                  <option value={6}>6 meses</option>
                  <option value={12}>12 meses</option>
                  <option value={18}>18 meses</option>
                  <option value={24}>24 meses</option>
                </select>
              </div>

              {scenario.fundamentacao && (
                <div className="border-t border-gray-200 pt-3 text-[10px] text-gray-400 italic">{scenario.fundamentacao}</div>
              )}
            </>
          )}
        </div>

        {/* Chart + impact */}
        <div className="lg:col-span-2 space-y-4">
          {!scenario && (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">Seleccione um cenario para iniciar a simulacao</p>
              <p className="text-sm mt-2">{SCENARIO_CATALOG.length} cenarios pre-definidos disponiveis</p>
            </div>
          )}

          {loading && <div className="text-center py-20 text-gray-400 animate-pulse">A carregar dados...</div>}
          {error && <div className="text-center py-20 text-red-500 text-sm">{error}</div>}

          {scenario && results && (
            <>
              <ScenarioComparisonChart bau={results.bau} cenario={results.cenarioResult}
                titulo={`${scenario.nome} — ${indicator?.nome || ''}`} unidade={indicator?.unidade} />

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <div className={`text-xl font-bold ${results.impacto.delta_total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {results.impacto.delta_total >= 0 ? '+' : ''}{results.impacto.delta_total.toLocaleString('pt-PT')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">&Delta; total ({horizon}m)</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <div className={`text-xl font-bold ${results.impacto.delta_pct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {results.impacto.delta_pct >= 0 ? '+' : ''}{results.impacto.delta_pct}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">&Delta; medio mensal</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                  <div className="text-xl font-bold text-indigo-600">
                    {results.impacto.delta_medio_mensal.toLocaleString('pt-PT')}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">&Delta; mensal ({indicator?.unidade})</div>
                </div>
              </div>

              <div className="text-[10px] text-gray-400 border-t border-gray-100 pt-2">
                Simulacao baseada no motor Holt-Winters com transformacao {scenario.parametros[0]?.type}.
                Os intervalos de confianca do cenario sao derivados dos CIs do BAU.
                Esta simulacao e indicativa e nao substitui analise economica detalhada.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
