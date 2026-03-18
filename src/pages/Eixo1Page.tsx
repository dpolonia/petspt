import { useMemo } from 'react';
import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, BarChart,
} from 'recharts';
import ChartWrapper from '../components/charts/ChartWrapper';
import MedidaCard from '../components/eixo/MedidaCard';
import PeriodBackground from '../components/common/PeriodBackground';
import { useSNSData } from '../hooks/useSNSData';
import { getMedidasByEixo, STATIC_DATA } from '../services/staticData';

export default function Eixo1Page() {
  const medidas = getMedidasByEixo(1);
  const staticEixo1 = STATIC_DATA.eixo1;

  // ─── API: Cirurgias por instituicao (mensal, desde 2024) ───
  const cirurgiaQuery = useMemo(() => ({
    dataset: 'intervencoes-cirurgicas',
    where: "tempo >= '2024-01'",
    select: 'tempo, instituicao, no_intervencoes_cirurgicas_programadas',
    orderBy: 'tempo',
    limit: 100,
    groupBy: 'tempo',
  }), []);

  const { data: cirurgiaAPIData, loading: cirurgiaLoading, error: cirurgiaError } = useSNSData(cirurgiaQuery);

  // ─── API: Consultas CTH (mensal, desde 2024) ───
  const consultasQuery = useMemo(() => ({
    dataset: 'consultas-em-tempo-real',
    where: "tempo >= '2024-01'",
    select: 'tempo, no_primeiras_ce_realizadas_com_registo_no_cth, no_primeiras_ce_prestadas_dentro_do_tmrg',
    orderBy: 'tempo',
    limit: 100,
    groupBy: 'tempo',
  }), []);

  const { data: consultasAPIData, loading: consultasLoading, error: consultasError } = useSNSData(consultasQuery);

  // ─── API: LIC dentro do TMRG ───
  const licQuery = useMemo(() => ({
    dataset: 'inscritos-em-lic-dentro-do-tmrg-180-dias',
    where: "tempo >= '2024-01'",
    select: 'tempo, no_de_doentes_inscritos_sigic, no_de_doentes_inscritos_dentro_do_tmrg_sigic, de_inscritos_em_lic_dentro_do_tmrg',
    orderBy: 'tempo',
    limit: 100,
    groupBy: 'tempo',
  }), []);

  const { data: licAPIData, loading: licLoading, error: licError } = useSNSData(licQuery);

  // ─── Transform: Cirurgias por trimestre (fallback estático) ───
  const cirurgiaChartData = useMemo(() => {
    if (cirurgiaAPIData.length > 0) {
      // Aggregate by tempo (the API with group_by returns aggregated rows)
      const byMonth = new Map<string, number>();
      for (const r of cirurgiaAPIData) {
        const tempo = String(r.tempo);
        const val = Number(r.no_intervencoes_cirurgicas_programadas) || 0;
        byMonth.set(tempo, (byMonth.get(tempo) || 0) + val);
      }
      return Array.from(byMonth.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([periodo, total]) => ({ periodo, total }));
    }
    return [
      { periodo: '2023-Q1', total: staticEixo1.cirurgia_nao_onco.operados_q1_2023 + staticEixo1.oncostop.cirurgias_onco_q1_2023 },
      { periodo: '2024-Q1', total: staticEixo1.cirurgia_nao_onco.operados_q1_2024 + staticEixo1.oncostop.cirurgias_onco_q1_2024 },
      { periodo: '2025-Q1', total: staticEixo1.cirurgia_nao_onco.operados_q1_2025 + staticEixo1.oncostop.cirurgias_onco_q1_2025 },
    ];
  }, [cirurgiaAPIData, staticEixo1]);

  // ─── Transform: Doentes fora TMRG (estáticos dos relatórios) ───
  const tmrgChartData = useMemo(() => [
    { periodo: '2024-05', oncologica: 2645, nao_oncologica: null as number | null },
    { periodo: '2024-08', oncologica: 0, nao_oncologica: null as number | null },
    { periodo: '2024-11', oncologica: 168, nao_oncologica: null as number | null },
    { periodo: '2025-03', oncologica: 180, nao_oncologica: 17149 },
  ], []);

  // ─── Transform: Consultas CTH ───
  const consultasChartData = useMemo(() => {
    if (consultasAPIData.length > 0) {
      const byMonth = new Map<string, { dentro: number; total: number }>();
      for (const r of consultasAPIData) {
        const tempo = String(r.tempo);
        const dentro = Number(r.no_primeiras_ce_prestadas_dentro_do_tmrg) || 0;
        const total = Number(r.no_primeiras_ce_realizadas_com_registo_no_cth) || 0;
        const existing = byMonth.get(tempo) || { dentro: 0, total: 0 };
        byMonth.set(tempo, { dentro: existing.dentro + dentro, total: existing.total + total });
      }
      return Array.from(byMonth.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([periodo, { dentro, total }]) => ({ periodo, dentro_tmrg: dentro, total_cth: total }));
    }
    return [
      { periodo: '2024-Q1', dentro_tmrg: staticEixo1.consultas_especialidade.cth_q1_2024, total_cth: staticEixo1.consultas_especialidade.cth_q1_2024 },
      { periodo: '2025-Q1', dentro_tmrg: staticEixo1.consultas_especialidade.cth_q1_2025, total_cth: staticEixo1.consultas_especialidade.cth_q1_2025 },
    ];
  }, [consultasAPIData, staticEixo1]);

  // ─── Transform: LIC % dentro do TMRG ───
  const licChartData = useMemo(() => {
    if (licAPIData.length > 0) {
      const byMonth = new Map<string, { inscritos: number; dentro: number }>();
      for (const r of licAPIData) {
        const tempo = String(r.tempo);
        const inscritos = Number(r.no_de_doentes_inscritos_sigic) || 0;
        const dentro = Number(r.no_de_doentes_inscritos_dentro_do_tmrg_sigic) || 0;
        const existing = byMonth.get(tempo) || { inscritos: 0, dentro: 0 };
        byMonth.set(tempo, { inscritos: existing.inscritos + inscritos, dentro: existing.dentro + dentro });
      }
      return Array.from(byMonth.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([periodo, { inscritos, dentro }]) => ({
          periodo,
          inscritos_lic: inscritos,
          dentro_tmrg: dentro,
          pct_dentro: inscritos > 0 ? Math.round((dentro / inscritos) * 1000) / 10 : 0,
        }));
    }
    return [];
  }, [licAPIData]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
            <span className="text-orange-600 font-bold">E1</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Resposta a Tempo e Horas</h1>
            <p className="text-sm text-gray-500">Listas de espera cirurgicas e consultas de especialidade</p>
          </div>
        </div>
        <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <strong>Resultados esperados:</strong> Fim das listas de espera de cirurgia oncologica no SNS &middot;
          Alteracao radical das Listas de Espera para Cirurgia e Consultas &middot;
          Cumprimento regular dos TMRG em todo o territorio nacional
        </div>
      </div>

      {/* Cards de estado */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Estado das Medidas ({medidas.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {medidas.map(m => (
            <MedidaCard key={m.id} medida={m} compact />
          ))}
        </div>
      </div>

      {/* Graficos row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Grafico 1: Cirurgias */}
        <ChartWrapper
          titulo="Cirurgias Realizadas"
          subtitulo={cirurgiaAPIData.length > 0 ? 'Intervencoes cirurgicas programadas por mes (dados API)' : 'Comparacao trimestral Q1 (dados dos relatorios GT PETS)'}
          loading={cirurgiaLoading}
          error={cirurgiaError ? undefined : undefined}
          fonte="Transparencia SNS / Relatorios GT PETS"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cirurgiaChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => Number(value).toLocaleString('pt-PT')} />
              <Legend />
              <Bar dataKey="total" name="Total Cirurgias" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Grafico 2: Doentes fora TMRG */}
        <ChartWrapper
          titulo="Doentes Fora do TMRG"
          subtitulo="Doentes oncologicos em LIC que ultrapassaram o tempo maximo de resposta garantido"
          fonte="Relatorios GT PETS (Dez 2024, Abr 2025)"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={tmrgChartData}>
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

      {/* Graficos row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Grafico 3: Consultas CTH */}
        <ChartWrapper
          titulo="Consultas a Tempo e Horas (CTH)"
          subtitulo={consultasAPIData.length > 0 ? 'Primeiras consultas realizadas por mes (dados API)' : 'Comparacao trimestral Q1 (dados dos relatorios)'}
          loading={consultasLoading}
          error={consultasError ? undefined : undefined}
          fonte="Transparencia SNS"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={consultasChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => Number(value).toLocaleString('pt-PT')} />
              <Legend />
              <Bar dataKey="total_cth" name="Total Consultas CTH" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="dentro_tmrg" name="Dentro do TMRG" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* Grafico 4: LIC % dentro TMRG */}
        <ChartWrapper
          titulo="Inscritos em LIC dentro do TMRG"
          subtitulo={licAPIData.length > 0 ? '% de doentes com tempo de espera dentro do limite (dados API)' : 'Sem dados da API disponiveis'}
          loading={licLoading}
          error={licError ? undefined : undefined}
          fonte="Transparencia SNS"
          height={licChartData.length > 0 ? 400 : 200}
        >
          {licChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={licChartData}>
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
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Dados da API em carregamento ou indisponiveis
            </div>
          )}
        </ChartWrapper>
      </div>

      {/* Detalhe das medidas */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Detalhe das Medidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medidas.map(m => (
            <MedidaCard key={m.id} medida={m} />
          ))}
        </div>
      </div>
    </div>
  );
}
