import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRiskAnalysis } from '../hooks/useRiskAnalysis';
import { FORECAST_CATALOG } from '../config/forecastCatalog';
import { RiskLevel } from '../services/forecast/riskEngine';

const RISK_BG: Record<RiskLevel, string> = {
  verde: 'bg-green-500', amarelo: 'bg-yellow-500', vermelho: 'bg-red-500', cinzento: 'bg-gray-300',
};

export default function AlertasPage() {
  const [horizonte, setHorizonte] = useState<3 | 6 | 12>(12);
  const { summary, assessments, loading, progress, refresh, lastUpdated } = useRiskAnalysis(horizonte);

  const indicatorIds = [...new Set(assessments.map(a => a.indicatorId))];
  const ulsRanking = summary
    ? Object.entries(summary.porULS).sort(([, a], [, b]) => b.score - a.score)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <span className="text-red-600 font-bold text-lg">!</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard de Alertas</h1>
            <p className="text-sm text-gray-500">Avaliacao automatica de risco de incumprimento por ULS e indicador</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-600">Horizonte:</label>
          <select value={horizonte} onChange={e => setHorizonte(parseInt(e.target.value) as 3 | 6 | 12)}
            className="p-1.5 border border-gray-300 rounded text-sm">
            <option value={3}>3 meses</option>
            <option value={6}>6 meses</option>
            <option value={12}>12 meses</option>
          </select>
        </div>
        <button onClick={refresh} disabled={loading}
          className="px-4 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 disabled:opacity-50">
          {loading ? 'A analisar...' : 'Executar Analise de Risco'}
        </button>
        {lastUpdated && <span className="text-[10px] text-gray-400">Ultima: {new Date(lastUpdated).toLocaleString('pt-PT')}</span>}
      </div>

      {/* Progress bar */}
      {loading && (
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">A processar: {progress.current}</span>
            <span className="text-xs text-gray-400">{progress.completed}/{progress.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-red-500 h-2 rounded-full transition-all" style={{ width: `${progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}%` }} />
          </div>
        </div>
      )}

      {summary && (
        <>
          {/* Section 1: Global counters */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { n: summary.verdes, label: 'Dentro da meta', color: 'green' },
              { n: summary.amarelos, label: 'Atencao', color: 'yellow' },
              { n: summary.vermelhos, label: 'Em risco', color: 'red' },
              { n: summary.cinzentos, label: 'Sem dados', color: 'gray' },
            ].map(({ n, label, color }) => (
              <div key={color} className={`bg-${color}-50 rounded-lg border border-${color}-200 p-4 text-center`}>
                <div className={`text-3xl font-bold text-${color}-600`}>{n}</div>
                <div className={`text-xs text-${color}-700 mt-1`}>{label}</div>
              </div>
            ))}
          </div>

          {/* Proportion bar */}
          <div className="flex gap-0.5 h-4 rounded-full overflow-hidden mb-8">
            <div className="bg-green-500" style={{ width: `${(summary.verdes / summary.total) * 100}%` }} />
            <div className="bg-yellow-500" style={{ width: `${(summary.amarelos / summary.total) * 100}%` }} />
            <div className="bg-red-500" style={{ width: `${(summary.vermelhos / summary.total) * 100}%` }} />
            <div className="bg-gray-300" style={{ width: `${(summary.cinzentos / summary.total) * 100}%` }} />
          </div>

          {/* Section 2: Top 10 critical alerts */}
          {summary.topRiscos.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Alertas Criticos (Top {summary.topRiscos.length})</h2>
              <div className="space-y-2">
                {summary.topRiscos.map((a, idx) => (
                  <div key={`${a.ulsCode}_${a.indicatorId}`} className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-red-400 w-6">#{idx + 1}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{a.ulsNome}</div>
                        <div className="text-xs text-gray-500">{a.indicatorNome} (E{a.eixo})</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-bold text-red-600">
                          {a.gapVsCP_pct != null ? `${a.gapVsCP_pct > 0 ? '+' : ''}${a.gapVsCP_pct}%` : '\u2014'}
                        </div>
                        <div className="text-[10px] text-gray-400">{a.fundamentacao}</div>
                      </div>
                      <Link to={`/prospectiva?indicador=${a.indicatorId}`} className="text-[10px] text-violet-600 hover:underline">Projecao</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Risk matrix heatmap */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Matriz de Risco (ULS x Indicadores)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-2 py-1 text-left font-medium text-gray-500 sticky left-0 bg-gray-50 min-w-[130px]">ULS</th>
                    {indicatorIds.map(id => {
                      const ind = FORECAST_CATALOG.find(f => f.id === id);
                      return <th key={id} className="px-1 py-1 text-center font-medium text-gray-400 min-w-[60px]" title={ind?.nome}>{ind?.nome.substring(0, 12)}</th>;
                    })}
                    <th className="px-2 py-1 text-center font-medium text-gray-500">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {ulsRanking.map(([code, { uls, score, alertas }]) => (
                    <tr key={code} className="hover:bg-gray-50">
                      <td className="px-2 py-1 font-medium text-gray-700 sticky left-0 bg-white truncate max-w-[130px]" title={uls.nome}>
                        {uls.nome.replace('ULS ', '')}
                      </td>
                      {indicatorIds.map(indId => {
                        const a = alertas.find(al => al.indicatorId === indId);
                        return (
                          <td key={indId} className="px-1 py-1 text-center" title={a?.fundamentacao || 'N/A'}>
                            <div className={`w-4 h-4 rounded-sm mx-auto ${a ? RISK_BG[a.risco] : 'bg-gray-100'}`} />
                          </td>
                        );
                      })}
                      <td className="px-2 py-1 text-center font-mono text-xs text-gray-600">{score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: ULS ranking */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Ranking ULS por Risco</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">#</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">ULS</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Regiao</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">Score</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-red-500">Verm.</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-yellow-500">Amar.</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-green-500">Verde</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ulsRanking.slice(0, 20).map(([code, { uls, score, alertas }], idx) => (
                    <tr key={code} className={idx < 5 && score > 0 ? 'bg-red-50' : 'hover:bg-gray-50'}>
                      <td className="px-3 py-2 text-xs text-gray-400">{idx + 1}</td>
                      <td className="px-3 py-2 text-xs font-medium text-gray-700">{uls.nome.replace('ULS ', '')}</td>
                      <td className="px-3 py-2 text-xs text-gray-500">{uls.regiao}</td>
                      <td className="px-3 py-2 text-center font-mono font-bold text-gray-800">{score}</td>
                      <td className="px-3 py-2 text-center text-xs text-red-600">{alertas.filter(a => a.risco === 'vermelho').length}</td>
                      <td className="px-3 py-2 text-center text-xs text-yellow-600">{alertas.filter(a => a.risco === 'amarelo').length}</td>
                      <td className="px-3 py-2 text-center text-xs text-green-600">{alertas.filter(a => a.risco === 'verde').length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 5: Summary per indicator */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Resumo por Indicador</h2>
            <div className="space-y-2">
              {Object.entries(summary.porIndicador).map(([id, ind]) => {
                const total = ind.verdes + ind.amarelos + ind.vermelhos + ind.cinzentos;
                return (
                  <div key={id} className="bg-white rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">E{ind.eixo}: {ind.indicador}</span>
                      <span className="text-[10px] text-gray-400">{total} ULS</span>
                    </div>
                    <div className="flex gap-0.5 h-3 rounded-full overflow-hidden">
                      <div className="bg-green-500" style={{ width: `${(ind.verdes / total) * 100}%` }} />
                      <div className="bg-yellow-500" style={{ width: `${(ind.amarelos / total) * 100}%` }} />
                      <div className="bg-red-500" style={{ width: `${(ind.vermelhos / total) * 100}%` }} />
                      <div className="bg-gray-300" style={{ width: `${(ind.cinzentos / total) * 100}%` }} />
                    </div>
                    <div className="flex gap-3 mt-1 text-[10px] text-gray-400">
                      <span className="text-green-600">{ind.verdes} ok</span>
                      <span className="text-yellow-600">{ind.amarelos} atencao</span>
                      <span className="text-red-600">{ind.vermelhos} risco</span>
                      <span>{ind.cinzentos} s/dados</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Methodology */}
          <div className="text-[10px] text-gray-400 border-t border-gray-100 pt-3">
            Analise baseada em projecao Holt-Winters a {horizonte} meses por ULS e indicador.
            Semaforo: verde = forecast e CI 80% dentro da meta; amarelo = CI 80% cruza a meta;
            vermelho = forecast central fora da meta. Cinzento = dados insuficientes (&lt;6 meses).
            Metas: Contratos Programa ACSS e QGR (Despachos 6770/2024 e 14012/2025).
          </div>
        </>
      )}

      {!summary && !loading && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg mb-2">Clique &ldquo;Executar Analise de Risco&rdquo; para iniciar</p>
          <p className="text-sm">Processa {FORECAST_CATALOG.filter(i => i.campoInstituicao).length} indicadores x 42 ULS (~15 segundos)</p>
        </div>
      )}
    </div>
  );
}
