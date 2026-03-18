import { useMemo } from 'react';
import {
  ResponsiveContainer, ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import ChartWrapper from '../components/charts/ChartWrapper';
import MedidaCard from '../components/eixo/MedidaCard';
import PeriodBackground from '../components/common/PeriodBackground';
import { useSNSData } from '../hooks/useSNSData';
import { getMedidasByEixo } from '../services/staticData';
import { toMultiSeries } from '../services/dataTransform';

export default function Eixo3Page() {
  const medidas = getMedidasByEixo(3);

  // ─── API: SNS24 ───
  // Fields: periodo, indicador, valor
  const sns24Query = useMemo(() => ({
    dataset: 'atividade-operacional-do-sns-24',
    where: "periodo >= '2024-01' and indicador = 'Chamadas Atendidas'",
    orderBy: 'periodo',
    limit: 100,
  }), []);
  const { data: sns24Data, loading: sns24Loading, error: sns24Error } = useSNSData(sns24Query);

  // ─── API: Urgencias por tipo ───
  // Fields: tempo, instituicao, urgencias_geral, urgencias_pediatricas, urgencia_obstetricia, total_urgencias
  const urgenciasQuery = useMemo(() => ({
    dataset: 'atendimentos-por-tipo-de-urgencia-hospitalar-link',
    where: "tempo >= '2024-01'",
    orderBy: 'tempo',
    limit: 100,
  }), []);
  const { data: urgenciasData, loading: urgenciasLoading, error: urgenciasError } = useSNSData(urgenciasQuery);

  // ─── Transform: SNS24 chamadas ───
  const sns24ChartData = useMemo(() => {
    if (sns24Data.length === 0) return [];
    const byMonth = new Map<string, number>();
    for (const r of sns24Data) {
      const p = String(r.periodo);
      byMonth.set(p, (byMonth.get(p) || 0) + Number(r.valor || 0));
    }
    return Array.from(byMonth.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([periodo, valor]) => ({ periodo, chamadas: valor }));
  }, [sns24Data]);

  // ─── Transform: Urgências por tipo ───
  const urgenciasChartData = useMemo(() => {
    if (urgenciasData.length === 0) return [];
    return toMultiSeries(urgenciasData, {
      geral: 'urgencias_geral',
      pediatrica: 'urgencias_pediatricas',
      obstetricia: 'urgencia_obstetricia',
    }, 'tempo');
  }, [urgenciasData]);

  // ─── CAC — dados estáticos ───
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
      {/* Header */}
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
          Novos espacos CSP para consultas de urgencia diferidas &middot;
          Diminuicao de internamentos sociais &middot;
          Requalificacao dos Servicos de Urgencia
        </div>
      </div>

      {/* Cards medidas */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Estado das Medidas ({medidas.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {medidas.map(m => <MedidaCard key={m.id} medida={m} compact />)}
        </div>
      </div>

      {/* Graficos row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* G1: CAC */}
        <ChartWrapper
          titulo="Centros de Atendimento Clinico (CAC)"
          subtitulo="Atendimentos mensais e n.o de CAC operacionais"
          fonte="Relatorios GT PETS (Dez 2024, Abr 2025)"
        >
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

        {/* G2: Urgências por tipo */}
        <ChartWrapper
          titulo="Atendimentos em Urgencia por Tipo"
          subtitulo="Distribuicao mensal: geral, pediatrica e obstetricia"
          loading={urgenciasLoading}
          error={urgenciasError}
          fonte="Transparencia SNS — atendimentos-por-tipo-de-urgencia-hospitalar-link"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={urgenciasChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <PeriodBackground />
              <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="geral" name="Geral" fill="#ef4444" stackId="a" />
              <Bar dataKey="pediatrica" name="Pediatrica" fill="#3b82f6" stackId="a" />
              <Bar dataKey="obstetricia" name="Obstetricia" fill="#ec4899" stackId="a" />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      {/* G3: SNS24 */}
      <div className="mb-8">
        <ChartWrapper
          titulo="Atividade SNS24 — Chamadas Atendidas"
          subtitulo="Volume mensal de chamadas atendidas pela linha SNS24"
          loading={sns24Loading}
          error={sns24Error}
          fonte="Transparencia SNS — atividade-operacional-do-sns-24"
          height={350}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={sns24ChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <PeriodBackground />
              <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="chamadas" name="Chamadas Atendidas" fill="#6366f1" radius={[3, 3, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      {/* Destaques numericos */}
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

      {/* Detalhe medidas */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Detalhe das Medidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medidas.map(m => <MedidaCard key={m.id} medida={m} />)}
        </div>
      </div>
    </div>
  );
}
