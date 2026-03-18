import { MedidaEstado } from '../../services/staticData';

const ESTADO_CONFIG = {
  concluida:        { cor: 'bg-green-500',  corLight: 'bg-green-50',  label: 'Concluida' },
  em_curso:         { cor: 'bg-yellow-500', corLight: 'bg-yellow-50', label: 'Em Curso' },
  parcial:          { cor: 'bg-orange-500', corLight: 'bg-orange-50', label: 'Parcial' },
  nao_implementada: { cor: 'bg-red-500',    corLight: 'bg-red-50',    label: 'Nao Implementada' },
};

const PRIORIDADE_BADGE = {
  urgente:       'bg-red-100 text-red-700',
  prioritaria:   'bg-amber-100 text-amber-700',
  estruturante:  'bg-blue-100 text-blue-700',
};

interface MedidaCardProps {
  medida: MedidaEstado;
  compact?: boolean;
}

export default function MedidaCard({ medida, compact = false }: MedidaCardProps) {
  const config = ESTADO_CONFIG[medida.estado];
  const badge = PRIORIDADE_BADGE[medida.prioridade];

  if (compact) {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-lg ${config.corLight} border border-gray-100`}>
        <div className={`w-3 h-3 rounded-full ${config.cor} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-800 truncate">{medida.nomeCurto}</div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${badge}`}>{medida.prioridade}</span>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <div className={`h-1.5 ${config.cor}`} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-gray-400">{medida.id}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${badge}`}>{medida.prioridade}</span>
            </div>
            <h4 className="text-sm font-semibold text-gray-800">{medida.nomeCurto}</h4>
          </div>
          <div className="flex items-center gap-1.5 ml-3">
            <span className={`w-2.5 h-2.5 rounded-full ${config.cor}`} />
            <span className="text-xs font-medium text-gray-600">{config.label}</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{medida.descricaoProgresso}</p>
        {medida.legislacao && (
          <div className="mt-2 text-xs text-blue-600">{medida.legislacao}</div>
        )}
      </div>
    </div>
  );
}
