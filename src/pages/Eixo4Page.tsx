import { useMemo } from 'react';
import {
  ResponsiveContainer, ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';
import ChartWrapper from '../components/charts/ChartWrapper';
import MedidaCard from '../components/eixo/MedidaCard';
import PeriodBackground from '../components/common/PeriodBackground';
import { useSNSData } from '../hooks/useSNSData';
import { getMedidasByEixo } from '../services/staticData';
import { toMultiSeries } from '../services/dataTransform';

export default function Eixo4Page() {
  const medidas = getMedidasByEixo(4);

  // ─── API: Utentes CSP ───
  // Fields: periodo, ars, aces, utentes_inscritos_csp, total_utentes_com_mdf_atribuido,
  //   total_utentes_sem_mdf_atribuido, total_utentes_sem_mdf_atribuido0 (%)
  const utentesQuery = useMemo(() => ({
    dataset: 'utentes-inscritos-em-cuidados-de-saude-primarios',
    where: "periodo >= '2024-01'",
    orderBy: 'periodo',
    limit: 100,
  }), []);
  const { data: utentesData, loading: utentesLoading, error: utentesError } = useSNSData(utentesQuery);

  // ─── API: Rastreios oncológicos ───
  // Fields: tempo, regiao, area_csp, proporcao_mulheres_50_70_a_c_mamogr_2_anos,
  //   proporcao_mulheres_25_60_a_c_colpoc_atuali, proporcao_utentes_50_75_a_c_rastreio_cancro_cr
  const rastreiosQuery = useMemo(() => ({
    dataset: 'rastreios-oncologicos',
    where: "tempo >= '2023-01'",
    orderBy: 'tempo',
    limit: 100,
    groupBy: 'tempo',
    select: 'tempo, avg(proporcao_mulheres_50_70_a_c_mamogr_2_anos) as mama, avg(proporcao_mulheres_25_60_a_c_colpoc_atuali) as colo, avg(proporcao_utentes_50_75_a_c_rastreio_cancro_cr) as colorretal',
  }), []);
  const { data: rastreiosData, loading: rastreiosLoading, error: rastreiosError } = useSNSData(rastreiosQuery);

  // ─── Transform: Utentes sem MdF evolução ───
  const utentesChartData = useMemo(() => {
    if (utentesData.length === 0) return [];
    return toMultiSeries(utentesData, {
      sem_mdf: 'total_utentes_sem_mdf_atribuido',
      com_mdf: 'total_utentes_com_mdf_atribuido',
    }, 'periodo');
  }, [utentesData]);

  // ─── Transform: % sem MdF evolução ───
  const pctSemMdfData = useMemo(() => {
    return utentesChartData.map(p => ({
      periodo: p.periodo,
      pct_sem_mdf: (p.sem_mdf as number) > 0 && (p.com_mdf as number) > 0
        ? Math.round(((p.sem_mdf as number) / ((p.sem_mdf as number) + (p.com_mdf as number))) * 1000) / 10
        : 0,
    }));
  }, [utentesChartData]);

  // ─── Transform: Rastreios ───
  const rastreiosChartData = useMemo(() => {
    if (rastreiosData.length > 0) {
      return rastreiosData
        .map(r => ({
          periodo: String(r.tempo),
          mama: Math.round(Number(r.mama || 0) * 10) / 10,
          colo: Math.round(Number(r.colo || 0) * 10) / 10,
          colorretal: Math.round(Number(r.colorretal || 0) * 10) / 10,
        }))
        .sort((a, b) => a.periodo.localeCompare(b.periodo));
    }
    // Fallback estático
    return [
      { periodo: '2023-12', mama: 54.74, colo: 54.96, colorretal: 56.33 },
      { periodo: '2024-12', mama: 65.42, colo: 59.66, colorretal: 58.42 },
    ];
  }, [rastreiosData]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-bold">E4</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Saude Proxima e Familiar</h1>
            <p className="text-sm text-gray-500">Cuidados de Saude Primarios: medicos de familia, rastreios, USF</p>
          </div>
        </div>
        <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <strong>Resultados esperados:</strong> MdF atribuido a 350.000 pessoas via parceria social &middot;
          MdF em mais de 100 concelhos &middot; 20 USF tipo C &middot;
          Reforco de meios tecnicos nos CSP
        </div>
      </div>

      {/* Cards medidas */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Estado das Medidas ({medidas.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {medidas.map(m => <MedidaCard key={m.id} medida={m} compact />)}
        </div>
      </div>

      {/* G1: Utentes sem MdF */}
      <div className="mb-6">
        <ChartWrapper
          titulo="Utentes sem Medico de Familia — Evolucao Nacional"
          subtitulo="Total de utentes inscritos nos CSP sem medico de familia atribuido"
          loading={utentesLoading}
          error={utentesError}
          fonte="Transparencia SNS — utentes-inscritos-em-cuidados-de-saude-primarios"
          height={400}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={utentesChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <PeriodBackground />
              <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => Number(value).toLocaleString('pt-PT')} />
              <Legend />
              <Bar dataKey="sem_mdf" name="Sem MdF" fill="#ef4444" radius={[3, 3, 0, 0]} />
              <Bar dataKey="com_mdf" name="Com MdF" fill="#22c55e" radius={[3, 3, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* G2: % sem MdF */}
        <ChartWrapper
          titulo="% Utentes sem Medico de Familia"
          subtitulo="Percentagem de utentes inscritos sem MdF atribuido"
          loading={utentesLoading}
          error={utentesError}
          fonte="Transparencia SNS"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={pctSemMdfData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <PeriodBackground />
              <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 30]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pct_sem_mdf" name="% sem MdF" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
              <ReferenceLine y={0} stroke="#22c55e" strokeDasharray="5 5" label={{ value: 'Meta: 0%', position: 'right', fontSize: 10 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>

        {/* G3: Rastreios */}
        <ChartWrapper
          titulo="Cobertura de Rastreios Oncologicos"
          subtitulo="Media nacional de cobertura por tipo de rastreio"
          loading={rastreiosLoading}
          error={rastreiosError}
          fonte={rastreiosData.length > 0 ? 'Transparencia SNS — rastreios-oncologicos' : 'Relatorios GT PETS'}
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={rastreiosChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <PeriodBackground />
              <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="%" domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="mama" name="Mama" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="colo" name="Colo do Utero" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="colorretal" name="Colorretal" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      {/* Mini-cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">1,6M</div>
          <div className="text-xs text-gray-500 mt-1">Utentes sem MdF</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">323.674</div>
          <div className="text-xs text-gray-500 mt-1">Consultas Batas Brancas</div>
          <div className="text-xs text-gray-400">+49,8% vs. anterior</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">19</div>
          <div className="text-xs text-gray-500 mt-1">Candidaturas USF-C</div>
          <div className="text-xs text-gray-400">~191.000 utentes estimados</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">248</div>
          <div className="text-xs text-gray-500 mt-1">Medicos Aposentados</div>
          <div className="text-xs text-gray-400">207 (2024) + 41 (Q1 2025)</div>
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
