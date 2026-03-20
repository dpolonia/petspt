import { useState } from 'react';
import { MEDIDAS_ESTADO, getScorecard } from '../services/staticData';
import { MEASURE_DATA_MAPPINGS, MAPPING_STATS } from '../config/measureDataSources';
import { calculateMeasureTrend, DEFAULT_TREND, MeasureTrendResult } from '../services/measureTrend';
import { useFirestoreData } from '../hooks/useFirestoreData';
import MeasureCard from '../components/dashboard/MeasureCard';
import MeasureDetailPopup from '../components/dashboard/MeasureDetailPopup';
import { PERIODS } from '../config/periods';

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

// Get the Firestore dataset slug for the selected measure (if any)
function getDatasetSlug(medidaId: string | null): string | null {
  if (!medidaId) return null;
  const mapping = MEASURE_DATA_MAPPINGS.find(m => m.medidaId === medidaId);
  return mapping?.primaryDataset?.slug || null;
}

function getMapping(medidaId: string) {
  return MEASURE_DATA_MAPPINGS.find(m => m.medidaId === medidaId);
}

export default function Dashboard() {
  const scorecard = getScorecard();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const today = new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });

  const now = new Date().toISOString().split('T')[0];
  const currentPeriod = PERIODS.find(p => { const end = p.end === 'now' ? now : p.end; return now >= p.start && now <= end; });

  // Load Firestore data for the selected measure's dataset
  const selectedSlug = getDatasetSlug(selectedId);
  const { dados: firestoreData, source: firestoreSource } = useFirestoreData(selectedSlug);

  // Build trend for each measure using kpiData
  const trendMap: Record<string, MeasureTrendResult> = {};
  for (const m of MEDIDAS_ESTADO) {
    if (m.kpiData?.dataPoints && m.kpiData.dataPoints.length >= 2) {
      const trend = calculateMeasureTrend(m.kpiData.dataPoints, m.kpiData.invertido);
      trend.dataSource = 'dados_fixos';
      trendMap[m.id] = trend;
    } else {
      trendMap[m.id] = {
        ...DEFAULT_TREND,
        dataSource: 'dados_fixos',
        cor: m.estado === 'concluida' ? 'verde' : m.estado === 'em_curso' ? 'amarelo' : m.estado === 'parcial' ? 'laranja' : m.estado === 'nao_implementada' ? 'vermelho' : 'cinzento',
        label: m.estado === 'concluida' ? 'Concluida' : m.estado === 'em_curso' ? 'Em curso' : m.estado === 'parcial' ? 'Parcial' : m.estado === 'nao_implementada' ? 'Nao implementada' : 'N/A',
        currentValue: m.kpiData?.current?.valor ?? null,
        currentPeriodo: m.kpiData?.current?.periodo ?? null,
        baselineValue: m.kpiData?.baseline?.valor ?? null,
        referenceValue: m.kpiData?.reference?.valor ?? null,
      };
    }
  }

  // For the selected measure, build an enriched trend from Firestore if available
  const selected = selectedId ? MEDIDAS_ESTADO.find(m => m.id === selectedId) : null;
  const mapping = selectedId ? getMapping(selectedId) : null;

  let selectedTrend = selectedId ? (trendMap[selectedId] || DEFAULT_TREND) : DEFAULT_TREND;
  let selectedFonte = 'Relatorios GT PETS';

  if (selectedId && mapping?.primaryDataset && firestoreData.length > 0 && firestoreSource) {
    // Extract time series from Firestore data using the mapped field
    const field = mapping.primaryDataset.campoValor;
    const timeSeries = firestoreData
      .filter(d => d.periodo >= '2024-01')
      .map(d => ({ periodo: d.periodo, valor: Number(d.indicadores[field]) || 0 }))
      .filter(d => d.valor > 0)
      .sort((a, b) => a.periodo.localeCompare(b.periodo));

    if (timeSeries.length >= 2) {
      selectedTrend = calculateMeasureTrend(timeSeries, mapping.primaryDataset.invertido);
      selectedTrend.dataSource = firestoreSource === 'firestore' ? 'api_dinamica' : 'api_dinamica';
      selectedFonte = `${firestoreSource === 'firestore' ? 'Firestore' : 'API'} (Transparencia SNS — ${mapping.primaryDataset.slug})`;
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Plano de Emergencia e Transformacao da Saude</h1>
        <p className="text-sm text-gray-500 mt-1">Monitorizacao em tempo real &middot; {today}</p>
        {currentPeriod && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: currentPeriod.color }}>
            {currentPeriod.label}
          </div>
        )}
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
          <span>Fontes: <strong className="text-gray-700">{MAPPING_STATS.uniqueDatasets} datasets</strong> de 4 portais</span>
          <span>Com API: <strong className="text-green-600">{MAPPING_STATS.withAPI}</strong></span>
          <span>Dados fixos: <strong className="text-yellow-600">{MAPPING_STATS.withStatic}</strong></span>
          <span>Sem dados: <strong className="text-gray-400">{MAPPING_STATS.withoutData}</strong></span>
        </div>
      </div>

      {[1, 2, 3, 4, 5].map(eixo => {
        const medidas = MEDIDAS_ESTADO.filter(m => m.eixo === eixo);
        const info = EIXO_NAMES[eixo];
        return (
          <section key={eixo} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-lg ${info.corLight} flex items-center justify-center`}>
                <span className={`${info.cor} font-bold text-sm`}>E{eixo}</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{info.nome}</h2>
              <span className="text-xs text-gray-400">{medidas.length} medidas</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {medidas.map(m => (
                <MeasureCard
                  key={m.id}
                  medidaId={m.id}
                  nome={m.nomeCurto}
                  prioridade={m.prioridade}
                  trend={trendMap[m.id] || DEFAULT_TREND}
                  onClick={() => setSelectedId(m.id)}
                />
              ))}
            </div>
          </section>
        );
      })}

      <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Semaforo de Tendencia</h3>
        <div className="flex flex-wrap gap-4">
          {TREND_LEGEND.map(item => (
            <div key={item.label} className="flex items-center gap-2 text-xs">
              <div className={`w-4 h-4 rounded border ${item.bg}`} />
              <span className="font-medium">{item.label}</span>
              <span className="text-gray-400">&mdash; {item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Periodos de Referencia</h3>
        <div className="flex flex-wrap gap-4">
          {PERIODS.map(p => (
            <div key={p.id} className="flex items-center gap-2">
              <div className="w-6 h-4 rounded" style={{ backgroundColor: p.color }} />
              <span className="text-xs text-gray-600">{p.label}</span>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <MeasureDetailPopup
          isOpen={!!selectedId}
          onClose={() => setSelectedId(null)}
          medidaId={selected.id}
          nome={selected.nome}
          descricao={selected.descricaoProgresso}
          prioridade={selected.prioridade}
          trend={selectedTrend}
          fonte={selectedFonte}
        />
      )}
    </div>
  );
}
