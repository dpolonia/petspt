import { useState } from 'react';

interface AISummaryData {
  sumario: string;
  pontos_fortes: string[];
  desafios: string[];
  recomendacoes: string[];
  contexto_internacional: string;
  referencias: string[];
  cached?: boolean;
  generated_at?: string;
  error?: string;
}

interface AISummaryProps {
  eixo: number;
}

export default function AISummary({ eixo }: AISummaryProps) {
  const [data, setData] = useState<AISummaryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const baseUrl = import.meta.env.PROD
        ? 'https://europe-west1-petspt.cloudfunctions.net'
        : 'http://localhost:5001/petspt/europe-west1';
      const response = await fetch(`${baseUrl}/aiSummary?eixo=${eixo}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      setData({
        sumario: 'Nao foi possivel gerar o resumo AI neste momento.',
        pontos_fortes: [], desafios: [], recomendacoes: [],
        contexto_internacional: '', referencias: [],
        error: (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!expanded) {
    return (
      <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-lg border border-violet-200 p-4 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-violet-600 text-lg">&#x2726;</span>
            <span className="text-sm font-semibold text-violet-800">Analise AI do Eixo {eixo}</span>
            <span className="text-xs text-violet-500">powered by LLM + Scopus</span>
          </div>
          <button
            onClick={() => { setExpanded(true); fetchSummary(); }}
            className="px-3 py-1.5 bg-violet-600 text-white text-xs font-medium rounded-lg hover:bg-violet-700 transition-colors"
          >
            Gerar Analise
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-lg border border-violet-200 p-5 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-violet-600 text-lg">&#x2726;</span>
        <span className="text-sm font-semibold text-violet-800">Analise AI — Eixo {eixo}</span>
        {data?.cached && <span className="text-[10px] text-violet-400 bg-violet-100 px-2 py-0.5 rounded-full">cached</span>}
        {data?.generated_at && <span className="text-[10px] text-violet-400">{new Date(data.generated_at).toLocaleDateString('pt-PT')}</span>}
      </div>

      {loading && (
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-violet-200 rounded w-3/4" />
          <div className="h-4 bg-violet-200 rounded w-1/2" />
          <div className="h-4 bg-violet-200 rounded w-5/6" />
        </div>
      )}

      {data && !loading && (
        <div className="space-y-4 text-sm">
          <p className="text-gray-700 leading-relaxed">{data.sumario}</p>

          {data.pontos_fortes.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">Pontos Fortes</h4>
              <ul className="space-y-1">
                {data.pontos_fortes.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">&#x2713;</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.desafios.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">Desafios</h4>
              <ul className="space-y-1">
                {data.desafios.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">&#x26A0;</span> {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.recomendacoes.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">Recomendacoes</h4>
              <ul className="space-y-1">
                {data.recomendacoes.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600">
                    <span className="text-blue-500 mt-0.5 flex-shrink-0">&rarr;</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.contexto_internacional && (
            <div className="bg-white bg-opacity-60 rounded p-3 text-xs text-gray-500 italic">
              &#x1F30D; {data.contexto_internacional}
            </div>
          )}

          {data.referencias.length > 0 && (
            <div className="border-t border-violet-200 pt-3">
              <h4 className="text-[10px] font-semibold text-violet-500 uppercase tracking-wider mb-1">Referencias</h4>
              {data.referencias.map((r, i) => (
                <div key={i} className="text-[11px] text-gray-400">{i + 1}. {r}</div>
              ))}
            </div>
          )}

          <button onClick={fetchSummary} disabled={loading} className="text-xs text-violet-500 hover:text-violet-700 underline">
            Regenerar analise
          </button>
        </div>
      )}
    </div>
  );
}
