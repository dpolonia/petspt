import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, ComposedChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import ChartWrapper from '../components/charts/ChartWrapper';
import MedidaCard from '../components/eixo/MedidaCard';
import PeriodBackground from '../components/common/PeriodBackground';
import { useSNSData } from '../hooks/useSNSData';
import { getMedidasByEixo } from '../services/staticData';
import AISummary from '../components/eixo/AISummary';
import ChartViewToggle, { ChartView } from '../components/charts/ChartViewToggle';
import { filterFromBaseline, aggregateToQuarterly, cumulativeYearly } from '../services/dataTransform';
// dataTransform available if needed for future API integrations
import { ULS_REGISTRY } from '../config/ulsRegistry';

// CRI operacionais por ULS (Relatório Dez 2024)
const CRI_ULS = [
  'ULS_BR', 'ULS_MT', 'ULS_NE', 'ULS_SA', 'ULS_CB',
  'ULS_RA', 'ULS_CO', 'ULS_AS', 'ULS_MTE',
  'ULS_LO', 'ULS_AR', 'ULS_LOD', 'ULS_OE', 'ULS_BA',
];

const ECSM_ULS = [
  'ULS_BR', 'ULS_AA', 'ULS_MA', 'ULS_TS', 'ULS_EDV',
  'ULS_GU', 'ULS_VDL', 'ULS_CVB', 'ULS_CB',
  'ULS_LO', 'ULS_LOD', 'ULS_AR', 'ULS_ALS', 'ULS_ET',
  'ULS_LA', 'ULS_AAL', 'ULS_AC', 'ULS_ALG',
];

