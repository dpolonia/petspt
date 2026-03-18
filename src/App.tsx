import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Placeholder({ title }: { title: string }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      <p className="mt-2 text-gray-500">Em construção — Sprint 1+</p>
    </div>
  );
}

function Nav() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-6">
      <Link to="/" className="text-lg font-bold text-orange-600">PETS Portal</Link>
      <Link to="/eixo/1" className="text-sm text-gray-600 hover:text-orange-600">Eixo 1</Link>
      <Link to="/eixo/2" className="text-sm text-gray-600 hover:text-orange-600">Eixo 2</Link>
      <Link to="/eixo/3" className="text-sm text-gray-600 hover:text-orange-600">Eixo 3</Link>
      <Link to="/eixo/4" className="text-sm text-gray-600 hover:text-orange-600">Eixo 4</Link>
      <Link to="/eixo/5" className="text-sm text-gray-600 hover:text-orange-600">Eixo 5</Link>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <Routes>
          <Route path="/" element={<Placeholder title="Dashboard — Plano de Emergência e Transformação da Saúde" />} />
          <Route path="/eixo/1" element={<Placeholder title="Eixo 1 — Resposta a Tempo e Horas" />} />
          <Route path="/eixo/2" element={<Placeholder title="Eixo 2 — Bebés e Mães em Segurança" />} />
          <Route path="/eixo/3" element={<Placeholder title="Eixo 3 — Cuidados Urgentes e Emergentes" />} />
          <Route path="/eixo/4" element={<Placeholder title="Eixo 4 — Saúde Próxima e Familiar" />} />
          <Route path="/eixo/5" element={<Placeholder title="Eixo 5 — Saúde Mental" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
