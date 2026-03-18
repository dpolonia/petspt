import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Eixo1Page from './pages/Eixo1Page';
import Eixo2Page from './pages/Eixo2Page';
import Eixo3Page from './pages/Eixo3Page';

function Placeholder({ title }: { title: string }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <p className="mt-2 text-gray-500">Em construcao — proximos sprints</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/eixo/1" element={<Eixo1Page />} />
            <Route path="/eixo/2" element={<Eixo2Page />} />
            <Route path="/eixo/3" element={<Eixo3Page />} />
            <Route path="/eixo/4" element={<Placeholder title="Eixo 4 — Saude Proxima e Familiar" />} />
            <Route path="/eixo/5" element={<Placeholder title="Eixo 5 — Saude Mental" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
