interface KPICardProps {
  label: string;
  valor: number;
  anterior?: number | null;
  unidade: string;
  tendencia: 'subida' | 'descida' | 'estavel';
  eixo: number;
}

export default function KPICard({ label, valor, anterior, unidade, tendencia, eixo }: KPICardProps) {
  const formatValor = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
    return v.toLocaleString('pt-PT');
  };

  const tendenciaIcon = tendencia === 'subida' ? '\u2191' : tendencia === 'descida' ? '\u2193' : '\u2192';

  const isDescidaPositiva = label.toLowerCase().includes('fora') || label.toLowerCase().includes('sem m');
  const corFinal = isDescidaPositiva
    ? (tendencia === 'descida' ? 'text-green-600' : tendencia === 'subida' ? 'text-red-600' : 'text-gray-500')
    : (tendencia === 'subida' ? 'text-green-600' : tendencia === 'descida' ? 'text-red-600' : 'text-gray-500');

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Eixo {eixo}</span>
        <span className={`text-sm font-semibold ${corFinal}`}>{tendenciaIcon}</span>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">
        {formatValor(valor)}<span className="text-sm font-normal text-gray-400 ml-1">{unidade}</span>
      </div>
      <div className="text-sm text-gray-600">{label}</div>
      {anterior != null && (
        <div className="text-xs text-gray-400 mt-1">
          Anterior: {formatValor(anterior)} {unidade}
        </div>
      )}
    </div>
  );
}
