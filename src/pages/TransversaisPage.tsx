interface ProgramaTransversal {
  codigo: string;
  nome: string;
  categoria: string;
  descricao: string;
  legislacao?: string;
  destaques?: string[];
}

const CATEGORIAS = [
  { id: 'contingencia', nome: 'Programas de Contingencia', cor: 'bg-amber-500', corLight: 'bg-amber-50', corText: 'text-amber-700' },
  { id: 'avaliacao', nome: 'Programas de Avaliacao', cor: 'bg-emerald-500', corLight: 'bg-emerald-50', corText: 'text-emerald-700' },
  { id: 'eficiencia', nome: 'Programas de Eficiencia', cor: 'bg-blue-500', corLight: 'bg-blue-50', corText: 'text-blue-700' },
  { id: 'medicamento', nome: 'Programas de Medicamento', cor: 'bg-purple-500', corLight: 'bg-purple-50', corText: 'text-purple-700' },
  { id: 'clinicos', nome: 'Programas Clinicos Prioritarios', cor: 'bg-red-500', corLight: 'bg-red-50', corText: 'text-red-700' },
];

const PROGRAMAS: ProgramaTransversal[] = [
  { codigo: 'A', nome: 'Plano de Verao 2024', categoria: 'contingencia', descricao: 'Plano de contingencia para periodos de elevadas temperaturas, com foco na protecao de populacoes vulneraveis e prevencao de mortalidade associada a ondas de calor.' },
  { codigo: 'B', nome: 'Plano de Inverno 2024', categoria: 'contingencia', descricao: 'Plano de contingencia para o periodo sazonal de inverno, focado em doentes com comorbilidades respiratorias e patologias agravadas pelo frio.' },
  { codigo: 'C', nome: 'Programa de Valorizacao dos Profissionais de Saude', categoria: 'contingencia', descricao: 'Formacao continua, ambientes de trabalho saudaveis, remuneracao baseada no desempenho, autonomia tecnica e planos de carreira estruturados para profissionais do SNS.', destaques: ['Formacao continua obrigatoria', 'Remuneracao por desempenho', 'Autonomia tecnica e organizativa', 'Plano de carreira estruturado'] },
  { codigo: 'D', nome: 'Plano de Preparacao e Resposta a Catastrofes', categoria: 'contingencia', descricao: 'Tipificacao de riscos, plano de accao e resposta rapida, vigilancia e detecao precoce. Articulacao com DGS, Protecao Civil, INEM e Forcas de Seguranca.' },
  { codigo: 'E', nome: 'Reativacao do SINAS', categoria: 'avaliacao', descricao: 'Reativacao e desenvolvimento do Sistema Nacional de Avaliacao em Saude, criado em 2007 pela ERS, para avaliacao da qualidade dos prestadores de cuidados.' },
  { codigo: 'F', nome: 'Programa Cliente Misterio', categoria: 'avaliacao', descricao: 'Parceria com associacoes de doentes para monitorizacao imparcial da qualidade dos servicos de saude atraves de "clientes misterio".' },
  { codigo: 'G', nome: 'Monitorizacao dos Conselhos de Administracao', categoria: 'avaliacao', descricao: 'Sistema transparente de indicadores e objectivos mensuraveis para avaliacao da gestao das instituicoes publicas de saude, com regime sancionatorio e de incentivos.' },
  { codigo: 'H', nome: 'Financiamento e Contratacao Plurianual', categoria: 'eficiencia', descricao: 'Plano de financiamento estavel e plurianual para instituicoes do SNS e parceiros, incluindo aceleracao do PRR.' },
  { codigo: 'I', nome: 'Ganhos de Eficiencia e Combate ao Desperdicio', categoria: 'eficiencia', descricao: 'Grupo de coordenacao para monitorizacao de indicadores de desempenho, com publicacao periodica de resultados e promocao de competicao positiva.' },
  { codigo: 'J', nome: 'Saude Digital Integrada', categoria: 'eficiencia', descricao: 'Registo de Saude Eletronico unico, teleconsulta, sistema de gestao de capacidades em tempo real e interoperabilidade HL7/FHIR/SNOMED-CT entre sistemas publicos, sociais e privados.', destaques: ['RSE unico cross-entidade', 'Teleconsulta via farmacias comunitarias', 'Gestao capacidades em tempo real', 'Interoperabilidade HL7/FHIR'] },
  { codigo: 'K', nome: 'Reserva Estrategica de Medicamentos e Equipamentos', categoria: 'medicamento', descricao: 'Candidatura aprovada pela Comissao Europeia (31/Out/2023) para criacao de stock estrategico. Financiamento de 146 milhoes de euros ao longo de 33 meses.', legislacao: 'Candidatura UE aprovada 31/10/2023 - 146M EUR / 33 meses' },
  { codigo: 'L', nome: 'Implementacao Total do SiNATS', categoria: 'medicamento', descricao: 'Sistema Nacional de Avaliacao de Tecnologias da Saude, criado em 2015, para avaliacao rigorosa de medicamentos e dispositivos medicos. Tempo medio actual de decisao: 702 dias (vs. objetivo de <365 dias).' },
  { codigo: 'M', nome: 'Doencas Neurodegenerativas e Oncologicas', categoria: 'clinicos', descricao: 'Programa multidisciplinar centrado na prevencao, detecao precoce e tratamento de doencas neurodegenerativas e oncologicas.' },
  { codigo: 'N', nome: 'Combate e Controlo da Obesidade', categoria: 'clinicos', descricao: 'Acesso equitativo ao tratamento medico, cirurgico e farmacologico da obesidade. Parcerias com setor privado, regulacao de tratamentos e promocao de literacia em saude.', destaques: ['Reducao de 200 doencas associadas e 13 tipos de cancro'] },
  { codigo: 'O', nome: 'Investigacao Clinica e Ensaios Clinicos', categoria: 'clinicos', descricao: 'Programa de apoio a investigacao clinica: formacao, optimizacao de processos, ferramentas digitais e maior autonomia dos Centros de Investigacao.' },
  { codigo: 'P', nome: 'Prevencao da Doenca e Promocao da Saude', categoria: 'clinicos', descricao: 'Promocao de estilos de vida saudaveis, prevencao de factores de risco e capacitacao dos cidadaos para escolhas informadas.' },
];

