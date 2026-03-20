import { useState } from 'react';
import { MEDIDAS_ESTADO, getScorecard } from '../services/staticData';
import { MEASURE_DATA_MAPPINGS, MAPPING_STATS } from '../config/measureDataSources';
import { calculateMeasureTrend, DEFAULT_TREND, MeasureTrendResult } from '../services/measureTrend';
import { useMultiFirestore } from '../hooks/useMultiFirestore';
import MeasureCard from '../components/dashboard/MeasureCard';
import MeasureDetailPopup from '../components/dashboard/MeasureDetailPopup';
import { PERIODS } from '../config/periods';
import { decumulate, isCumulative } from '../services/dataTransform';

const EIXO_NAMES: Record<number, { nome: string; cor: string; corLight: string }> = {
  1: { nome: 'Resposta a Tempo e Horas', cor: 'text-orange-600', corLight: 'bg-orange-100' },
  2: { nome: 'Bebes e Maes em Seguranca', cor: 'text-pink-600', corLight: 'bg-pink-100' },
  3: { nome: 'Cuidados Urgentes e Emergentes', cor: 'text-red-600', corLight: 'bg-red-100' },
  4: { nome: 'Saude Proxima e Familiar', cor: 'text-blue-600', corLight: 'bg-blue-100' },
  5: { nome: 'Saude Mental', cor: 'text-violet-600', corLight: 'bg-violet-100' },
};

const TREND_LEGEND = [
  { bg: 'bg-green-100 border-green-300', label: 'Consolidada', desc: '12 meses acima da referencia' },
  { bg: 'bg-yellow-100 border-yellow-300', label: 'Em progresso', desc: 'tendencia convergente' },
  { bg: 'bg-orange-100 border-orange-300', label: 'Atencao', desc: 'tendencia divergente' },
  { bg: 'bg-red-100 border-red-300', label: 'Em regressao', desc: '9+ meses abaixo' },
  { bg: 'bg-gray-100 border-gray-200', label: 'Nao avaliavel', desc: 'sem dados' },
];

const UNIQUE_SLUGS = [...new Set(MEASURE_DATA_MAPPINGS.filter(m => m.primaryDataset).map(m => m.primaryDataset!.slug))];

function getMapping(id: string) { return MEASURE_DATA_MAPPINGS.find(m => m.medidaId === id); }

