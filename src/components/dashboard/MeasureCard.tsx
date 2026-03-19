import { MeasureTrendResult, TrendColor } from '../../services/measureTrend';

const STYLES: Record<TrendColor, { bg: string; border: string; icon: string }> = {
  verde: { bg: 'bg-green-50', border: 'border-green-300', icon: '\u2713' },
  amarelo: { bg: 'bg-yellow-50', border: 'border-yellow-300', icon: '\u2197' },
  laranja: { bg: 'bg-orange-50', border: 'border-orange-300', icon: '\u2198' },
  vermelho: { bg: 'bg-red-50', border: 'border-red-300', icon: '\u2717' },
  cinzento: { bg: 'bg-gray-50', border: 'border-gray-200', icon: '\u2014' },
};

const PRIO: Record<string, string> = {
  urgente: 'bg-red-100 text-red-700',
  prioritaria: 'bg-yellow-100 text-yellow-700',
  estruturante: 'bg-blue-100 text-blue-700',
};

interface Props {
  medidaId: string;
  nome: string;
  prioridade: string;
  trend: MeasureTrendResult;
  onClick: () => void;
}

export default function MeasureCard({ medidaId, nome, prioridade, trend, onClick }: Props) {
  const s = STYLES[trend.cor];
  const fmt = (v: number) => v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}K` : v.toLocaleString('pt-PT');

  return (
    <button onClick={onClick} className={`w-full text-left p-3 rounded-lg border ${s.bg} ${s.border} hover:shadow-md transition-all cursor-pointer`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-gray-500 mb-0.5">{medidaId}</div>
          <div className="text-sm font-semibold text-gray-800 truncate">{nome}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIO[prioridade] || 'bg-gray-100 text-gray-700'}`}>{prioridade}</span>
          <span className="text-lg">{s.icon}</span>
        </div>
      </div>
      {trend.currentValue != null && (
        <div className="mt-2 flex items-baseline gap-2 text-xs">
          <span className="font-bold text-gray-900">{fmt(trend.currentValue)}</span>
          <span className="text-gray-400">({trend.currentPeriodo})</span>
          {trend.referenceValue != null && (
            <span className={trend.cor === 'verde' ? 'text-green-600' : trend.cor === 'vermelho' ? 'text-red-600' : 'text-gray-500'}>
              vs. ref: {fmt(trend.referenceValue)}
            </span>
          )}
        </div>
      )}
      {trend.timeSeries.length > 0 && (
        <div className="mt-2 flex gap-0.5">
          {trend.timeSeries.slice(-12).map((d, i) => {
            const isFav = trend.referenceValue != null ? (d.valor >= trend.referenceValue) : true;
            return <div key={i} className={`h-1.5 flex-1 rounded-full ${isFav ? 'bg-green-400' : 'bg-red-300'}`} title={`${d.periodo}: ${d.valor.toLocaleString('pt-PT')}`} />;
          })}
        </div>
      )}
      <div className="mt-1 text-[10px] text-gray-400">{trend.label}</div>
    </button>
  );
}
