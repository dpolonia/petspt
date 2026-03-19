import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FORECAST_CATALOG, getForecastIndicatorById } from '../config/forecastCatalog';
import { useSNSData } from '../hooks/useSNSData';
import { toTimeSeries } from '../services/dataTransform';
import { holtWintersForecast, ForecastResult } from '../services/forecast/holtWinters';
import ForecastChart from '../components/charts/ForecastChart';

export default function ProspectivaPage() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('indicador') || '';

  const [selectedId, setSelectedId] = useState(initialId);
  const [horizon, setHorizon] = useState(12);
  const [customBenchmark, setCustomBenchmark] = useState('');

  const indicator = getForecastIndicatorById(selectedId);

  // Fetch data
  const query = useMemo(() => {
    if (!indicator) return null;
    const where = indicator.filtroWhere || undefined;
    return {
      dataset: indicator.dataset,
      where,
      orderBy: indicator.campoPeriodo,
      limit: 100,
    };
  }, [indicator]);

  const { data: apiData, loading, error } = useSNSData(query);

  // Transform to time series
  const timeSeries = useMemo(() => {
    if (!indicator || apiData.length === 0) return [];
    return toTimeSeries(apiData, indicator.campoValor, indicator.campoPeriodo);
  }, [apiData, indicator]);

  // Run forecast
  const forecastResult: ForecastResult | null = useMemo(() => {
    if (timeSeries.length < 4) return null;
    const points = timeSeries.map(p => ({ periodo: p.periodo, valor: p.valor as number }));
    const bench = customBenchmark ? parseFloat(customBenchmark) : indicator?.benchmark;
    return holtWintersForecast(points, { horizon, benchmark: bench });
  }, [timeSeries, horizon, customBenchmark, indicator]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 font-bold text-sm">HW</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Analise Prospectiva</h1>
            <p className="text-sm text-gray-500">Projecao a 12 meses com intervalos de confianca (Holt-Winters)</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Indicador</label>
            <select value={selectedId} onChange={e => setSelectedId(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white">
              <option value="">Seleccionar indicador...</option>
              {FORECAST_CATALOG.map(ind => (
                <option key={ind.id} value={ind.id}>E{ind.eixo}: {ind.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Horizonte (meses)</label>
            <select value={horizon} onChange={e => setHorizon(Number(e.target.value))}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white">
              <option value={6}>6 meses</option>
              <option value={12}>12 meses</option>
              <option value={18}>18 meses</option>
              <option value={24}>24 meses</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">
              Benchmark {indicator?.benchmarkLabel ? `(default: ${indicator.benchmark?.toLocaleString('pt-PT')})` : '(opcional)'}
            </label>
            <input
              type="number" value={customBenchmark}
              onChange={e => setCustomBenchmark(e.target.value)}
              placeholder={indicator?.benchmark?.toString() || 'Ex: 600000'}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
        {indicator?.descricao && (
          <p className="text-xs text-gray-500 mt-3">{indicator.descricao}</p>
        )}
      </div>

      {/* States */}
      {!selectedId && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Seleccione um indicador para gerar a projecao</p>
          <p className="text-sm mt-2">{FORECAST_CATALOG.length} indicadores disponiveis com dados da API Transparencia SNS</p>
        </div>
      )}

      {selectedId && loading && (
        <div className="text-center py-16">
          <div className="animate-pulse text-gray-400">A carregar dados historicos...</div>
        </div>
      )}

      {selectedId && error && (
        <div className="text-center py-16 text-red-500 text-sm">{error}</div>
      )}

      {selectedId && !loading && timeSeries.length > 0 && timeSeries.length < 4 && (
        <div className="text-center py-16 text-gray-400">
          <p>Dados insuficientes para projecao ({timeSeries.length} pontos).</p>
          <p className="text-sm mt-1">Sao necessarios pelo menos 4 observacoes mensais.</p>
        </div>
      )}

      {/* Forecast Chart */}
      {forecastResult && (
        <>
          <div className="mb-6">
            <ForecastChart
              result={forecastResult}
              titulo={indicator?.nome}
              unidade={indicator?.unidade}
              benchmarkLabel={indicator?.benchmarkLabel}
              height={450}
            />
          </div>

          {/* Projection Table */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6 overflow-x-auto">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Tabela de Projecoes</h3>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Periodo</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Projecao</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">CI 80%</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">CI 95%</th>
                  {forecastResult.benchmark != null && (
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Excedente</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {forecastResult.projecao.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-xs text-gray-700">{p.periodo}</td>
                    <td className="px-3 py-2 text-xs text-right font-mono">{Math.round(p.forecast).toLocaleString('pt-PT')}</td>
                    <td className="px-3 py-2 text-xs text-right text-gray-500">
                      {Math.round(p.ci80_lower).toLocaleString('pt-PT')} &ndash; {Math.round(p.ci80_upper).toLocaleString('pt-PT')}
                    </td>
                    <td className="px-3 py-2 text-xs text-right text-gray-400">
                      {Math.round(p.ci95_lower).toLocaleString('pt-PT')} &ndash; {Math.round(p.ci95_upper).toLocaleString('pt-PT')}
                    </td>
                    {forecastResult.unmetDemand && (
                      <td className={`px-3 py-2 text-xs text-right font-mono ${forecastResult.unmetDemand[i].excedente > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {Math.round(forecastResult.unmetDemand[i].excedente).toLocaleString('pt-PT')}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Data info */}
          <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-500 mb-6">
            <strong>Dados:</strong> {timeSeries.length} observacoes mensais ({timeSeries[0]?.periodo} a {timeSeries[timeSeries.length - 1]?.periodo}).
            {timeSeries.length < 24 && ' Serie curta (<24 meses) — usado fallback de tendencia linear em vez de Holt-Winters sazonal.'}
            {indicator?.referencia && <div className="mt-1"><strong>Ref:</strong> {indicator.referencia}</div>}
          </div>
        </>
      )}

      {/* Methodology note */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 text-xs text-gray-500">
        <h4 className="font-semibold text-gray-700 mb-2">Metodologia</h4>
        <p>
          Modelo Holt-Winters aditivo com optimizacao automatica de parametros (&alpha;, &beta;, &gamma;)
          via grid search (minimizacao do MSE). Intervalos de previsao a 80% e 95% calculados via
          variancia dos residuos (Hyndman et al., 2008). Para series com menos de 24 observacoes,
          e utilizado um fallback de tendencia linear simples.
        </p>
        <p className="mt-2">
          Metodologia inspirada em: Goiana-da-Silva et al. (2025), &ldquo;The growing pains of the 2024/2025 Portugal&rsquo;s
          NHS telephone triage system national rollout&rdquo;, <em>Frontiers in Public Health</em>, 13:1694713.
        </p>
      </div>
    </div>
  );
}
