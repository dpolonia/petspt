import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';
import ChartWrapper from '../components/charts/ChartWrapper';
import MedidaCard from '../components/eixo/MedidaCard';
import PeriodBackground from '../components/common/PeriodBackground';
import ChartViewToggle, { ChartView } from '../components/charts/ChartViewToggle';
import { useSNSData } from '../hooks/useSNSData';
import { getMedidasByEixo, STATIC_DATA } from '../services/staticData';
import { filterFromBaseline, aggregateToQuarterly, cumulativeYearly } from '../services/dataTransform';
import AISummary from '../components/eixo/AISummary';
import { exportPageAsPDF } from '../utils/exportPDF';

export default function Eixo1Page() {
  const medidas = getMedidasByEixo(1);
  const [chartView, setChartView] = useState<ChartView>('mensal');
  const staticEixo1 = STATIC_DATA.eixo1;

  // Aggregated queries: 1 record per month (national totals), <100 records each
  const { data: cirurgiaData, loading: l1, error: e1 } = useSNSData(useMemo(() => ({
    dataset: 'intervencoes-cirurgicas',
    select: 'tempo, sum(no_intervencoes_cirurgicas_programadas) as total',
    groupBy: 'tempo',
    orderBy: 'tempo',
    limit: 100,
  }), []));

  const { data: consultasData, loading: l2, error: e2 } = useSNSData(useMemo(() => ({
    dataset: 'consultas-em-tempo-real',
    select: 'tempo, sum(no_primeiras_ce_realizadas_com_registo_no_cth) as total_cth, sum(no_primeiras_ce_prestadas_dentro_do_tmrg) as dentro_tmrg',
    groupBy: 'tempo',
    orderBy: 'tempo',
    limit: 100,
  }), []));

  const { data: licData, loading: l3, error: e3 } = useSNSData(useMemo(() => ({
    dataset: 'inscritos-em-lic-dentro-do-tmrg-180-dias',
    select: 'tempo, sum(no_de_doentes_inscritos_sigic) as inscritos, sum(no_de_doentes_inscritos_dentro_do_tmrg_sigic) as dentro_tmrg',
    groupBy: 'tempo',
    orderBy: 'tempo',
    limit: 100,
  }), []));

  // Parse ISO date to YYYY-MM
  const toYM = (t: unknown) => String(t || '').substring(0, 7);

  // Apply view transform to any chart data
  function applyView<T extends { periodo: string }>(data: T[], fields: string[]): T[] {
    const filtered = filterFromBaseline(data);
    if (chartView === 'trimestral') return aggregateToQuarterly(filtered, fields) as unknown as T[];
    if (chartView === 'cumulativo') return cumulativeYearly(filtered, fields) as unknown as T[];
    return filtered;
  }

  const cirurgiaChart = (() => {
    if (cirurgiaData.length > 0) {
      const raw = cirurgiaData.map(r => ({ periodo: toYM(r.tempo), total: Number(r.total) || 0 }))
        .sort((a, b) => a.periodo.localeCompare(b.periodo));
      return applyView(raw, ['total']);
    }
    return [
      { periodo: '2023-Q1', total: staticEixo1.cirurgia_nao_onco.operados_q1_2023 + staticEixo1.oncostop.cirurgias_onco_q1_2023 },
      { periodo: '2024-Q1', total: staticEixo1.cirurgia_nao_onco.operados_q1_2024 + staticEixo1.oncostop.cirurgias_onco_q1_2024 },
      { periodo: '2025-Q1', total: staticEixo1.cirurgia_nao_onco.operados_q1_2025 + staticEixo1.oncostop.cirurgias_onco_q1_2025 },
    ];
  })();

  const tmrgChart = [
    { periodo: '2024-05', oncologica: 2645, nao_oncologica: null as number | null },
    { periodo: '2024-08', oncologica: 0, nao_oncologica: null as number | null },
    { periodo: '2024-11', oncologica: 168, nao_oncologica: null as number | null },
    { periodo: '2025-03', oncologica: 180, nao_oncologica: 17149 },
  ];

  const consultasChart = (() => {
    if (consultasData.length > 0) {
      const raw = consultasData.map(r => ({
        periodo: toYM(r.tempo),
        total_cth: Number(r.total_cth) || 0,
        dentro_tmrg: Number(r.dentro_tmrg) || 0,
      })).sort((a, b) => a.periodo.localeCompare(b.periodo));
      return applyView(raw, ['total_cth', 'dentro_tmrg']);
    }
    return [
      { periodo: '2024-Q1', total_cth: staticEixo1.consultas_especialidade.cth_q1_2024, dentro_tmrg: staticEixo1.consultas_especialidade.cth_q1_2024 },
      { periodo: '2025-Q1', total_cth: staticEixo1.consultas_especialidade.cth_q1_2025, dentro_tmrg: staticEixo1.consultas_especialidade.cth_q1_2025 },
    ];
  })();

  const licChart = (() => {
    if (licData.length > 0) {
      const raw = licData.map(r => {
        const inscritos = Number(r.inscritos) || 0;
        const dentro = Number(r.dentro_tmrg) || 0;
        return {
          periodo: toYM(r.tempo),
          inscritos_lic: inscritos,
          dentro_tmrg: dentro,
          pct_dentro: inscritos > 0 ? Math.round((dentro / inscritos) * 1000) / 10 : 0,
        };
      }).sort((a, b) => a.periodo.localeCompare(b.periodo));
      return applyView(raw, ['inscritos_lic', 'dentro_tmrg']);
    }
    return [];
  })();

  return (
    <div id="eixo-content" className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <span className="text-orange-600 font-bold">E1</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Resposta a Tempo e Horas</h1>
              <p className="text-sm text-gray-500">Listas de espera cirurgicas e consultas de especialidade</p>
            </div>
          </div>
          <button onClick={() => exportPageAsPDF('eixo-content', `PETS_Eixo1_${new Date().toISOString().split('T')[0]}.pdf`)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors">
            PDF
          </button>
        </div>
        <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <strong>Resultados esperados:</strong> Fim das listas de espera de cirurgia oncologica no SNS &middot;
          Alteracao radical das Listas de Espera para Cirurgia e Consultas &middot;
          Cumprimento regular dos TMRG em todo o territorio nacional
        </div>
      </div>

      <AISummary eixo={1} />

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
        <ChartWrapper titulo="Cirurgias Realizadas" subtitulo={cirurgiaData.length > 0 ? 'Total nacional mensal (dados API)' : 'Comparacao trimestral Q1'} loading={l1} error={e1} fonte="Transparencia SNS">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={cirurgiaChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <PeriodBackground />
              <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => Number(value).toLocaleString('pt-PT')} />
              <Legend />
              <Bar dataKey="total" name="Total Cirurgias" fill="#f97316" radius={[4, 4, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <ChartWrapper titulo="Doentes Fora do TMRG" subtitulo="Evolucao oncologica e nao-oncologica" fonte="Relatorios GT PETS">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={tmrgChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <PeriodBackground />
              <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => Number(value).toLocaleString('pt-PT')} />
              <Legend />
              <Line type="monotone" dataKey="oncologica" name="Oncologica" stroke="#ef4444" strokeWidth={2} dot={{ r: 5 }} />
              <Line type="monotone" dataKey="nao_oncologica" name="Nao-Oncologica" stroke="#3b82f6" strokeWidth={2} dot={{ r: 5 }} connectNulls={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartWrapper titulo="Consultas a Tempo e Horas (CTH)" subtitulo={consultasData.length > 0 ? 'Total nacional mensal (dados API)' : 'Comparacao trimestral'} loading={l2} error={e2} fonte="Transparencia SNS">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={consultasChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <PeriodBackground />
              <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => Number(value).toLocaleString('pt-PT')} />
              <Legend />
              <Bar dataKey="total_cth" name="Total CTH" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="dentro_tmrg" name="Dentro TMRG" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <ChartWrapper titulo="Inscritos em LIC dentro do TMRG" subtitulo={licData.length > 0 ? '% dentro do TMRG (dados API)' : ''} loading={l3} error={e3} fonte="Transparencia SNS" height={licChart.length > 0 ? 400 : 200}>
          {licChart.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={licChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <PeriodBackground />
                <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} unit="%" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="inscritos_lic" name="Inscritos LIC" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="pct_dentro" name="% dentro TMRG" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">Dados em carregamento</div>
          )}
        </ChartWrapper>
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
