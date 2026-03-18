import { useMemo } from 'react';
import {
  ResponsiveContainer, ComposedChart, Area, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import PeriodBackground from '../common/PeriodBackground';
import { ForecastResult } from '../../services/forecast/holtWinters';

interface ForecastChartProps {
  result: ForecastResult;
  titulo?: string;
  unidade?: string;
  benchmarkLabel?: string;
  height?: number;
}

export default function ForecastChart({ result, titulo, unidade = '', benchmarkLabel, height = 450 }: ForecastChartProps) {
  const chartData = useMemo(() => {
    const hist = result.historico.map(h => ({
      periodo: h.periodo,
      historico: h.valor,
      forecast: null as number | null,
      ci95_range: null as [number, number] | null,
      ci80_range: null as [number, number] | null,
    }));

    const proj = result.projecao.map(p => ({
      periodo: p.periodo,
      historico: null as number | null,
      forecast: p.forecast,
      ci95_range: [p.ci95_lower, p.ci95_upper] as [number, number],
      ci80_range: [p.ci80_lower, p.ci80_upper] as [number, number],
    }));

    // Link last historical point to first forecast
    if (hist.length > 0 && proj.length > 0) {
      proj[0].historico = hist[hist.length - 1].historico;
    }

    return [...hist, ...proj];
  }, [result]);

  const fmt = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
    return v.toLocaleString('pt-PT');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      {titulo && <h3 className="text-lg font-semibold text-gray-800 mb-1">{titulo}</h3>}
      <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-gray-500">
        <span>Holt-Winters Aditivo</span>
        <span>&middot; &alpha;={result.metricas.alpha.toFixed(2)} &beta;={result.metricas.beta.toFixed(2)} &gamma;={result.metricas.gamma.toFixed(2)}</span>
        <span>&middot; RMSE={fmt(result.metricas.rmse)}</span>
        {result.metricas.mape > 0 && <span>&middot; MAPE={result.metricas.mape.toFixed(1)}%</span>}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <PeriodBackground />
          <XAxis dataKey="periodo" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={fmt} />
          <Tooltip formatter={(value) => value != null ? fmt(Number(value)) : '\u2014'} labelFormatter={(l) => `Periodo: ${l}`} />
          <Legend />

          {/* CI 95% band */}
          <Area dataKey="ci95_range" name="CI 95%" stroke="none" fill="#3b82f6" fillOpacity={0.1} connectNulls={false} dot={false} />
          {/* CI 80% band */}
          <Area dataKey="ci80_range" name="CI 80%" stroke="none" fill="#3b82f6" fillOpacity={0.15} connectNulls={false} dot={false} />

          {/* Historical line */}
          <Line dataKey="historico" name="Observado" stroke="#1e40af" strokeWidth={2} dot={{ r: 1.5 }} connectNulls={false} />
          {/* Forecast line */}
          <Line dataKey="forecast" name="Projecao" stroke="#3b82f6" strokeWidth={2} strokeDasharray="8 4" dot={{ r: 3 }} connectNulls={false} />

          {result.benchmark != null && (
            <ReferenceLine y={result.benchmark} stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5"
              label={{ value: benchmarkLabel || `Capacidade: ${fmt(result.benchmark)}`, position: 'right', fontSize: 10, fill: '#ef4444' }} />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      <div className="mt-3 text-xs text-gray-400">
        Fonte: Transparencia SNS &middot; Projecao a {result.projecao.length} meses &middot; CI: intervalos de confianca a 80% e 95%
        {result.benchmark != null && ` · Benchmark: ${fmt(result.benchmark)} ${unidade}`}
      </div>
    </div>
  );
}
