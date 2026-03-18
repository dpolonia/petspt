import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            <span className="font-semibold text-gray-700">PETS Monitor</span>
            <span className="ml-2">Portal independente de monitorizacao do Plano de Emergencia e Transformacao da Saude</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/sobre" className="hover:text-gray-700">Sobre</Link>
            <Link to="/transversais" className="hover:text-gray-700">Transversais</Link>
            <a href="https://github.com/dpolonia/petspt" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">GitHub</a>
            <a href="https://transparencia.sns.gov.pt" target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">Transparencia SNS</a>
          </div>
        </div>
        <div className="mt-3 text-center text-[10px] text-gray-400">
          Dados API actualizados mensalmente &middot; Dados estaticos: Relatorios GT PETS (Dez 2024, Abr 2025)
          &middot; Codigo aberto sob licenca MIT
        </div>
      </div>
    </footer>
  );
}
