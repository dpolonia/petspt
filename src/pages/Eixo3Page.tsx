import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, ComposedChart, Bar, Line,
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

export default function Eixo3Page() {
  const medidas = getMedidasByEixo(3);
  const [chartView, setChartView] = useState<ChartView>('mensal');
  const toYM = (t: unknown) => String(t || '').substring(0, 7);

  // SNS24 — already 1 record per month (no ULS decomposition)
  const { data: sns24Data, loading: l1, error: e1 } = useSNSData(useMemo(() => ({
    dataset: 'atividade-operacional-do-sns-24',
    where: "periodo >= '2024-01' and indicador = 'Chamadas Atendidas'",
    orderBy: 'periodo',
    limit: 100,
  }), []));

  // Urgencias aggregated nationally
  const { data: urgenciasData, loading: l2, error: e2 } = useSNSData(useMemo(() => ({
    dataset: 'atendimentos-por-tipo-de-urgencia-hospitalar-link',
    select: 'tempo, sum(urgencias_geral) as geral, sum(urgencias_pediatricas) as pediatrica, sum(urgencia_obstetricia) as obstetricia',
    groupBy: 'tempo',
    orderBy: 'tempo',
    limit: 100,
  }), []));

  function applyView<T extends { periodo: string }>(data: T[], fields: string[]): T[] {
    const filtered = filterFromBaseline(data);
    if (chartView === 'trimestral') return aggregateToQuarterly(filtered, fields) as unknown as T[];
    if (chartView === 'cumulativo') return cumulativeYearly(filtered, fields) as unknown as T[];
    return filtered;
  }

  const sns24Chart = (() => {
    if (sns24Data.length === 0) return [];
    const raw = sns24Data.map(r => ({ periodo: toYM(r.periodo), chamadas: Number(r.valor) || 0 }))
      .sort((a, b) => a.periodo.localeCompare(b.periodo));
    return applyView(raw, ['chamadas']);
  })();

  const urgenciasChart = (() => {
    if (urgenciasData.length === 0) return [];
    const raw = urgenciasData.map(r => ({
      periodo: toYM(r.tempo),
      geral: Number(r.geral) || 0,
      pediatrica: Number(r.pediatrica) || 0,
      obstetricia: Number(r.obstetricia) || 0,
    })).sort((a, b) => a.periodo.localeCompare(b.periodo));
    return applyView(raw, ['geral', 'pediatrica', 'obstetricia']);
  })();

  const cacData = [
    { periodo: '2024-08', atendimentos: 2000, cac: 2 },
    { periodo: '2024-09', atendimentos: 2500, cac: 5 },
    { periodo: '2024-10', atendimentos: 3000, cac: 8 },
    { periodo: '2024-11', atendimentos: 3500, cac: 10 },
    { periodo: '2024-12', atendimentos: 4000, cac: 12 },
    { periodo: '2025-01', atendimentos: 4500, cac: 15 },
    { periodo: '2025-02', atendimentos: 5000, cac: 15 },
    { periodo: '2025-03', atendimentos: 5834, cac: 15 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <span className="text-red-600 font-bold">E3</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Cuidados Urgentes e Emergentes</h1>
            <p className="text-sm text-gray-500">Urgencias, CAC, transporte critico, vacinacao</p>
          </div>
        </div>
        <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <strong>Resultados esperados:</strong> Criacao de Centros de Atendimento Clinico &middot;
          Diminuicao de internamentos sociais &middot; Requalificacao dos Servicos de Urgencia
        </div>
      </div>

      <AISummary eixo={3} />

      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Estado das Medidas ({medidas.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {medidas.map(m => <MedidaCard key={m.id} medida={m} compact />)}
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <ChartViewToggle view={chartView} onChange={setChartView} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartWrapper titulo="Centros de Atendimento Clinico (CAC)" subtitulo="Atendimentos mensais e n.o de CAC operacionais" fonte="Relatorios GT PETS">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={cacData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <PeriodBackground />
              <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="atendimentos" name="Atendimentos" fill="#ef4444" radius={[3, 3, 0, 0]} />
              <Line yAxisId="right" type="stepAfter" dataKey="cac" name="CAC Operacionais" stroke="#1d4ed8" strokeWidth={2} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <ChartWrapper titulo="Atendimentos em Urgencia por Tipo" subtitulo="Total nacional mensal" loading={l2} error={e2} fonte="Transparencia SNS">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={urgenciasChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <PeriodBackground />
              <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => Number(value).toLocaleString('pt-PT')} />
              <Legend />
              <Bar dataKey="geral" name="Geral" fill="#ef4444" stackId="a" />
              <Bar dataKey="pediatrica" name="Pediatrica" fill="#3b82f6" stackId="a" />
              <Bar dataKey="obstetricia" name="Obstetricia" fill="#ec4899" stackId="a" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      <div className="mb-8">
        <ChartWrapper titulo="Atividade SNS24 — Chamadas Atendidas" subtitulo="Volume mensal" loading={l1} error={e1} fonte="Transparencia SNS" height={350}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={sns24Chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <PeriodBackground />
              <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => Number(value).toLocaleString('pt-PT')} />
              <Legend />
              <Bar dataKey="chamadas" name="Chamadas Atendidas" fill="#6366f1" radius={[3, 3, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-red-600">15</div>
          <div className="text-xs text-gray-500 mt-1">CAC Operacionais</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">30.334</div>
          <div className="text-xs text-gray-500 mt-1">Atendimentos CAC</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">1.611</div>
          <div className="text-xs text-gray-500 mt-1">Camas Contratadas</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">7.000</div>
          <div className="text-xs text-gray-500 mt-1">Teleconsultas</div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Detalhe das Medidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medidas.map(m => <MedidaCard key={m.id} medida={m} />)}
        </div>
      </div>
    </div>
  );
}