export default function Eixo5Page() {
  const medidas = getMedidasByEixo(5);
  const [chartView, setChartView] = useState<ChartView>('mensal');

  // ─── API: Camas — lotacao-praticada-por-tipo-de-cama ───
  // Note: this dataset doesn't have a specialty field, only tipo_de_camas (Cirúrgicas, Médicas, Neutras, Outras)
  // We'll use it for total bed capacity trend. Psychiatry-specific data comes from static sources.
  const camasQuery = useMemo(() => ({
    dataset: 'lotacao-praticada-por-tipo-de-cama',
    where: "tempo >= '2024-01'",
    orderBy: 'tempo',
    limit: 100,
    groupBy: 'tempo',
    select: 'tempo, sum(lotacao) as total_lotacao',
  }), []);
  const { data: camasData, loading: camasLoading, error: camasError } = useSNSData(camasQuery);

  const toYM = (t: unknown) => String(t || '').substring(0, 7);

  function applyView<T extends { periodo: string }>(data: T[], fields: string[]): T[] {
    const filtered = filterFromBaseline(data);
    if (chartView === 'trimestral') return aggregateToQuarterly(filtered, fields) as unknown as T[];
    if (chartView === 'cumulativo') return cumulativeYearly(filtered, fields) as unknown as T[];
    return filtered;
  }

  // ─── Transform: Camas ───
  const camasChartData = (() => {
    if (camasData.length > 0) {
      const raw = camasData
        .map(r => ({ periodo: toYM(r.tempo), camas: Number(r.total_lotacao || 0) }))
        .sort((a, b) => a.periodo.localeCompare(b.periodo));
      return applyView(raw, ['camas']);
    }
    return [];
  })();

  // ─── Consultas psicologia/psiquiatria — dados estáticos ───
  const consultasData = [
    { tipo: 'Psicologia', consultas_2024: 61654, consultas_fev2025: 68606, variacao: '+11,27%' },
    { tipo: 'Psiquiatria', consultas_2024: 138102, consultas_fev2025: 136323, variacao: '-1,29%' },
  ];

  // ─── Mapa CRI/ECSM ───
  const ulsMapData = ULS_REGISTRY
    .filter(u => !u.code.startsWith('IPO'))
    .map(uls => ({
      ...uls,
      temCRI: CRI_ULS.includes(uls.code),
      temECSM: ECSM_ULS.includes(uls.code),
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
            <span className="text-violet-600 font-bold">E5</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Saude Mental</h1>
            <p className="text-sm text-gray-500">Psicologos CSP, equipas comunitarias, internamento, CRI</p>
          </div>
        </div>
        <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <strong>Resultados esperados:</strong> Contratacao de psicologos nos CSP &middot;
          Programas de ansiedade e depressao por ECSM &middot;
          Generalizacao de CRI de Saude Mental
        </div>
      </div>

      <AISummary eixo={5} />

      {/* Cards medidas */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Estado das Medidas ({medidas.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {medidas.map(m => <MedidaCard key={m.id} medida={m} compact />)}
        </div>
      </div>

      {/* Graficos */}
      <div className="flex justify-end mb-4">
        <ChartViewToggle view={chartView} onChange={setChartView} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* G1: Consultas psicologia/psiquiatria */}
        <ChartWrapper
          titulo="Consultas de Psicologia e Psiquiatria"
          subtitulo="Acumulado ate Fev/2025 vs. periodo homologo"
          fonte="II Relatorio GT PETS (Abr 2025)"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={consultasData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="tipo" tick={{ fontSize: 12 }} width={90} />
              <Tooltip formatter={(value) => Number(value).toLocaleString('pt-PT')} />
              <Legend />
              <Bar dataKey="consultas_2024" name="Periodo Homologo 2024" fill="#94a3b8" radius={[0, 3, 3, 0]} />
              <Bar dataKey="consultas_fev2025" name="Ate Fev 2025" fill="#8b5cf6" radius={[0, 3, 3, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* G2: Camas hospitalares total */}
        <ChartWrapper
          titulo="Lotacao Hospitalar — Total de Camas"
          subtitulo="Evolucao mensal da lotacao praticada (todas as tipologias)"
          loading={camasLoading}
          error={camasError}
          fonte="Transparencia SNS — lotacao-praticada-por-tipo-de-cama"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={camasChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <PeriodBackground />
              <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => Number(value).toLocaleString('pt-PT')} />
              <Legend />
              <Bar dataKey="camas" name="Total Camas" fill="#7c3aed" radius={[3, 3, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      {/* G3: Mapa CRI e ECSM */}
      <div className="mb-8">
        <ChartWrapper
          titulo="CRI e Equipas Comunitarias de Saude Mental por ULS"
          subtitulo="15 CRI piloto operacionais desde Jul/2024 &middot; 20 ECSM operacionais, 20 adicionais em publicacao"
          fonte="Relatorio GT PETS (Dez 2024) / CNPSM"
          height={400}
        >
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 p-2 overflow-y-auto" style={{ maxHeight: 380 }}>
            {ulsMapData.map(uls => (
              <div
                key={uls.code}
                className={`p-2 rounded-lg border text-center text-xs ${
                  uls.temCRI || uls.temECSM
                    ? 'border-violet-200 bg-violet-50'
                    : 'border-gray-100 bg-gray-50'
                }`}
              >
                <div className="font-medium text-gray-700 truncate" title={uls.nome}>
                  {uls.nome.replace('ULS ', '')}
                </div>
                <div className="flex gap-1 justify-center mt-1 flex-wrap">
                  {uls.temCRI && <span className="px-1.5 py-0.5 bg-violet-200 text-violet-700 rounded text-[10px] font-semibold">CRI</span>}
                  {uls.temECSM && <span className="px-1.5 py-0.5 bg-blue-200 text-blue-700 rounded text-[10px] font-semibold">ECSM</span>}
                  {!uls.temCRI && !uls.temECSM && <span className="text-gray-300">&mdash;</span>}
                </div>
              </div>
            ))}
          </div>
        </ChartWrapper>
      </div>

      {/* Mini-cards KPI */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-violet-600">1.385</div>
          <div className="text-xs text-gray-500 mt-1">Psicologos no SNS</div>
          <div className="text-xs text-gray-400">+31 desde Mai/2024</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">40</div>
          <div className="text-xs text-gray-500 mt-1">ECSM Previstas</div>
          <div className="text-xs text-gray-400">20 operacionais</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">15</div>
          <div className="text-xs text-gray-500 mt-1">CRI Piloto</div>
          <div className="text-xs text-gray-400">desde Jul/2024</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">1.874</div>
          <div className="text-xs text-gray-500 mt-1">Camas Psiquiatria</div>
          <div className="text-xs text-gray-400">23% livres</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-red-600">500</div>
          <div className="text-xs text-gray-500 mt-1">Respostas Desinstit.</div>
          <div className="text-xs text-gray-400">Aviso aberto Fev/2025</div>
        </div>
      </div>

      {/* Medidas expandidas */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Detalhe das Medidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medidas.map(m => <MedidaCard key={m.id} medida={m} />)}
        </div>
      </div>
    </div>
  );
}
