import { Link, useLocation } from 'react-router-dom';
import { getScorecard } from '../../services/staticData';

const EIXOS = [
  { num: 1, nome: 'Tempo e Horas', short: 'E1' },
  { num: 2, nome: 'Maes e Bebes', short: 'E2' },
  { num: 3, nome: 'Urgencia', short: 'E3' },
  { num: 4, nome: 'CSP', short: 'E4' },
  { num: 5, nome: 'Saude Mental', short: 'E5' },
];

export default function Navbar() {
  const location = useLocation();
  const scorecard = getScorecard();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">PT</span>
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm">PETS</span>
              <span className="text-gray-400 text-xs ml-1 hidden sm:inline">Monitor</span>
            </div>
          </Link>

          <div className="flex items-center gap-1">
            {EIXOS.map(e => {
              const isActive = location.pathname === `/eixo/${e.num}`;
              return (
                <Link
                  key={e.num}
                  to={`/eixo/${e.num}`}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                    ${isActive
                      ? 'bg-orange-100 text-orange-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <span className="hidden md:inline">{e.nome}</span>
                  <span className="md:hidden">{e.short}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3 text-xs">
            <span className="text-green-600 font-semibold">{scorecard.concluidas} done</span>
            <span className="text-yellow-600 font-semibold">{scorecard.em_curso} wip</span>
            <span className="text-red-600 font-semibold">{scorecard.nao_implementadas + scorecard.parciais} pending</span>
            <span className="text-gray-400">/ {scorecard.total}</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