export default function TransversaisPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Programas Transversais</h1>
        <p className="text-sm text-gray-500 mt-1">
          16 programas em 5 categorias que complementam os 5 eixos estrategicos do PETS
        </p>
      </div>

      {CATEGORIAS.map(cat => {
        const progs = PROGRAMAS.filter(p => p.categoria === cat.id);
        return (
          <div key={cat.id} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-1.5 h-6 rounded-full ${cat.cor}`} />
              <h2 className={`text-lg font-semibold ${cat.corText}`}>{cat.nome}</h2>
              <span className="text-xs text-gray-400 ml-2">{progs.length} programas</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {progs.map(p => (
                <div key={p.codigo} className={`rounded-lg border border-gray-200 overflow-hidden`}>
                  <div className={`h-1 ${cat.cor}`} />
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <span className={`flex-shrink-0 w-8 h-8 rounded-lg ${cat.corLight} ${cat.corText} flex items-center justify-center font-bold text-sm`}>
                        {p.codigo}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-800">{p.nome}</h3>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{p.descricao}</p>
                        {p.destaques && (
                          <ul className="mt-2 space-y-1">
                            {p.destaques.map((d, i) => (
                              <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                                <span className={`mt-1 w-1.5 h-1.5 rounded-full ${cat.cor} flex-shrink-0`} />
                                {d}
                              </li>
                            ))}
                          </ul>
                        )}
                        {p.legislacao && (
                          <div className="mt-2 text-xs text-blue-600">{p.legislacao}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
