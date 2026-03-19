import { useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);

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

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {EIXOS.map(e => {
              const isActive = location.pathname === `/eixo/${e.num}`;
              return (
                <Link
                  key={e.num}
                  to={`/eixo/${e.num}`}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                    ${isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                >
                  {e.nome}
                </Link>
              );
            })}
            <Link
              to="/comparador"
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                ${location.pathname === '/comparador' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              Comparador
            </Link>
            <Link
              to="/prospectiva"
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                ${location.pathname === '/prospectiva' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              Prospectiva
            </Link>
            <Link
              to="/benchmarking"
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                ${location.pathname === '/benchmarking' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              Benchmarking
            </Link>
            <Link
              to="/cenarios"
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                ${location.pathname === '/cenarios' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              Cenarios
            </Link>
            <Link
              to="/alertas"
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                ${location.pathname === '/alertas' ? 'bg-red-100 text-red-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              Alertas
            </Link>
            <Link
              to="/transversais"
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                ${location.pathname === '/transversais' ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              Transversais
            </Link>
            <Link
              to="/sobre"
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors
                ${location.pathname === '/sobre' ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              Sobre
            </Link>
          </div>

          {/* Desktop scorecard */}
          <div className="hidden lg:flex items-center gap-3 text-xs">
            <span className="text-green-600 font-semibold">{scorecard.concluidas} done</span>
            <span className="text-yellow-600 font-semibold">{scorecard.em_curso} wip</span>
            <span className="text-gray-400">/ {scorecard.total}</span>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-3 border-t border-gray-100 mt-1 pt-2">
            <div className="grid grid-cols-3 gap-1">
              {EIXOS.map(e => (
                <Link
                  key={e.num}
                  to={`/eixo/${e.num}`}
                  onClick={() => setMenuOpen(false)}
                  className={`px-2 py-2 rounded-md text-xs font-medium text-center transition-colors
                    ${location.pathname === `/eixo/${e.num}` ? 'bg-orange-100 text-orange-700' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  {e.short} {e.nome}
                </Link>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1 mt-2">
              <Link to="/comparador" onClick={() => setMenuOpen(false)}
                className="px-2 py-2 rounded-md text-xs font-medium text-center text-gray-500 hover:bg-gray-50">
                Comparador
              </Link>
              <Link to="/prospectiva" onClick={() => setMenuOpen(false)}
                className="px-2 py-2 rounded-md text-xs font-medium text-center text-gray-500 hover:bg-gray-50">
                Prospectiva
              </Link>
              <Link to="/benchmarking" onClick={() => setMenuOpen(false)}
                className="px-2 py-2 rounded-md text-xs font-medium text-center text-gray-500 hover:bg-gray-50">
                Benchmarking
              </Link>
              <Link to="/cenarios" onClick={() => setMenuOpen(false)}
                className="px-2 py-2 rounded-md text-xs font-medium text-center text-gray-500 hover:bg-gray-50">
                Cenarios
              </Link>
              <Link to="/alertas" onClick={() => setMenuOpen(false)}
                className="px-2 py-2 rounded-md text-xs font-medium text-center text-gray-500 hover:bg-gray-50">
                Alertas
              </Link>
              <Link to="/transversais" onClick={() => setMenuOpen(false)}
                className="px-2 py-2 rounded-md text-xs font-medium text-center text-gray-500 hover:bg-gray-50">
                Transversais
              </Link>
              <Link to="/sobre" onClick={() => setMenuOpen(false)}
                className="px-2 py-2 rounded-md text-xs font-medium text-center text-gray-500 hover:bg-gray-50">
                Sobre
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
