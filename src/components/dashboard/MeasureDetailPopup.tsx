import { MeasureTrendResult } from '../../services/measureTrend';
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceArea } from 'recharts';

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
  if (!isOpen) return null;
  const fmt = (v: number) => v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}K` : v.toLocaleString('pt-PT');

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
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
              {trend.tendenciaSlope != null ? `${trend.tendenciaSlope > 0 ? '+' : ''}${trend.tendenciaSlope.toFixed(1)}/mes` : '\u2014'}
            </div>
          </div>
        </div>

        {trend.timeSeries.length >= 2 && (
          <div className="px-5 pb-5">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={trend.timeSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <ReferenceArea x1="2024-01" x2="2024-06" fill="#FFE0E6" fillOpacity={0.3} />
                <ReferenceArea x1="2024-07" x2="2025-06" fill="#FFE0B2" fillOpacity={0.3} />
                <ReferenceArea x1="2025-07" x2="2099-12" fill="#FF9800" fillOpacity={0.15} />
                <XAxis dataKey="periodo" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => fmt(v)} />
                <Tooltip formatter={(v) => fmt(Number(v))} />
                {trend.referenceValue != null && (
                  <ReferenceLine y={trend.referenceValue} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1.5}
                    label={{ value: `Ref. Jun 2024: ${fmt(trend.referenceValue)}`, position: 'right', fontSize: 9, fill: '#ef4444' }} />
                )}
                <Line dataKey="valor" name="Valor" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} connectNulls />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="p-5 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
            <div><span className="font-semibold">Fonte:</span> {fonte}</div>
            <div><span className="font-semibold">Semaforo:</span> {trend.label}</div>
            <div><span className="font-semibold">Meses desfavoraveis:</span> {trend.mesesDesfavoraveis}/12</div>
            <div><span className="font-semibold">Tipo:</span> {trend.dataSource === 'api_dinamica' ? 'API dinamica' : 'Dados fixos'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
