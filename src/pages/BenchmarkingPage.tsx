import { useState, useMemo } from 'react';
import { FORECAST_CATALOG, getForecastIndicatorById } from '../config/forecastCatalog';
import { getQGRTargetByForecastId } from '../config/qgrTargets';
import { useAllSNSData } from '../hooks/useAllSNSData';
import { forecastByULS, ULSForecastResult } from '../services/forecast/ulsForecast';
import { useContractData } from '../hooks/useContractData';
import ChartWrapper from '../components/charts/ChartWrapper';

// Indicators that have ULS decomposition
const ULS_INDICATORS = FORECAST_CATALOG.filter(i => i.campoInstituicao);

function HeatmapCell({ value, max }: { value: number | null; max: number }) {
  if (value === null) return <td className="px-1 py-1 text-center text-[9px] text-gray-300">&mdash;</td>;
  const ratio = max > 0 ? value / max : 0;
  const bg = ratio > 0.8 ? 'bg-green-100 text-green-800' : ratio > 0.5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
  return <td className={`px-1 py-1 text-center text-[9px] font-mono ${bg}`}>{Math.round(value).toLocaleString('pt-PT')}</td>;
}

export default function BenchmarkingPage() {
  const [selectedId, setSelectedId] = useState('');
  const indicator = getForecastIndicatorById(selectedId);
  const qgrTarget = selectedId ? getQGRTargetByForecastId(selectedId) : undefined;
  const { allData: contractsFromFirestore, source: contractSource } = useContractData(2024);

  // Fetch data
  const query = useMemo(() => {
    if (!indicator || !indicator.campoInstituicao) return null;
    return {
      dataset: indicator.dataset,
      where: indicator.filtroWhere,
      orderBy: indicator.campoPeriodo,
      limit: 100,
    };
  }, [indicator]);

  const { data: apiData, loading, error } = useAllSNSData(query, 3000);

  // Run forecasting per ULS
  const ulsResults: ULSForecastResult[] = useMemo(() => {
    if (!indicator || !indicator.campoInstituicao || apiData.length === 0) return [];
    return forecastByULS(
      apiData,
      indicator.campoValor,
      indicator.campoPeriodo,
      indicator.campoInstituicao,
      { horizon: 12 },
      indicator.id === 'FC_CIRURGIAS' ? 'cirurgias' : indicator.id === 'FC_URGENCIAS' ? 'urgencias' : undefined,
    );
  }, [apiData, indicator]);

  // Find max value for heatmap color scaling
  const maxForecast = useMemo(() => {
    if (ulsResults.length === 0) return 1;
    return Math.max(...ulsResults.flatMap(r => r.forecast.projecao.map(p => p.forecast)));
  }, [ulsResults]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <span className="text-emerald-600 font-bold text-sm">BM</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Benchmarking Territorial</h1>
            <p className="text-sm text-gray-500">Desempenho vs. Contrato Programa vs. QGR por ULS</p>
          </div>
        </div>
      </div>

      {/* Selector */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
        <label className="text-xs font-semibold text-gray-600 mb-1 block">Indicador (com decomposicao por ULS)</label>
        <select value={selectedId} onChange={e => setSelectedId(e.target.value)}
          className="w-full md:w-1/2 p-2.5 border border-gray-300 rounded-lg text-sm bg-white">
          <option value="">Seleccionar indicador...</option>
          {ULS_INDICATORS.map(ind => (
            <option key={ind.id} value={ind.id}>E{ind.eixo}: {ind.nome}</option>
          ))}
        </select>

        {qgrTarget && (
          <div className="mt-3 p-3 bg-emerald-50 rounded-lg text-xs text-emerald-700">
            <strong>Meta QGR:</strong> {qgrTarget.indicador}
            {qgrTarget.qgr_2025_2027.ano2025 != null && ` — 2025: ${qgrTarget.qgr_2025_2027.ano2025}`}
            {qgrTarget.qgr_2025_2027.ano2026 != null && ` | 2026: ${qgrTarget.qgr_2025_2027.ano2026}`}
            {qgrTarget.observacoes && <div className="mt-1 text-emerald-500">{qgrTarget.observacoes}</div>}
          </div>
        )}
      </div>

      {!selectedId && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Seleccione um indicador para analise territorial</p>
          <p className="text-sm mt-2">{ULS_INDICATORS.length} indicadores com decomposicao por ULS</p>
        </div>
      )}

      {selectedId && loading && (
        <div className="text-center py-16 animate-pulse text-gray-400">A calcular projecoes para {ulsResults.length || '~39'} ULS...</div>
      )}

      {selectedId && error && (
        <div className="text-center py-16 text-red-500 text-sm">{error}</div>
      )}

      {ulsResults.length > 0 && (
        <>
          {/* Heatmap: ULS x months */}
          <div className="mb-6">
            <ChartWrapper
              titulo="Heatmap — Projecao por ULS x Mes"
              subtitulo={`${ulsResults.length} ULS com dados suficientes. Cores: verde (alto) / amarelo (medio) / vermelho (baixo)`}
              fonte="Transparencia SNS + Holt-Winters"
              height={Math.max(400, ulsResults.length * 22)}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-2 py-1 text-left font-medium text-gray-500 sticky left-0 bg-gray-50 min-w-[140px]">ULS</th>
                      <th className="px-1 py-1 text-center font-medium text-gray-500">Actual</th>
                      {ulsResults[0]?.forecast.projecao.slice(0, 12).map((p, i) => (
                        <th key={i} className="px-1 py-1 text-center font-medium text-gray-400">{p.periodo.slice(5)}</th>
                      ))}
                      {ulsResults[0]?.contractTarget && (
                        <th className="px-1 py-1 text-center font-medium text-orange-500">Meta CP</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {ulsResults.map(r => {
                      const lastHist = r.forecast.historico[r.forecast.historico.length - 1];
                      return (
                        <tr key={r.uls.code} className="hover:bg-gray-50">
                          <td className="px-2 py-1 font-medium text-gray-700 sticky left-0 bg-white truncate max-w-[140px]" title={r.uls.nome}>
                            {r.uls.nome.replace('ULS ', '')}
                          </td>
                          <HeatmapCell value={lastHist?.valor ?? null} max={maxForecast} />
                          {r.forecast.projecao.slice(0, 12).map((p, i) => (
                            <HeatmapCell key={i} value={p.forecast} max={maxForecast} />
                          ))}
                          {r.contractTarget && (
                            <td className="px-1 py-1 text-center text-[9px] font-mono text-orange-600">
                              {r.contractTarget.valor.toLocaleString('pt-PT')}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </ChartWrapper>
          </div>

          {/* Benchmarking Table */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6 overflow-x-auto">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Tabela de Benchmarking</h3>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">ULS</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Regiao</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Ultimo Real</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Forecast 12m</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Meta CP</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Gap</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Pts dados</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ulsResults.map(r => {
                  const lastHist = r.forecast.historico[r.forecast.historico.length - 1];
                  const avgForecast = r.forecast.projecao.reduce((s, p) => s + p.forecast, 0) / r.forecast.projecao.length;
                  return (
                    <tr key={r.uls.code} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-xs font-medium text-gray-700">{r.uls.nome.replace('ULS ', '')}</td>
                      <td className="px-3 py-2 text-xs text-gray-500">{r.uls.regiao}</td>
                      <td className="px-3 py-2 text-xs text-right font-mono">{lastHist ? Math.round(lastHist.valor).toLocaleString('pt-PT') : '\u2014'}</td>
                      <td className="px-3 py-2 text-xs text-right font-mono">{Math.round(avgForecast).toLocaleString('pt-PT')}</td>
                      <td className="px-3 py-2 text-xs text-right font-mono text-orange-600">
                        {r.contractTarget ? r.contractTarget.valor.toLocaleString('pt-PT') : '\u2014'}
                      </td>
                      <td className={`px-3 py-2 text-xs text-right font-mono ${r.gap != null ? (r.gap >= 0 ? 'text-green-600' : 'text-red-600') : 'text-gray-400'}`}>
                        {r.gap != null ? `${r.gap >= 0 ? '+' : ''}${Math.round(r.gap).toLocaleString('pt-PT')}` : '\u2014'}
                      </td>
                      <td className="px-3 py-2 text-xs text-right text-gray-400">{r.dataPoints}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* QGR Context */}
          {qgrTarget && (
            <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-5 mb-6">
              <h3 className="text-sm font-semibold text-emerald-800 mb-2">Metas QGR — Referencia Nacional</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-emerald-600">QGR 2024-2026</div>
                  <div className="text-xs text-gray-500 mt-1">
                    2024: {qgrTarget.qgr_2024_2026.ano2024 ?? '\u2014'} |
                    2025: {qgrTarget.qgr_2024_2026.ano2025 ?? '\u2014'} |
                    2026: {qgrTarget.qgr_2024_2026.ano2026 ?? '\u2014'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-emerald-600">QGR 2025-2027 (revisto)</div>
                  <div className="text-xs text-gray-500 mt-1">
                    2025: {qgrTarget.qgr_2025_2027.ano2025 ?? '\u2014'} |
                    2026: {qgrTarget.qgr_2025_2027.ano2026 ?? '\u2014'} |
                    2027: {qgrTarget.qgr_2025_2027.ano2027 ?? '\u2014'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pipeline Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Estado da Pipeline de Contratos Programa</h4>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <span className="text-2xl font-bold text-green-600">{contractsFromFirestore.filter(c => c.fonte === 'pdf_extraido').length || 0}</span>
                <div className="text-xs text-gray-500 mt-1">PDF extraido</div>
              </div>
              <div>
                <span className="text-2xl font-bold text-yellow-600">{contractsFromFirestore.filter(c => c.fonte === 'projecao_oe').length || 0}</span>
                <div className="text-xs text-gray-500 mt-1">Projecao OE</div>
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-500">{contractsFromFirestore.filter(c => c.fonte === 'hardcoded').length || 0}</span>
                <div className="text-xs text-gray-500 mt-1">Hardcoded</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-400 text-center">
              Fonte: {contractSource === 'firestore' ? 'Firestore (PDFs extraidos)' : 'Dados hardcoded (fallback)'}
              &nbsp;&middot;&nbsp; 31 URLs validadas de 42 ULS/IPO
            </div>
          </div>

          {/* Methodology */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 text-xs text-gray-500">
            <h4 className="font-semibold text-gray-700 mb-2">Metodologia</h4>
            <p>
              Cada ULS e analisada individualmente com o modelo Holt-Winters aditivo (Sprint 6).
              As metas contratuais provem dos Contratos Programa publicados pela ACSS (31 PDFs validados).
              Para ULS sem CP disponivel, as metas sao projectadas como:
              meta(N) = meta(N-1) &times; (1 + &Delta;OE%), onde &Delta;OE% e a variacao do orcamento SNS.
            </p>
            <p className="mt-2">
              Quadro Global de Referencia: Despacho n.o 6770/2024 (QGR 2024-2026) e
              Despacho n.o 14012/2025 (QGR 2025-2027, revisto em baixa).
            </p>
          </div>
        </>
      )}
    </div>
  );
}
