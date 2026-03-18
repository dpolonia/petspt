import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Eixo1Page from './pages/Eixo1Page';
import Eixo2Page from './pages/Eixo2Page';
import Eixo3Page from './pages/Eixo3Page';
import Eixo4Page from './pages/Eixo4Page';
import Eixo5Page from './pages/Eixo5Page';

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
            <Route path="/eixo/4" element={<Eixo4Page />} />
            <Route path="/eixo/5" element={<Eixo5Page />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