export default function Dashboard() {
  const scorecard = getScorecard();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const today = new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
  const now = new Date().toISOString().split('T')[0];
  const currentPeriod = PERIODS.find(p => { const end = p.end === 'now' ? now : p.end; return now >= p.start && now <= end; });

  // Load ALL mapped datasets from Firestore (12 unique slugs, 12 reads)
  const { data: fsData, loaded: fsLoaded } = useMultiFirestore(UNIQUE_SLUGS);

  // Build trends: Firestore > kpiData > estado-based grey
  const trendMap: Record<string, MeasureTrendResult> = {};
  const fonteMap: Record<string, string> = {};

  for (const m of MEDIDAS_ESTADO) {
    const mapping = getMapping(m.id);

    // Priority 1: Firestore
    if (mapping?.primaryDataset && fsLoaded) {
      const slug = mapping.primaryDataset.slug;
      const field = mapping.primaryDataset.campoValor;
      const ds = fsData[slug] || [];
      let ts = ds.filter(d => d.periodo >= '2024-01').map(d => ({ periodo: d.periodo, valor: Number(d.indicadores[field]) || 0 })).filter(d => d.valor > 0).sort((a, b) => a.periodo.localeCompare(b.periodo));
      // Auto-detect and convert cumulative YTD data to monthly
      if (isCumulative(ts)) ts = decumulate(ts);
      if (ts.length >= 2) {
        trendMap[m.id] = calculateMeasureTrend(ts, mapping.primaryDataset.invertido);
        trendMap[m.id].dataSource = 'api_dinamica';
        fonteMap[m.id] = `Firestore (Transparencia SNS — ${slug})`;
        continue;
      }
    }

    // Priority 2: Firestore mapped but NO data — LOUD ERROR
    if (mapping?.primaryDataset && fsLoaded) {
      trendMap[m.id] = { ...DEFAULT_TREND, dataSource: 'sem_dados',
        cor: 'vermelho',
        label: `ERRO: Firestore vazio para ${mapping.primaryDataset.slug}`,
      };
      fonteMap[m.id] = `ERRO: dados Firestore nao disponiveis (${mapping.primaryDataset.slug})`;
      continue;
    }

    // Priority 3: kpiData from GT PETS reports (measures without API dataset)
    if (m.kpiData?.dataPoints && m.kpiData.dataPoints.length >= 2) {
      trendMap[m.id] = calculateMeasureTrend(m.kpiData.dataPoints, m.kpiData.invertido);
      trendMap[m.id].dataSource = 'dados_fixos';
      fonteMap[m.id] = `Relatorios GT PETS (${m.kpiData.unidade})`;
      continue;
    }

    // Priority 4: No data at all — use estado color
    trendMap[m.id] = { ...DEFAULT_TREND, dataSource: 'sem_dados',
      cor: m.estado === 'concluida' ? 'verde' : m.estado === 'em_curso' ? 'amarelo' : m.estado === 'parcial' ? 'laranja' : m.estado === 'nao_implementada' ? 'vermelho' : 'cinzento',
      label: m.estado === 'concluida' ? 'Concluida' : m.estado === 'em_curso' ? 'Em curso' : m.estado === 'parcial' ? 'Parcial' : m.estado === 'nao_implementada' ? 'Nao implementada' : 'Sem dados',
      currentValue: null, currentPeriodo: null, baselineValue: null, referenceValue: null,
    };
    fonteMap[m.id] = 'Sem dataset API';
  }

  const selected = selectedId ? MEDIDAS_ESTADO.find(m => m.id === selectedId) : null;
  const selectedTrend = selectedId ? (trendMap[selectedId] || DEFAULT_TREND) : DEFAULT_TREND;
  const selectedFonte = selectedId ? (fonteMap[selectedId] || '') : '';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Plano de Emergencia e Transformacao da Saude</h1>
        <p className="text-sm text-gray-500 mt-1">Monitorizacao em tempo real &middot; {today}</p>
        {currentPeriod && <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: currentPeriod.color }}>{currentPeriod.label}</div>}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Estado Global das {scorecard.total} Medidas</h2>
        <div className="flex gap-1 h-6 rounded-full overflow-hidden mb-3">
          <div className="bg-green-500" style={{ width: `${(scorecard.concluidas / scorecard.total) * 100}%` }} />
          <div className="bg-yellow-500" style={{ width: `${(scorecard.em_curso / scorecard.total) * 100}%` }} />
          <div className="bg-orange-500" style={{ width: `${(scorecard.parciais / scorecard.total) * 100}%` }} />
          <div className="bg-red-500" style={{ width: `${(scorecard.nao_implementadas / scorecard.total) * 100}%` }} />
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500" /> {scorecard.concluidas} Concluidas</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-500" /> {scorecard.em_curso} Em Curso</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500" /> {scorecard.parciais} Parciais</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500" /> {scorecard.nao_implementadas} Nao Implementadas</span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-8">
        <div className="flex flex-wrap gap-6 text-xs text-gray-500">
          <span>Fontes: <strong className="text-gray-700">{MAPPING_STATS.uniqueDatasets} datasets</strong></span>
          <span>API: <strong className="text-green-600">{MAPPING_STATS.withAPI}</strong></span>
          <span>Fixos: <strong className="text-yellow-600">{MAPPING_STATS.withStatic}</strong></span>
          {fsLoaded && <span className="text-green-600 font-semibold">Firestore OK</span>}
        </div>
      </div>

      {[1, 2, 3, 4, 5].map(eixo => {
        const medidas = MEDIDAS_ESTADO.filter(m => m.eixo === eixo);
        const info = EIXO_NAMES[eixo];
        return (
          <section key={eixo} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg ${info.corLight} flex items-center justify-center`}><span className={`${info.cor} font-bold text-sm`}>E{eixo}</span></div>
              <h2 className="text-lg font-semibold text-gray-900">{info.nome}</h2>
              <span className="text-xs text-gray-400">{medidas.length} medidas</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {medidas.map(m => <MeasureCard key={m.id} medidaId={m.id} nome={m.nomeCurto} prioridade={m.prioridade} trend={trendMap[m.id] || DEFAULT_TREND} onClick={() => setSelectedId(m.id)} />)}
            </div>
          </section>
        );
      })}

      <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Semaforo de Tendencia</h3>
        <div className="flex flex-wrap gap-4">{TREND_LEGEND.map(i => <div key={i.label} className="flex items-center gap-2 text-xs"><div className={`w-4 h-4 rounded border ${i.bg}`} /><span className="font-medium">{i.label}</span><span className="text-gray-400">&mdash; {i.desc}</span></div>)}</div>
      </div>

      <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Periodos de Referencia</h3>
        <div className="flex flex-wrap gap-4">{PERIODS.map(p => <div key={p.id} className="flex items-center gap-2"><div className="w-6 h-4 rounded" style={{ backgroundColor: p.color }} /><span className="text-xs text-gray-600">{p.label}</span></div>)}</div>
      </div>

      {selected && <MeasureDetailPopup isOpen={!!selectedId} onClose={() => setSelectedId(null)} medidaId={selected.id} nome={selected.nome} descricao={selected.descricaoProgresso} prioridade={selected.prioridade} trend={selectedTrend} fonte={selectedFonte} />}
    </div>
  );
}
