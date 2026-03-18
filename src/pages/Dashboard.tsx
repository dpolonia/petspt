import KPICard from '../components/charts/KPICard';
import { STATIC_DATA, getScorecard } from '../services/staticData';
import { PERIODS } from '../config/periods';

export default function Dashboard() {
  const scorecard = getScorecard();
  const kpis = STATIC_DATA.kpis;
  const today = new Date().toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });

  const now = new Date().toISOString().split('T')[0];
  const currentPeriod = PERIODS.find(p => {
    const end = p.end === 'now' ? now : p.end;
    return now >= p.start && now <= end;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Plano de Emergencia e Transformacao da Saude
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitorizacao em tempo real &middot; Dados actualizados a {today}
        </p>
        {currentPeriod && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
               style={{ backgroundColor: currentPeriod.color }}>
            {currentPeriod.label}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {Object.entries(kpis).map(([key, kpi], i) => (
          <KPICard key={key} eixo={i + 1} {...kpi} />
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Estado Global das {scorecard.total} Medidas</h2>
        <div className="flex gap-1 h-8 rounded-full overflow-hidden mb-3">
          <div className="bg-green-500 transition-all" style={{ width: `${(scorecard.concluidas / scorecard.total) * 100}%` }} />
          <div className="bg-yellow-500 transition-all" style={{ width: `${(scorecard.em_curso / scorecard.total) * 100}%` }} />
          <div className="bg-orange-500 transition-all" style={{ width: `${(scorecard.parciais / scorecard.total) * 100}%` }} />
          <div className="bg-red-500 transition-all" style={{ width: `${(scorecard.nao_implementadas / scorecard.total) * 100}%` }} />
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500" /> {scorecard.concluidas} Concluidas</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-500" /> {scorecard.em_curso} Em Curso</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500" /> {scorecard.parciais} Parciais</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500" /> {scorecard.nao_implementadas} Nao Implementadas</span>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Periodos de Referencia nos Graficos</h2>
        <div className="flex flex-wrap gap-4">
          {PERIODS.map(p => (
            <div key={p.id} className="flex items-center gap-2">
              <div className="w-6 h-4 rounded" style={{ backgroundColor: p.color }} />
              <span className="text-xs text-gray-600">{p.label} ({p.start} &ndash; {p.end === 'now' ? 'hoje' : p.end})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
