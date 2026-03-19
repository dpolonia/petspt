import { useState } from 'react';
import { generateBrowserReport } from '../utils/browserReport';

const EIXOS = [
  { n: 1, nome: 'Resposta a Tempo e Horas' },
  { n: 2, nome: 'Bebes e Maes em Seguranca' },
  { n: 3, nome: 'Cuidados Urgentes e Emergentes' },
  { n: 4, nome: 'Saude Proxima e Familiar' },
  { n: 5, nome: 'Saude Mental' },
];

export default function RelatoriosPage() {
  const [eixo, setEixo] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [incluirAI, setIncluirAI] = useState(true);
  const [incluirEurostat, setIncluirEurostat] = useState(true);
  const [horizonte, setHorizonte] = useState(12);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    setSuccess(false);

    try {
      // Try Cloud Function first
      const baseUrl = import.meta.env.PROD
        ? 'https://europe-west1-petspt-f019f.cloudfunctions.net'
        : 'http://localhost:5001/petspt-f019f/europe-west1';

      const response = await fetch(`${baseUrl}/reportPDF?eixo=${eixo}&horizonte=${horizonte}`);

      if (response.ok && response.headers.get('content-type')?.includes('pdf')) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PETS_Eixo${eixo}_${new Date().toISOString().split('T')[0]}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        setSuccess(true);
      } else {
        throw new Error('Cloud Function unavailable');
      }
    } catch {
      // Fallback: browser-side generation
      try {
        await generateBrowserReport(eixo);
        setSuccess(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao gerar PDF');
      }
    } finally {
      setGenerating(false);
    }
  };

  const sections = [
    'Capa e metadata',
    'Sumario executivo com scorecard',
    'Estado das medidas (tabela semaforo)',
    `Projecao Holt-Winters a ${horizonte} meses`,
    'Nota metodologica e fontes',
    ...(incluirAI ? ['Analise AI com referencias Scopus'] : []),
    ...(incluirEurostat ? ['Comparacao internacional Eurostat'] : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <span className="text-emerald-600 font-bold text-sm">PDF</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Gerador de Relatorios</h1>
            <p className="text-sm text-gray-500">Policy brief prospectivo por eixo — PDF publicavel</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Eixo</label>
            <select value={eixo} onChange={e => setEixo(parseInt(e.target.value))}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm">
              {EIXOS.map(e => <option key={e.n} value={e.n}>Eixo {e.n} — {e.nome}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Horizonte de projecao</label>
            <select value={horizonte} onChange={e => setHorizonte(parseInt(e.target.value))}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm">
              <option value={6}>6 meses</option>
              <option value={12}>12 meses</option>
              <option value={18}>18 meses</option>
              <option value={24}>24 meses</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={incluirAI} onChange={e => setIncluirAI(e.target.checked)} className="rounded text-emerald-600" />
              Incluir analise AI com referencias Scopus
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={incluirEurostat} onChange={e => setIncluirEurostat(e.target.checked)} className="rounded text-emerald-600" />
              Incluir comparacao internacional (Eurostat)
            </label>
          </div>

          <button onClick={handleGenerate} disabled={generating}
            className="w-full py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors">
            {generating ? 'A gerar relatorio...' : 'Gerar PDF'}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-700">
              Relatorio gerado com sucesso e descarregado.
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Conteudo do Relatorio</h3>
          <div className="space-y-2">
            {sections.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="text-emerald-500">&#x2713;</span>
                <span className="text-gray-700">{s}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-400">
            Estimativa: {sections.length + 1} paginas &middot; Formato: A4 &middot;
            Fonte: Transparencia SNS + Relatorios GT PETS + Eurostat
          </div>

          <div className="mt-3 bg-white rounded p-3 text-[10px] text-gray-500 italic border border-gray-100">
            <strong>Como citar:</strong> PETS Monitor ({new Date().getFullYear()}).
            Relatorio Prospectivo — Eixo {eixo}: {EIXOS.find(e => e.n === eixo)?.nome}.
            Disponivel em: https://petspt-f019f.web.app/relatorios
          </div>
        </div>
      </div>
    </div>
  );
}
