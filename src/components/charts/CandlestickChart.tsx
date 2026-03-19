import {
  ResponsiveContainer, ComposedChart, Line, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceArea, ReferenceLine,
} from 'recharts';
import { MonthlyStats } from '../../services/monthlyStats';

interface Props {
  data: MonthlyStats[];
  referenceValue?: number;
  referenceLabel?: string;
  height?: number;
}

export default function CandlestickChart({ data, referenceValue, referenceLabel, height = 300 }: Props) {
  const chartData = data.map(d => ({
    periodo: d.periodo,
    mean: d.mean,
    median: d.median,
    min: d.min,
    max: d.max,
    stdUpper: d.mean + d.stddev,
    stdLower: Math.max(0, d.mean - d.stddev),
    stddev: d.stddev,
    count: d.count,
  }));

  const fmt = (v: number) => v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}K` : v.toLocaleString('pt-PT');

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <ReferenceArea x1="2024-01" x2="2024-06" fill="#FFE0E6" fillOpacity={0.3} />
        <ReferenceArea x1="2024-07" x2="2025-06" fill="#FFE0B2" fillOpacity={0.3} />
        <ReferenceArea x1="2025-07" x2="2099-12" fill="#FF9800" fillOpacity={0.15} />
        <XAxis dataKey="periodo" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 10 }} tickFormatter={fmt} />
        <Tooltip content={({ active, payload, label }) => {
          if (!active || !payload?.length) return null;
          const d = payload[0]?.payload;
          if (!d) return null;
          return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
              <div className="font-semibold text-gray-800 mb-1">{label}</div>
              <div className="space-y-0.5 text-gray-600">
                <div>Media: <span className="font-medium text-blue-600">{fmt(d.mean)}</span></div>
                <div>Mediana: <span className="font-medium">{fmt(d.median)}</span></div>
                <div>Min-Max: {fmt(d.min)} &mdash; {fmt(d.max)}</div>
                <div>Desvio padrao: &plusmn;{fmt(d.stddev)}</div>
                <div className="text-gray-400">{d.count} ULS com dados</div>
              </div>
            </div>
          );
        }} />
        <Area dataKey="stdUpper" stroke="none" fill="#93c5fd" fillOpacity={0.2} name="Media +/- DP" connectNulls />
        <Area dataKey="stdLower" stroke="none" fill="#ffffff" fillOpacity={1} connectNulls legendType="none" />
        <Line dataKey="max" name="Maximo" stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" dot={false} connectNulls />
        <Line dataKey="min" name="Minimo" stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" dot={false} connectNulls />
        <Line dataKey="mean" name="Media" stroke="#2563eb" strokeWidth={2} dot={{ r: 3, fill: '#2563eb' }} connectNulls />
        <Line dataKey="median" name="Mediana" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 2, fill: '#f59e0b' }} connectNulls />
        {referenceValue != null && (
          <ReferenceLine y={referenceValue} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="5 5"
            label={{ value: referenceLabel || `Ref: ${fmt(referenceValue)}`, position: 'right', fontSize: 9, fill: '#ef4444' }} />
        )}
        <Legend wrapperStyle={{ fontSize: 10 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
