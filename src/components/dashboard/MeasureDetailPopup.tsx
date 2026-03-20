import { useState } from 'react';
import { MeasureTrendResult } from '../../services/measureTrend';
import { getGroundTruth } from '../../config/kpiGroundTruth';
import { validateAgainstGroundTruth, summarizeValidation } from '../../services/dataQuality';
import { ResponsiveContainer, ComposedChart, Line, Area, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceArea } from 'recharts';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  medidaId: string;
  nome: string;
  descricao?: string;
  prioridade: string;
  trend: MeasureTrendResult;
  fonte: string;
}

export default function MeasureDetailPopup({ isOpen, onClose, medidaId, nome, descricao, trend, fonte }: Props) {
  const [aiText, setAiText] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  if (!isOpen) return null;
  const fmt = (v: number) => v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}K` : v.toLocaleString('pt-PT');

  // Compute statistics from time series
  const ts = trend.timeSeries;
  const values = ts.map(d => d.valor);
  const n = values.length;
  const mean = n > 0 ? values.reduce((s, v) => s + v, 0) / n : 0;
  const sorted = [...values].sort((a, b) => a - b);
  const median = n > 0 ? (n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)]) : 0;
  const stddev = n > 0 ? Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2, 0) / n) : 0;
  const cv = mean > 0 ? (stddev / mean) * 100 : 0;
  const minVal = n > 0 ? Math.min(...values) : 0;
  const maxVal = n > 0 ? Math.max(...values) : 0;
  const minPeriodo = ts.find(d => d.valor === minVal)?.periodo || '';
  const maxPeriodo = ts.find(d => d.valor === maxVal)?.periodo || '';

  // Ground truth validation
  const gt = getGroundTruth(medidaId);
  const validationResults = gt && ts.length > 0 ? validateAgainstGroundTruth(medidaId, ts, gt) : [];
  const validation = gt ? summarizeValidation(validationResults.length > 0 ? validationResults : gt.dataPoints.map(d => ({ medidaId, periodo: d.periodo, groundTruth: d.valor, firestoreValue: null, match: 'missing' as const, deviation_pct: null })), ts.length > 0) : null;

  // Chart data with stddev band + ground truth dots
  const chartData = ts.map(d => {
    const gtPoint = gt?.dataPoints.find(g => g.periodo === d.periodo);
    return {
      periodo: d.periodo,
      valor: d.valor,
      stdUpper: mean + stddev,
      stdLower: Math.max(0, mean - stddev),
      groundTruth: gtPoint ? gtPoint.valor : null,
    };
  });
  // Add GT points that don't exist in Firestore series
  if (gt) {
    for (const g of gt.dataPoints) {
      if (!chartData.find(d => d.periodo === g.periodo)) {
        chartData.push({ periodo: g.periodo, valor: 0, stdUpper: mean + stddev, stdLower: Math.max(0, mean - stddev), groundTruth: g.valor });
      }
    }
    chartData.sort((a, b) => a.periodo.localeCompare(b.periodo));
  }

  // Period band boundaries
  const firstP = chartData.length > 0 ? chartData[0].periodo : '2024-01';
  const lastP = chartData.length > 0 ? chartData[chartData.length - 1].periodo : '2025-12';

  const BADGE_STYLES: Record<string, { bg: string; text: string; icon: string }> = {
    validado: { bg: 'bg-green-100', text: 'text-green-700', icon: '\u2713' },
    aproximado: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '\u2248' },
    divergente: { bg: 'bg-red-100', text: 'text-red-700', icon: '\u2717' },
    relatorio_gt: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '\ud83d\udccb' },
    nao_validado: { bg: 'bg-gray-100', text: 'text-gray-500', icon: '?' },
  };

  // Stats context for AI
  const statsCtx = `Media: ${fmt(mean)}, Mediana: ${fmt(median)}, DP: ${fmt(stddev)}, CV: ${cv.toFixed(1)}%, Min: ${fmt(minVal)} (${minPeriodo}), Max: ${fmt(maxVal)} (${maxPeriodo}), Amplitude: ${fmt(maxVal - minVal)}, Slope: ${trend.tendenciaSlope?.toFixed(1) || 'N/A'}/mes, N: ${n} meses`;

  const handleAI = async () => {
    setAiLoading(true);
    try {
      const ctx = [
        `Medida PETS: ${medidaId} — ${nome}`,
        `Estado: ${trend.cor} | Semaforo: ${trend.label}`,
        `Baseline (Jan 2024): ${trend.baselineValue != null ? fmt(trend.baselineValue) : 'N/A'}`,
        `Referencia (Jun 2024): ${trend.referenceValue != null ? fmt(trend.referenceValue) : 'N/A'}`,
        `Valor actual (${trend.currentPeriodo}): ${trend.currentValue != null ? fmt(trend.currentValue) : 'N/A'}`,
        `Estatisticas: ${statsCtx}`,
        `Meses desfavoraveis: ${trend.mesesDesfavoraveis}/12`,
        `Fonte: ${fonte}`,
        descricao || '',
        '',
        'Gera uma analise em DUAS seccoes:',
        '1. ANALISE TECNICA: interpreta os dados estatisticos, tendencia, sazonalidade, desvios.',
        '2. ANALISE DE POLITICA: recomendacoes para decisores, comparacao com metas PETS/QGR, contexto SNS.',
        'Responde em portugues europeu, 4-6 frases por seccao. Formato: TECNICA: ... POLITICA: ...',
      ].join('\n');
      const url = `https://europe-west1-petspt-f019f.cloudfunctions.net/aiSummary?eixo=1&context=${encodeURIComponent(ctx)}&nocache=1&t=${Date.now()}`;
      const r = await fetch(url);
      const d = await r.json();
      const text = d.sumario || d.text || JSON.stringify(d);
      // Try to split into two sections
      const techMatch = text.match(/TECNICA:?\s*([\s\S]*?)(?:POLITICA:|$)/i);
      const polMatch = text.match(/POLITICA:?\s*([\s\S]*)/i);
      if (techMatch && polMatch) {
        setAiText(`__TECH__${techMatch[1].trim()}__POL__${polMatch[1].trim()}`);
      } else {
        setAiText(text);
      }
    } catch { setAiText('Erro ao gerar analise AI.'); }
    finally { setAiLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-400 mb-1">{medidaId}</div>
              <h2 className="text-lg font-bold text-gray-900">{nome}</h2>
              {descricao && <p className="text-sm text-gray-500 mt-1">{descricao}</p>}
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
          </div>
        </div>

        {/* Key metrics */}
        <div className="p-5 grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xs text-gray-500">Baseline (2024-01)</div>
            <div className="text-lg font-bold text-gray-700">{trend.baselineValue != null ? fmt(trend.baselineValue) : '\u2014'}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Ref. (2024-06)</div>
            <div className="text-lg font-bold text-gray-700">{trend.referenceValue != null ? fmt(trend.referenceValue) : '\u2014'}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Actual ({trend.currentPeriodo})</div>
            <div className="text-lg font-bold text-gray-900">{trend.currentValue != null ? fmt(trend.currentValue) : '\u2014'}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Tendencia (6m)</div>
            <div className={`text-lg font-bold ${trend.tendenciaConvergente ? 'text-green-600' : 'text-red-600'}`}>
              {trend.tendenciaSlope != null ? `${trend.tendenciaSlope > 0 ? '+' : ''}${trend.tendenciaSlope.toFixed(1)}/m` : '\u2014'}
            </div>
          </div>
        </div>

        {/* Chart with stddev band and reference lines */}
        {ts.length >= 2 && (
          <div className="px-5 pb-3">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <ReferenceArea x1={firstP} x2="2024-06" fill="#FFE0E6" fillOpacity={0.3} />
                <ReferenceArea x1="2024-07" x2="2025-06" fill="#FFE0B2" fillOpacity={0.3} />
                <ReferenceArea x1="2025-07" x2={lastP} fill="#FF9800" fillOpacity={0.15} />
                <XAxis dataKey="periodo" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={fmt} />
                <Tooltip formatter={(v) => fmt(Number(v))} />
                {/* Stddev band */}
                <Area dataKey="stdUpper" stroke="none" fill="#93c5fd" fillOpacity={0.15} name="Media +/- DP" connectNulls />
                <Area dataKey="stdLower" stroke="none" fill="#ffffff" fillOpacity={1} connectNulls legendType="none" />
                {/* Mean line (grey dotted) */}
                <ReferenceLine y={mean} stroke="#9ca3af" strokeDasharray="2 2" strokeWidth={1} />
                {/* Reference value (red dashed) */}
                {trend.referenceValue != null && (
                  <ReferenceLine y={trend.referenceValue} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1.5}
                    label={{ value: `Ref: ${fmt(trend.referenceValue)}`, position: 'right', fontSize: 8, fill: '#ef4444' }} />
                )}
                {/* Data line */}
                <Line dataKey="valor" name="Valor mensal" stroke="#2563eb" strokeWidth={2} dot={{ r: 2.5, fill: '#2563eb' }} connectNulls />
                {gt && <Scatter dataKey="groundTruth" name="GT PETS (relatorio)" fill="#ef4444" shape="diamond" />}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Statistics panel */}
        {n >= 2 && (
          <div className="px-5 pb-4">
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-[11px] text-gray-600 bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between"><span>Media global:</span> <span className="font-mono font-medium">{fmt(mean)}</span></div>
              <div className="flex justify-between"><span>Minimo:</span> <span className="font-mono font-medium">{fmt(minVal)} ({minPeriodo})</span></div>
              <div className="flex justify-between"><span>Mediana global:</span> <span className="font-mono font-medium">{fmt(median)}</span></div>
              <div className="flex justify-between"><span>Maximo:</span> <span className="font-mono font-medium">{fmt(maxVal)} ({maxPeriodo})</span></div>
              <div className="flex justify-between"><span>Desvio padrao:</span> <span className="font-mono font-medium">{fmt(stddev)}</span></div>
              <div className="flex justify-between"><span>Amplitude:</span> <span className="font-mono font-medium">{fmt(maxVal - minVal)}</span></div>
              <div className="flex justify-between"><span>Coef. variacao:</span> <span className="font-mono font-medium">{cv.toFixed(1)}%</span></div>
              <div className="flex justify-between"><span>Tendencia (slope):</span> <span className="font-mono font-medium">{trend.tendenciaSlope != null ? `${trend.tendenciaSlope > 0 ? '+' : ''}${trend.tendenciaSlope.toFixed(1)}/mes` : 'N/A'}</span></div>
            </div>
          </div>
        )}

        {/* Variable metadata */}
        <div className="px-5 pb-3 text-[10px] text-gray-400">
          Periodo: {firstP} a {lastP} ({n} meses) &middot; {fonte} &middot; {trend.dataSource === 'api_dinamica' ? 'API dinamica' : 'Dados fixos'}
        </div>

        {/* AI Button */}
        <div className="px-5 py-3 border-t border-gray-100">
          {!aiText ? (
            <button onClick={handleAI} disabled={aiLoading}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-xs font-medium rounded-lg hover:bg-violet-700 disabled:opacity-50 transition-colors">
              {aiLoading ? 'A analisar...' : '\u2726 Interpretar com AI'}
            </button>
          ) : (
            <div className="space-y-3">
              {aiText.includes('__TECH__') ? (
                <>
                  <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
                    <div className="text-blue-700 font-semibold text-xs mb-2">Analise Tecnica</div>
                    <p>{aiText.split('__TECH__')[1]?.split('__POL__')[0]?.trim()}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
                    <div className="text-green-700 font-semibold text-xs mb-2">Analise de Politica</div>
                    <p>{aiText.split('__POL__')[1]?.trim()}</p>
                  </div>
                </>
              ) : (
                <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
                  <div className="text-blue-700 font-semibold text-xs mb-2">Analise AI</div>
                  <p>{aiText}</p>
                </div>
              )}
              <div className="flex items-center gap-3">
                <button onClick={() => { setAiText(null); handleAI(); }} className="text-[10px] text-violet-500 hover:underline">Regenerar</button>
                <span className="text-[9px] text-gray-400">Gerado por Claude Sonnet 4 | {new Date().toLocaleString('pt-PT')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer with validation badge */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
            <div><span className="font-semibold">Semaforo:</span> {trend.label}</div>
            <div><span className="font-semibold">Meses desfavoraveis:</span> {trend.mesesDesfavoraveis}/12</div>
          </div>
          {validation && (
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${BADGE_STYLES[validation.badge].bg} ${BADGE_STYLES[validation.badge].text}`}>
                {BADGE_STYLES[validation.badge].icon} {validation.badgeLabel}
              </span>
              {validation.totalPoints > 0 && (
                <span className="text-[9px] text-gray-400">
                  ({validation.exact} exacto, {validation.close} proximo, {validation.mismatch} divergente, {validation.missing} sem dados)
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
