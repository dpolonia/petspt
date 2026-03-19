import { useMemo } from 'react';
import {
  ResponsiveContainer, ComposedChart, Area, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import PeriodBackground from '../common/PeriodBackground';
import { ForecastResult } from '../../services/forecast/holtWinters';

interface Props {
  bau: ForecastResult;
  cenario: ForecastResult;
  titulo?: string;
  unidade?: string;
  height?: number;
}

export default function ScenarioComparisonChart({ bau, cenario, titulo, height = 450 }: Props) {
  const chartData = useMemo(() => {
    const hist = bau.historico.map(h => ({
      periodo: h.periodo,
      historico: h.valor,
      bau_forecast: null as number | null,
      cenario_forecast: null as number | null,
      bau_ci95: null as [number, number] | null,
      cenario_ci95: null as [number, number] | null,
    }));

    const proj = bau.projecao.map((p, i) => ({
      periodo: p.periodo,
      historico: null as number | null,
      bau_forecast: p.forecast,
      cenario_forecast: cenario.projecao[i]?.forecast ?? null,
      bau_ci95: [p.ci95_lower, p.ci95_upper] as [number, number],
      cenario_ci95: cenario.projecao[i] ? [cenario.projecao[i].ci95_lower, cenario.projecao[i].ci95_upper] as [number, number] : null,
    }));

    if (hist.length > 0 && proj.length > 0) {
      proj[0].historico = hist[hist.length - 1].historico;
    }

    return [...hist, ...proj];
  }, [bau, cenario]);

  const fmt = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
    return v.toLocaleString('pt-PT');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      {titulo && <h3 className="text-lg font-semibold text-gray-800 mb-4">{titulo}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <PeriodBackground />
          <XAxis dataKey="periodo" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={fmt} />
          <Tooltip formatter={(v) => v != null ? fmt(Number(v)) : '\u2014'} />
          <Legend />

          <Area dataKey="bau_ci95" stroke="none" fill="#9ca3af" fillOpacity={0.1} name="BAU CI 95%" connectNulls={false} dot={false} />
          <Line dataKey="bau_forecast" name="BAU (sem alteracao)" stroke="#6b7280" strokeWidth={2} strokeDasharray="8 4" dot={false} connectNulls={false} />

          <Area dataKey="cenario_ci95" stroke="none" fill="#6366f1" fillOpacity={0.15} name="Cenario CI 95%" connectNulls={false} dot={false} />
          <Line dataKey="cenario_forecast" name="Cenario" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 3 }} connectNulls={false} />

          <Line dataKey="historico" name="Observado" stroke="#1e293b" strokeWidth={2} dot={{ r: 2 }} connectNulls={false} />

          {bau.benchmark != null && (
            <ReferenceLine y={bau.benchmark} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="5 5"
              label={{ value: 'Capacidade', position: 'right', fontSize: 10 }} />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      <div className="mt-2 text-xs text-gray-400">
        Cinzento: BAU (business-as-usual) &middot; Indigo: cenario alternativo &middot; Area: IC 95%
      </div>
    </div>
  );
}
