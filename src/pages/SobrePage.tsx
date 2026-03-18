import { PERIODS } from '../config/periods';

const DATASETS = [
  { nome: 'intervencoes-cirurgicas', eixo: 'E1', desc: 'Cirurgias programadas por instituicao', periodo: '2013-2025' },
  { nome: 'inscritos-em-lic-dentro-do-tmrg-180-dias', eixo: 'E1', desc: 'Lista de espera cirurgica (TMRG)', periodo: '2024-2025' },
  { nome: 'consultas-em-tempo-real', eixo: 'E1', desc: 'Consultas CTH por instituicao', periodo: '2024-2025' },
  { nome: 'atividade-operacional-do-sns-24', eixo: 'E1,E3', desc: 'Chamadas SNS24', periodo: '2021-2026' },
  { nome: 'partos-e-cesarianas', eixo: 'E2', desc: 'Partos e cesarianas por instituicao', periodo: '2013-presente' },
  { nome: 'atendimentos-por-tipo-de-urgencia-hospitalar-link', eixo: 'E3', desc: 'Urgencias por tipo', periodo: '2024-2025' },
  { nome: 'lotacao-praticada-por-tipo-de-cama', eixo: 'E3,E5', desc: 'Camas hospitalares por tipo', periodo: '2015-2025' },
  { nome: 'ocupacao-do-internamento', eixo: 'E3', desc: 'Taxa de ocupacao hospitalar', periodo: '2024-presente' },
  { nome: 'utentes-inscritos-em-cuidados-de-saude-primarios', eixo: 'E4', desc: 'Utentes CSP e medicos de familia', periodo: '2016-2026' },
  { nome: 'rastreios-oncologicos', eixo: 'E4', desc: 'Cobertura rastreios mama/colo/colorretal', periodo: '2015-2026' },
];

export default function SobrePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Sobre o Portal</h1>

      {/* Sobre */}
      <section className="mb-10">
        <p className="text-gray-700 leading-relaxed">
          O portal <strong>PETS Monitor</strong> e uma ferramenta independente de monitorizacao em tempo real
          da execucao do Plano de Emergencia e Transformacao da Saude (PETS), publicado pelo
          Ministerio da Saude do Governo de Portugal em 29 de Maio de 2024.
        </p>
        <p className="text-gray-700 leading-relaxed mt-3">
          O PETS define 54 medidas organizadas em 5 eixos estrategicos e 16 programas transversais,
          com o objectivo de transformar o Servico Nacional de Saude portugues. Este portal agrega
          dados publicos das APIs do SNS e dos relatorios oficiais do Grupo de Trabalho de Acompanhamento,
          apresentando-os de forma acessivel e transparente.
        </p>
      </section>

      {/* Fontes de Dados */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Fontes de Dados</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Dataset</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Eixo</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Descricao</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Periodo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {DATASETS.map(d => (
                <tr key={d.nome} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-mono text-xs text-blue-600">{d.nome}</td>
                  <td className="px-3 py-2 text-xs text-gray-600">{d.eixo}</td>
                  <td className="px-3 py-2 text-xs text-gray-600">{d.desc}</td>
                  <td className="px-3 py-2 text-xs text-gray-500">{d.periodo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          API: <a href="https://transparencia.sns.gov.pt" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">transparencia.sns.gov.pt</a> (ODS v2.1, acesso publico)
          &nbsp;&middot;&nbsp; Dados estaticos: Relatorios GT PETS (Dez 2024, Abr 2025)
        </p>
      </section>

      {/* Metodologia */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Metodologia</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <p><strong>Dados API:</strong> Recolhidos em tempo real via API Transparencia SNS (protocolo ODS v2.1). Cada pedido e cacheado durante 6 horas no servidor (Firestore) e 30 minutos no browser.</p>
          <p><strong>Dados estaticos:</strong> Extraidos manualmente dos Relatorios do Grupo de Trabalho de Acompanhamento do PETS, publicados em Dezembro de 2024 e Abril de 2025. Estes dados complementam a API quando nao existe dataset disponivel.</p>
          <p><strong>Frequencia de actualizacao:</strong> Os datasets da API sao actualizados mensalmente pelo SNS. Os dados estaticos sao actualizados quando e publicado um novo relatorio do GT.</p>
          <p><strong>Estado das medidas:</strong> A classificacao semaforo (concluida, em curso, parcial, nao implementada) baseia-se na avaliacao do GT PETS no II Relatorio de Progresso (Abril 2025).</p>
        </div>
      </section>

      {/* Periodos */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Periodos Cromaticos</h2>
        <p className="text-sm text-gray-700 mb-3">
          Os graficos do portal utilizam tres faixas cromaticas de fundo para contextualizar temporalmente os dados:
        </p>
        <div className="space-y-2">
          {PERIODS.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
              <div className="w-12 h-8 rounded" style={{ backgroundColor: p.color }} />
              <div>
                <div className="text-sm font-medium text-gray-800">{p.label}</div>
                <div className="text-xs text-gray-500">{p.start} &ndash; {p.end === 'now' ? 'presente' : p.end}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* O Plano PETS */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">O Plano PETS</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <p>O Plano de Emergencia e Transformacao da Saude foi apresentado em 29 de Maio de 2024 pelo Ministerio da Saude, sob coordenacao de <strong>Eurico Castro Alves</strong>.</p>
          <p>O Grupo de Trabalho de Acompanhamento, coordenado por <strong>Carlos Robalo Cordeiro</strong>, integra 10 membros e publica relatorios periodicos de progresso.</p>
          <div className="bg-gray-50 rounded-lg p-4 mt-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div><div className="text-xl font-bold text-orange-600">54</div><div className="text-xs text-gray-500">Medidas</div></div>
              <div><div className="text-xl font-bold text-red-600">15</div><div className="text-xs text-gray-500">Urgentes</div></div>
              <div><div className="text-xl font-bold text-amber-600">24</div><div className="text-xs text-gray-500">Prioritarias</div></div>
              <div><div className="text-xl font-bold text-blue-600">15</div><div className="text-xs text-gray-500">Estruturantes</div></div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Legislacao base: Despacho Ministerial 10208-A/2024</p>
        </div>
      </section>

      {/* Codigo Aberto */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Codigo Aberto</h2>
        <p className="text-sm text-gray-700">
          Este portal e open source. O codigo e os dados podem ser auditados, replicados e melhorados por qualquer cidadao.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <a
            href="https://github.com/dpolonia/petspt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
          >
            GitHub &mdash; dpolonia/petspt
          </a>
          <span className="text-xs text-gray-500">Licenca MIT</span>
        </div>
      </section>
    </div>
  );
}
