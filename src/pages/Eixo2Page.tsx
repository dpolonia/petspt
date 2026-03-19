import { useState, useMemo } from 'react';
import {
  ResponsiveContainer, ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ReferenceLine,
} from 'recharts';
import ChartWrapper from '../components/charts/ChartWrapper';
import MedidaCard from '../components/eixo/MedidaCard';
import PeriodBackground from '../components/common/PeriodBackground';
import { useSNSData } from '../hooks/useSNSData';
import { getMedidasByEixo } from '../services/staticData';
import AISummary from '../components/eixo/AISummary';
import ChartViewToggle, { ChartView } from '../components/charts/ChartViewToggle';
import { filterFromBaseline, aggregateToQuarterly, cumulativeYearly } from '../services/dataTransform';

export default function Eixo2Page() {
  const medidas = getMedidasByEixo(2);
  const [chartView, setChartView] = useState<ChartView>('mensal');

  // Aggregated: partos + cesarianas per month (national)
  const { data: partosData, loading, error } = useSNSData(useMemo(() => ({
    dataset: 'partos-e-cesarianas',
    select: 'tempo, sum(no_de_partos) as partos, sum(no_de_cesarianas) as cesarianas',
    groupBy: 'tempo',
    orderBy: 'tempo',
    limit: 100,
  }), []));

  const toYM = (t: unknown) => String(t || '').substring(0, 7);

  function applyView<T extends { periodo: string }>(data: T[], fields: string[]): T[] {
    const filtered = filterFromBaseline(data);
    if (chartView === 'trimestral') return aggregateToQuarterly(filtered, fields) as unknown as T[];
    if (chartView === 'cumulativo') return cumulativeYearly(filtered, fields) as unknown as T[];
    return filtered;
  }

  const partosChart = (() => {
    if (partosData.length === 0) return [];
    const raw = partosData.map(r => ({
      periodo: toYM(r.tempo),
      partos: Number(r.partos) || 0,
      cesarianas: Number(r.cesarianas) || 0,
    })).sort((a, b) => a.periodo.localeCompare(b.periodo));
    return applyView(raw, ['partos', 'cesarianas']);
  })();

  const taxaChart = partosChart.map(p => ({
    periodo: p.periodo,
    taxa: p.partos > 0 ? Math.round((p.cesarianas / p.partos) * 1000) / 10 : 0,
  }));

  const snsGravidaData = [
    { destino: 'Urgencia Hospitalar', valor: 79.5, cor: '#ef4444' },
    { destino: 'Cuidados Primarios', valor: 11.6, cor: '#3b82f6' },
    { destino: 'INEM', valor: 4.01, cor: '#f97316' },
    { destino: 'Autocuidados', valor: 3.68, cor: '#22c55e' },
    { destino: 'Consulta Aberta', valor: 1.16, cor: '#8b5cf6' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
            <span className="text-pink-600 font-bold">E2</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Bebes e Maes em Seguranca</h1>
            <p className="text-sm text-gray-500">Saude materno-infantil: partos, maternidades, acompanhamento da gravida</p>
          </div>
        </div>
        <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <strong>Resultados esperados:</strong> Reforco motivacional e organizacional das equipas obstetricas &middot;
          Nova resposta de urgencia para Ginecologia &middot;
          Maior humanizacao nos cuidados perinatais
        </div>
      </div>

      <AISummary eixo={2} />

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
        <ChartWrapper titulo="Partos e Cesarianas no SNS" subtitulo="Total nacional mensal" loading={loading} error={error} fonte="Transparencia SNS — partos-e-cesarianas">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={partosChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <PeriodBackground />
              <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => Number(value).toLocaleString('pt-PT')} />
              <Legend />
              <Bar dataKey="partos" name="Partos" fill="#ec4899" radius={[3, 3, 0, 0]} />
              <Bar dataKey="cesarianas" name="Cesarianas" fill="#f97316" radius={[3, 3, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <ChartWrapper titulo="Taxa de Cesarianas" subtitulo="Percentagem de partos por cesariana (meta: <30%)" loading={loading} error={error} fonte="Transparencia SNS">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={taxaChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <PeriodBackground />
              <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 50]} unit="%" />
              <Tooltip />
              <Legend />
              <ReferenceLine y={30} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Meta 30%', position: 'right', fontSize: 10 }} />
              <Line type="monotone" dataKey="taxa" name="Taxa Cesarianas (%)" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </div>

      <div className="mb-8">
        <ChartWrapper titulo="Linha SNS Gravida — Distribuicao de Encaminhamentos" subtitulo="133.500 chamadas desde o inicio do PETS" fonte="II Relatorio GT PETS (Abril 2025)" height={300}>
          <div className="flex flex-col lg:flex-row items-center gap-8 h-full">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={snsGravidaData} dataKey="valor" nameKey="destino" cx="50%" cy="50%" outerRadius={100}
                  label={(props) => `${props.name}: ${props.value}%`} labelLine={false}>
                  {snsGravidaData.map((entry, i) => <Cell key={i} fill={entry.cor} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 text-sm min-w-[200px]">
              {snsGravidaData.map(d => (
                <div key={d.destino} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.cor }} />
                  <span className="text-gray-700">{d.destino}: <strong>{d.valor}%</strong></span>
                </div>
              ))}
              <div className="mt-2 text-xs text-gray-400">Total: 133.500 chamadas &middot; 36.500 gravidas retiradas das urgencias</div>
            </div>
          </div>
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
