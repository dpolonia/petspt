import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import Eixo1Page from './pages/Eixo1Page';
import Eixo2Page from './pages/Eixo2Page';
import Eixo3Page from './pages/Eixo3Page';
import Eixo4Page from './pages/Eixo4Page';
import Eixo5Page from './pages/Eixo5Page';
import TransversaisPage from './pages/TransversaisPage';
import SobrePage from './pages/SobrePage';
import ComparadorPage from './pages/ComparadorPage';
import ProspectivaPage from './pages/ProspectivaPage';
import BenchmarkingPage from './pages/BenchmarkingPage';
import CenariosPage from './pages/CenariosPage';
import AlertasPage from './pages/AlertasPage';
import EuropaPage from './pages/EuropaPage';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/eixo/1" element={<Eixo1Page />} />
              <Route path="/eixo/2" element={<Eixo2Page />} />
              <Route path="/eixo/3" element={<Eixo3Page />} />
              <Route path="/eixo/4" element={<Eixo4Page />} />
              <Route path="/eixo/5" element={<Eixo5Page />} />
              <Route path="/transversais" element={<TransversaisPage />} />
              <Route path="/sobre" element={<SobrePage />} />
              <Route path="/comparador" element={<ComparadorPage />} />
              <Route path="/prospectiva" element={<ProspectivaPage />} />
              <Route path="/benchmarking" element={<BenchmarkingPage />} />
              <Route path="/cenarios" element={<CenariosPage />} />
              <Route path="/alertas" element={<AlertasPage />} />
              <Route path="/europa" element={<EuropaPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
