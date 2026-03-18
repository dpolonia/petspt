import { ReactNode } from 'react';

interface ChartWrapperProps {
  titulo: string;
  subtitulo?: string;
  loading?: boolean;
  error?: string | null;
  fonte?: string;
  children: ReactNode;
  height?: number;
}

export default function ChartWrapper({ titulo, subtitulo, loading, error, fonte, children, height = 400 }: ChartWrapperProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{titulo}</h3>
        {subtitulo && <p className="text-sm text-gray-500 mt-1">{subtitulo}</p>}
      </div>

      {loading && (
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="animate-pulse text-gray-400">A carregar dados...</div>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center justify-center" style={{ height }}>
          <div className="text-center">
            <div className="text-red-500 text-sm mb-2">Erro ao carregar dados</div>
            <div className="text-xs text-gray-400">{error}</div>
            <div className="text-xs text-gray-400 mt-1">A usar dados estaticos como fallback.</div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div style={{ width: '100%', height }}>
          {children}
        </div>
      )}

      {fonte && (
        <div className="mt-3 text-xs text-gray-400 border-t border-gray-100 pt-2">
          Fonte: {fonte}
        </div>
      )}
    </div>
  );
}
