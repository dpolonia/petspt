import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MEASURE_METHODOLOGIES, METHODOLOGY_STATS } from '../config/measureMethodology';
import { MONITORABILITY_SCALE, getLevel } from '../config/monitorabilityScale';
import { GAP_ANALYSIS, GAP_STATS } from '../config/gapAnalysis';

export default function MetodologiaPage() {
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('medida');
  const [expandedId, setExpandedId] = useState<string | null>(highlightId);
  const [filterEixo, setFilterEixo] = useState(0);
  const [filterGrauMin, setFilterGrauMin] = useState(0);

  const filtered = MEASURE_METHODOLOGIES
    .filter(m => filterEixo === 0 || m.eixo === filterEixo)
    .filter(m => m.grau >= filterGrauMin);

  // Distribution histogram
  const distribution = Array.from({ length: 10 }, (_, i) => {
    const level = getLevel(i + 1);
    return { grau: i + 1, count: MEASURE_METHODOLOGIES.filter(m => m.grau === i + 1).length, label: level.label, cor: level.cor };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Transparencia Metodologica</h1>
        <p className="text-sm text-gray-500 mt-1">Indice de monitorizacao independente das 54 medidas PETS</p>
      </div>

      {/* Executive summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Sumario</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{METHODOLOGY_STATS.total}</div>
            <div className="text-xs text-gray-500">Medidas PETS</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{METHODOLOGY_STATS.grauMedio}</div>
            <div className="text-xs text-gray-500">Grau medio (1-10)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{METHODOLOGY_STATS.boaMonitorizacao}</div>
            <div className="text-xs text-gray-500">Grau &ge;7 (boa)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{METHODOLOGY_STATS.naoMonitorizavel}</div>
            <div className="text-xs text-gray-500">Grau &le;3 (fraca)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{METHODOLOGY_STATS.comDataset}</div>
            <div className="text-xs text-gray-500">Com dataset aberto</div>
          </div>
        </div>

        {/* Distribution */}
        <div className="flex items-end gap-1 h-16">
          {distribution.map(d => (
            <div key={d.grau} className="flex-1 flex flex-col items-center">
              <div className="text-[9px] text-gray-500 mb-0.5">{d.count}</div>
              <div className="w-full rounded-t" style={{ backgroundColor: d.cor, height: `${Math.max(4, d.count * 6)}px` }} />
              <div className="text-[9px] text-gray-400 mt-0.5">{d.grau}</div>
            </div>
          ))}
        </div>
        <div className="text-[10px] text-gray-400 text-center mt-1">Distribuicao das 54 medidas por grau de monitorizacao (1=nenhuma, 10=total)</div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Eixo</label>
          <select value={filterEixo} onChange={e => setFilterEixo(Number(e.target.value))} className="p-1.5 border border-gray-300 rounded text-sm">
            <option value={0}>Todos</option>
            {[1, 2, 3, 4, 5].map(e => <option key={e} value={e}>Eixo {e}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">Grau minimo</label>
          <select value={filterGrauMin} onChange={e => setFilterGrauMin(Number(e.target.value))} className="p-1.5 border border-gray-300 rounded text-sm">
            <option value={0}>Todos</option>
            {[1, 3, 5, 7].map(g => <option key={g} value={g}>&ge;{g}</option>)}
          </select>
        </div>
        <div className="text-xs text-gray-400 self-end">{filtered.length} medidas</div>
      </div>

      {/* Table */}
      <div className="space-y-2 mb-8">
        {filtered.map(m => {
          const level = getLevel(m.grau);
          const isExpanded = expandedId === m.medidaId;
          return (
            <div key={m.medidaId} className={`rounded-lg border ${highlightId === m.medidaId ? 'border-blue-400 ring-2 ring-blue-200' : 'border-gray-200'}`} id={`medida-${m.medidaId}`}>
              <button onClick={() => setExpandedId(isExpanded ? null : m.medidaId)}
                className="w-full text-left p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: level.cor }}>
                  {m.grau}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800">{m.medidaId} — {m.medidaNome}</div>
                  <div className="text-xs text-gray-500">E{m.eixo} &middot; {level.label} &middot; {m.matchType} &middot; {m.datasetsAbertos.length} dataset(s)</div>
                </div>
                <span className="text-gray-400 text-sm">{isExpanded ? '\u25B2' : '\u25BC'}</span>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-gray-600 mb-1">Justificacao (grau {m.grau}/10)</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">{m.justificacao}</p>
                  </div>

                  {m.datasetsAbertos.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-600 mb-1">Datasets abertos</h4>
                      <div className="flex flex-wrap gap-2">
                        {m.datasetsAbertos.map(ds => (
                          <span key={ds} className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-mono">{ds}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {m.limitacoes.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-600 mb-1">Limitacoes</h4>
                      <ul className="text-xs text-gray-600 space-y-0.5">
                        {m.limitacoes.map((l, i) => <li key={i} className="flex items-start gap-1"><span className="text-red-400 mt-0.5">&bull;</span> {l}</li>)}
                      </ul>
                    </div>
                  )}

                  {m.recomendacoes.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-600 mb-1">Recomendacoes</h4>
                      <ul className="text-xs text-gray-600 space-y-0.5">
                        {m.recomendacoes.map((r, i) => <li key={i} className="flex items-start gap-1"><span className="text-green-500 mt-0.5">&rarr;</span> {r}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Scale legend */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Escala de Monitorizacao Independente</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {MONITORABILITY_SCALE.map(l => (
            <div key={l.grau} className="flex items-start gap-2 text-xs">
              <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[9px] font-bold" style={{ backgroundColor: l.cor }}>{l.grau}</div>
              <div><span className="font-medium">{l.label}</span></div>
            </div>
          ))}
        </div>
      </div>

      {/* Gap Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Gap Analysis: Actual vs. Potencial</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{GAP_STATS.grauMedioActual}</div>
            <div className="text-xs text-gray-500">Grau medio actual</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{GAP_STATS.grauMedioPotencial}</div>
            <div className="text-xs text-gray-500">Grau medio potencial</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{GAP_STATS.gapMedio}</div>
            <div className="text-xs text-gray-500">Gap medio</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-700">{GAP_STATS.criticas}</div>
            <div className="text-xs text-gray-500">Recomendacoes criticas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{GAP_STATS.altas}</div>
            <div className="text-xs text-gray-500">Prioridade alta</div>
          </div>
        </div>

        <h4 className="text-xs font-semibold text-gray-600 mb-2">Recomendacoes por entidade responsavel</h4>
        <div className="flex flex-wrap gap-3 mb-4">
          {GAP_STATS.porEntidade.map(([ent, count]) => (
            <div key={ent} className="flex items-center gap-1.5 text-xs bg-gray-50 px-3 py-1 rounded-full">
              <span className="font-semibold text-gray-700">{ent}</span>
              <span className="text-gray-400">{count} recomendacoes</span>
            </div>
          ))}
        </div>

        <h4 className="text-xs font-semibold text-gray-600 mb-2">Recomendacoes prioritarias</h4>
        <div className="space-y-1.5 max-h-64 overflow-y-auto">
          {GAP_ANALYSIS.filter(g => g.prioridade === 'critica' || g.prioridade === 'alta').sort((a, b) => {
            const p = { critica: 0, alta: 1, media: 2, baixa: 3 };
            return p[a.prioridade] - p[b.prioridade] || b.gapScore - a.gapScore;
          }).map(g => (
            <div key={g.medidaId} className="flex items-center gap-3 text-xs p-2 rounded bg-gray-50">
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${g.prioridade === 'critica' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                {g.prioridade}
              </span>
              <span className="font-mono text-gray-400 w-12">{g.medidaId}</span>
              <span className="flex-1 text-gray-700">{g.recomendacao}</span>
              <span className="text-gray-400">{g.entidade}</span>
              <span className="font-mono text-orange-600">+{g.gapScore}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SDM Transparency Regression */}
      <div className="bg-red-50 rounded-lg border border-red-300 p-5 text-xs text-gray-600 mb-4">
        <h4 className="font-semibold text-red-800 mb-2">Regressao de Transparencia: SDM</h4>
        <p>O SDM (Sistema de Definicao de Metricas, sdm.min-saude.pt) fechou o acesso publico as definicoes de indicadores. As paginas <code>bi.aspx?id=NNN</code>, anteriormente publicas, agora requerem login institucional. <strong>209 indicadores foram preservados na nossa base de dados antes do fecho</strong>, incluindo 125 com nomes completos, formulas e metas de desempenho 2025-2026.</p>
        <p className="mt-2">Indicadores-chave preservados: #002 (consultas medicas, meta 73.5-85%), #011 (gravidas 1o trimestre, meta 91-100%), #411 (utilizadores frequentes SU, meta 0-0.2/100), #435 (vacina gripe, meta 66-100%).</p>
      </div>

      {/* BI-CSP Data Ecosystem */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-5 text-xs text-gray-600 mb-4">
        <h4 className="font-semibold text-blue-800 mb-2">Ecossistema de Dados: BI-CSP</h4>
        <p>O BI-CSP (bicsp.min-saude.pt) contem dados cruciais para o PETS que foram parcialmente extraidos atraves de 4 niveis de tentativa:</p>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li><strong>Nivel 1 — SharePoint APIs:</strong> 16 listas descobertas, 20 configuracoes de relatorios Power BI, CONTROLLEDMONTH=202512 (dados ate Dez/2025).</li>
          <li><strong>Nivel 2 — Paginas "publico":</strong> Matriz CSP e Diabetes usam Power BI organizacional (nao "Publish to Web") — API publica nao funciona.</li>
          <li><strong>Nivel 3 — PDFs Operacionalizacao:</strong> 99 indicadores extraidos de 3 PDFs (contrat2024, op2021, op2022) com nomes, aplicabilidade (USF/UCC/ACES) e intervalos de metas.</li>
          <li><strong>Nivel 4 — Playwright:</strong> Paginas carregam sem autenticacao. IDG ACES: 12 linhas de dados (39 ULS em 4 escaloes). 27 tabelas Power BI descobertas via intercecao de rede.</li>
        </ul>
        <p className="mt-2"><strong>Descoberta:</strong> As paginas BI-CSP sao publicamente acessiveis (sem redirect para login), mas os dados Power BI requerem sessao de browser autenticada via SharePoint. O Power BI usa <code>/explore/querydata</code> (autenticado) em vez de <code>/public/reports/querydata</code> (publico).</p>
      </div>

      {/* Power BI Extraction */}
      <div className="bg-green-50 rounded-lg border border-green-200 p-5 text-xs text-gray-600 mb-4">
        <h4 className="font-semibold text-green-800 mb-2">Extracao de Dados Power BI (SNS Portal + BI-CSP)</h4>
        <p>Os dashboards Power BI do portal SNS ("Publish to Web") foram interrogados via API querydata, extraindo <strong>2.164 pontos</strong> de 43 series (Jan 2023 - Jan 2026). Cadeia de prioridade dos dados:</p>
        <ol className="mt-2 space-y-1 list-decimal list-inside">
          <li><strong>Power BI SIGLIC/SICA</strong> (SNS Portal) — cirurgias, consultas, listas de espera</li>
          <li><strong>BI-CSP IDG/IDE</strong> — desempenho por unidade funcional (parcialmente extraido)</li>
          <li><strong>Transparencia SNS API</strong> — 12 datasets publicos com serie mensal</li>
          <li><strong>SDM definicoes</strong> — 209 indicadores com formulas e metas</li>
          <li><strong>Relatorios GT PETS</strong> — valores pontuais de Dez/2024 e Abr/2025</li>
        </ol>
        <ul className="mt-3 space-y-1 list-disc list-inside text-xs">
          <li>Eixo 1: 198 pontos — cirurgias onco/nao-onco, consultas hospitalares, LIC fora TMRG (SIGLIC/SICA)</li>
          <li>Eixo 2: 211 pontos — partos, cesarianas, triagens SNS24 Gravida, ecografias, encaminhamentos</li>
          <li>Eixo 3: 1.609 pontos — CAC (utentes, teleconsultas, referenciados), encaminhamentos SU/CSP, vacinacao</li>
          <li>Eixo 4: 112 pontos — utentes inscritos (com/sem MdF), consultas CSP (presenciais/nao), ULS/SCM</li>
          <li>Eixo 5: 34 pontos — episodios psicologia/psiquiatria anuais e mensais, TMRG psiquiatria</li>
        </ul>
      </div>

      {/* Methodology note */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 text-xs text-gray-500">
        <h4 className="font-semibold text-gray-700 mb-2">Nota Metodologica</h4>
        <p>Esta analise classifica cada medida PETS pelo grau em que um cidadao ou investigador pode verificar independentemente o seu estado usando exclusivamente dados abertos publicos (Transparencia SNS, dados.gov.pt). A escala de 1-10 reflecte a disponibilidade, granularidade e alinhamento dos dados abertos com os indicadores usados nos relatorios oficiais do GT PETS.</p>
        <p className="mt-2">Fontes: Plano de Emergencia e Transformacao da Saude (Mai 2024), Relatorio GT PETS (Dez 2024), II Relatorio de Progresso (Abr 2025), catalogos de 4 portais de dados publicos (140+ datasets analisados), Power BI API (2.164 pontos extraidos), BI-CSP SharePoint API (20 configuracoes de relatorio), SDM (definicoes publicas de indicadores).</p>
        <p className="mt-2">Ultima actualizacao: Marco 2026. Codigo aberto: github.com/dpolonia/petspt</p>
      </div>
    </div>
  );
}
