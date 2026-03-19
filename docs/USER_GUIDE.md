# PETS Monitor — Manual do Utilizador

## Portal de Monitorizacao do Plano de Emergencia e Transformacao da Saude

### Versao 1.0 | Marco 2026

---

## Indice

1. Introducao
2. Acesso ao Portal
3. Navegacao e Estrutura
4. Dashboard Principal
5. Paginas de Eixo (1-5)
6. Medidas Transversais
7. Comparador ULS
8. Analise Prospectiva (Holt-Winters)
9. Benchmarking Territorial
10. Simulador de Cenarios What-If
11. Dashboard de Alertas
12. Comparacao Internacional (Eurostat)
13. Gerador de Relatorios PDF
14. Pagina Sobre
15. Glossario
16. Referencias e Fontes de Dados
17. FAQ

---

## 1. Introducao

### 1.1 O que e o PETS Monitor?

O PETS Monitor e um portal web independente e open source que monitoriza em tempo real a execucao do Plano de Emergencia e Transformacao da Saude (PETS) do Governo de Portugal, publicado em 29 de Maio de 2024 sob coordenacao de Eurico Castro Alves.

O portal agrega dados publicos de multiplas fontes oficiais — incluindo a API Transparencia SNS, a ACSS, o Diario da Republica e o Eurostat — e apresenta-os de forma acessivel, interactiva e analiticamente rica. Alem da monitorizacao descritiva, o portal oferece projecao a 12 meses (Holt-Winters), benchmarking contratual, simulacao de cenarios de politica, avaliacao de risco de incumprimento, e geracao automatica de relatorios PDF.

O PETS define 54 medidas organizadas em 5 eixos estrategicos e 16 programas transversais. O objectivo e transformar o Servico Nacional de Saude portugues nas areas de listas de espera cirurgicas, saude materno-infantil, urgencias, cuidados primarios e saude mental.

### 1.2 Para quem se destina?

O portal foi concebido para multiplos publicos:

- **Decisores politicos**: visao de topo do estado de execucao do PETS, alertas de risco, cenarios what-if para avaliar alternativas
- **Investigadores**: dados estruturados, metodologia transparente (Holt-Winters), codigo aberto para replicacao
- **Jornalistas**: graficos publicaveis, dados verificaveis, relatorios PDF citaveis
- **Cidadaos**: informacao acessivel sobre o desempenho do SNS na sua ULS
- **Gestores hospitalares**: benchmarking com pares, gap vs. contrato programa
- **Profissionais de saude**: tendencias nos indicadores relevantes para a sua area

### 1.3 Fontes de dados

O portal consome dados de cinco tipos de fontes:

1. **API Transparencia SNS** (transparencia.sns.gov.pt) — 10 datasets com dados mensais por instituicao, desde 2013. Actualizacao mensal. Acesso publico sem autenticacao.
2. **Relatorios GT PETS** — Relatorio de Dezembro 2024 e II Relatorio de Progresso (Abril 2025). Dados extraidos manualmente e armazenados como dados estaticos.
3. **ACSS** — Contratos Programa 2024-2026 de 41 ULS/IPO (PDFs). Metas de producao e indicadores de desempenho.
4. **Diario da Republica** — Despachos 6770/2024 (QGR 2024-2026) e 14012/2025 (QGR 2025-2027). Metas nacionais.
5. **Eurostat** — Dados internacionais harmonizados para comparacao PT vs. UE.

### 1.4 Limitacoes e disclaimers

- O PETS Monitor e um portal **independente** — nao e endossado pelo Ministerio da Saude nem por qualquer entidade oficial.
- Os dados publicos podem ter um atraso de 1-2 meses face a realidade.
- As projecoes Holt-Winters sao **indicativas** e assumem continuidade de tendencias.
- Os resumos AI sao gerados automaticamente por LLM e devem ser interpretados com cautela.
- Os dados dos Contratos Programa sao extraidos de PDFs via regex (cobertura parcial).

---

## 2. Acesso ao Portal

**URL**: https://petspt-f019f.web.app

**Compatibilidade**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (desktop e mobile).

Nao e necessario registo, login ou instalacao. O portal funciona inteiramente no browser. O codigo fonte esta disponivel em github.com/dpolonia/petspt sob licenca MIT.

---

## 3. Navegacao e Estrutura

### 3.1 Barra de navegacao

A barra de navegacao no topo da pagina contem links para todas as 15 paginas do portal. Em desktop, os links sao visíveis directamente. Em mobile, um menu hamburger agrupa todos os links.

A navbar inclui tambem um mini-scorecard no canto superior direito (visivel apenas em desktop) que mostra o resumo global: numero de medidas concluidas, em curso e pendentes.

### 3.2 Convencoes visuais

**Faixas cromaticas nos graficos**: Tres faixas de fundo coloridas contextualizam temporalmente os dados:
- **Rosa** (#FFE0E6): Pre-PETS baseline (Janeiro-Junho 2024)
- **Laranja leve** (#FFE0B2): 1.o ano PETS (Julho 2024 - Junho 2025)
- **Laranja carregado** (#FF9800): 2.o ano PETS (Julho 2025 em diante)

### 3.3 Semaforo das medidas

Cada uma das 54 medidas do PETS tem um estado indicado por cor:
- **Verde**: Medida concluida
- **Amarelo**: Em curso (implementacao parcial ou em progresso)
- **Laranja**: Parcialmente implementada
- **Vermelho**: Nao implementada

### 3.4 Prioridade das medidas

As medidas sao classificadas em tres niveis de prioridade (badge visivel nos cards):
- **Urgente** (badge vermelho): Accao imediata, prazo curto
- **Prioritaria** (badge amber): Implementacao a medio prazo
- **Estruturante** (badge azul): Transformacao de fundo, prazo longo

---

## 4. Dashboard Principal (/)

O Dashboard e a pagina inicial do portal. Mostra uma visao de topo do estado global do PETS com:

- **5 KPIs macro** (um por eixo): valor actual, valor anterior, tendencia (seta)
- **Scorecard global**: barra proporcional mostrando quantas das 54 medidas estao concluidas, em curso, parciais ou nao implementadas
- **Legenda dos periodos cromaticos**: explica as tres faixas de cor usadas nos graficos

Para explorar um eixo em detalhe, clique no link correspondente na navbar ou nos cards do dashboard.

Os KPIs apresentados sao:
- **Eixo 1**: Doentes oncologicos fora do TMRG (180 em Marco 2025, vs. 2.645 no inicio do PETS)
- **Eixo 2**: Taxa de cesarianas no SNS (33%, meta inferior a 30%)
- **Eixo 3**: Centros de Atendimento Clinico operacionais (15, vs. 2 iniciais)
- **Eixo 4**: Utentes sem Medico de Familia (1,6 milhoes, com reducao de 135.542 desde Janeiro 2024)
- **Eixo 5**: Variacao de consultas de psicologia (+11,27% homologo)

O scorecard global mostra que 29 das 54 medidas estao concluidas (53,7%), 20 em curso (37,0%), 2 parciais (3,7%) e 3 nao implementadas (5,6%). A barra proporcional colorida permite uma leitura visual imediata do estado global.

---

## 5. Paginas de Eixo (Eixo 1-5)

Cada eixo tem uma pagina dedicada com cinco seccoes:

1. **Header**: Nome do eixo, resultados esperados, botao AI e botao PDF
2. **Analise AI**: Botao "Gerar Analise" que produz um resumo contextual via LLM (on-demand, nao automatico)
3. **Cards de medidas**: Semaforo compacto de todas as medidas do eixo
4. **Graficos**: 3-4 graficos com dados reais da API, com faixas cromaticas de fundo
5. **Detalhe das medidas**: Cards expandidos com descricao do progresso e legislacao

### 5.1 Eixo 1 — Resposta a Tempo e Horas (/eixo/1)
Foco: cirurgias oncologicas e nao-oncologicas, listas de espera (LIC), consultas a tempo e horas (CTH), actividade SNS24. 10 medidas.

### 5.2 Eixo 2 — Bebes e Maes em Seguranca (/eixo/2)
Foco: partos e cesarianas, Linha SNS Gravida, ecografias pre-natais. 10 medidas.

### 5.3 Eixo 3 — Cuidados Urgentes e Emergentes (/eixo/3)
Foco: Centros de Atendimento Clinico (CAC), urgencias por tipo, chamadas SNS24, camas contratadas. 13 medidas.

### 5.4 Eixo 4 — Saude Proxima e Familiar (/eixo/4)
Foco: utentes sem medico de familia, rastreios oncologicos (mama, colo, colorretal), Batas Brancas, USF-C. 12 medidas.

### 5.5 Eixo 5 — Saude Mental (/eixo/5)
Foco: psicologos nos CSP, Equipas Comunitarias (ECSM), Centros de Responsabilidade Integrada (CRI), camas de psiquiatria. 9 medidas.

---

## 6. Medidas Transversais (/transversais)

Os 16 programas transversais complementam os 5 eixos estrategicos, abordando temas que atravessam multiplos eixos. Estao organizados em 5 categorias:

**Programas de Contingencia** (4 programas): Plano de Verao 2024, Plano de Inverno 2024, Valorizacao dos Profissionais de Saude, Preparacao e Resposta a Catastrofes.

**Programas de Avaliacao** (3 programas): Reactivacao do SINAS (Sistema Nacional de Avaliacao em Saude), Programa Cliente Misterio (parceria com associacoes de doentes), Monitorizacao dos Conselhos de Administracao.

**Programas de Eficiencia** (3 programas): Financiamento Plurianual, Combate ao Desperdicio, Saude Digital Integrada (RSE unico, teleconsulta, interoperabilidade HL7/FHIR).

**Programas de Medicamento** (2 programas): Reserva Estrategica de Medicamentos (146M EUR UE), Implementacao do SiNATS.

**Programas Clinicos Prioritarios** (4 programas): Doencas Neurodegenerativas e Oncologicas, Combate a Obesidade, Investigacao Clinica e Ensaios Clinicos, Prevencao da Doenca.

Estes programas nao tem semaforo (nao sao medidas individuais) mas tem descricao, destaques-chave e legislacao quando aplicavel.

---

## 7. Comparador ULS (/comparador)

Permite seleccionar duas Unidades Locais de Saude e comparar o seu desempenho lado a lado em 10 indicadores de 4 eixos (cirurgias, consultas, partos, urgencias, utentes CSP). Os dados sao obtidos em tempo real de 5 datasets da API. Valores em verde indicam a ULS com melhor desempenho; vermelho indica pior.

**Como usar**: Seleccione ULS A no dropdown esquerdo e ULS B no dropdown direito. Os resultados aparecem automaticamente.

---

## 8. Analise Prospectiva (/prospectiva)

Gera projecoes a 6-24 meses para qualquer dos 8 indicadores do catalogo usando o modelo Holt-Winters aditivo.

**Como usar**:
1. Seleccione indicador no dropdown
2. Escolha horizonte (6/12/18/24 meses)
3. Opcionalmente, defina um benchmark de capacidade
4. O grafico mostra dados historicos (linha solida), projecao (linha tracejada), e intervalos de confianca (areas sombreadas a 80% e 95%)

A tabela abaixo do grafico lista as projecoes mensais com intervalos de confianca exactos.

**Metodologia**: O modelo Holt-Winters aditivo decompoe a serie temporal em tres componentes: nivel (tendencia de longo prazo), inclinacao (aceleracao ou desaceleracao), e sazonalidade (padrao mensal recorrente). Tres parametros de suavizacao (alfa, beta, gamma) controlam o peso relativo de observacoes recentes vs. historicas. Estes parametros sao optimizados automaticamente via grid search para minimizar o erro quadratico medio.

Os intervalos de confianca representam a incerteza da projecao: o CI 80% (area mais escura) indica que ha 80% de probabilidade de o valor real cair dentro desse intervalo; o CI 95% (area mais clara) cobre 95% dos cenarios possiveis. Os intervalos expandem-se com o horizonte — projecoes a 12 meses sao naturalmente mais incertas que a 3 meses.

O benchmark (linha vermelha horizontal, quando definido) representa a capacidade instalada ou a meta politica. A area acima do benchmark representa procura nao atendida (unmet demand), seguindo a abordagem de Goiana-da-Silva et al. (2025) para o SNS24.

Para series com menos de 24 observacoes mensais, o modelo completo nao pode ser estimado com fiabilidade, pelo que e usado um fallback de tendencia linear simples. A interface indica esta situacao.

---

## 9. Benchmarking Territorial (/benchmarking)

Confronta o desempenho real e projectado de cada ULS com as metas dos Contratos Programa (ACSS) e do Quadro Global de Referencia (QGR).

**Visualizacoes**: Heatmap ULS x meses, tabela de benchmarking com gap%, painel de metas QGR (ambos os Despachos).

**Fontes**: 41 PDFs de Contratos Programa validados, Despachos 6770/2024 e 14012/2025. Para ULS sem dados contratuais, as metas sao projectadas usando a variacao do orcamento do SNS.

---

## 10. Simulador de Cenarios What-If (/cenarios)

Permite alterar pressupostos de politica e ver o impacto nas projecoes em tempo real. 7 cenarios pre-definidos com fundamentacao em politicas reais:

1. **Variacao do Orcamento SNS** — impacto de diferentes dotacoes
2. **Limite de Contratacao** — efeito de 1,9% vs 5%
3. **Expansao SNS24** — se 12 ULS restantes aderirem
4. **Reforco de Medicos de Familia** — reducao de utentes sem MdF
5. **Meta de Cesarianas** — trajectoria para 30%
6. **Expansao de Camas** — impacto no internamento
7. **Expansao dos CAC** — desvio de urgencias

O grafico mostra BAU (cinzento) vs. cenario (indigo), com cards de impacto (delta total, delta%, delta mensal). Toda a simulacao executa no browser — zero custo servidor.

---

## 11. Dashboard de Alertas (/alertas)

Avaliacao automatica de risco de incumprimento para todas as ULS x indicadores.

**Semaforo**: Verde (OK), Amarelo (CI cruza meta), Vermelho (projecao fora da meta), Cinzento (dados insuficientes).

**Como usar**: Seleccione o horizonte temporal (3, 6 ou 12 meses) e clique "Executar Analise de Risco". O sistema processa sequencialmente todos os indicadores (8) para todas as ULS (~39 com dados), o que demora aproximadamente 15 segundos. Uma barra de progresso indica o indicador a ser processado.

Apos conclusao, os resultados ficam em cache na sessao do browser — navegar para outras paginas e regressar nao forca recalculo. Clicar novamente no botao forca uma nova analise com dados actualizados.

A pagina apresenta cinco seccoes:

1. **Contadores globais**: Quantas combinacoes ULS x indicador estao verdes, amarelas, vermelhas e cinzentas, com barra proporcional colorida.
2. **Top 10 alertas criticos**: As 10 combinacoes com maior desvio percentual face a meta contratualizada, com links para drill-down na Prospectiva e no Comparador.
3. **Matriz heatmap**: Tabela visual com ULS nas linhas e indicadores nas colunas. Cada celula e um quadrado colorido (verde/amarelo/vermelho/cinzento). Hover mostra detalhes.
4. **Ranking de ULS**: Tabela ordenada por score de risco composto (vermelho=3 pontos, amarelo=1). As 5 ULS com maior score sao destacadas.
5. **Resumo por indicador**: Para cada indicador, barra horizontal mostrando a proporcao de ULS em cada nivel de risco.

---

## 12. Comparacao Internacional (/europa)

Portugal vs. UE em tres indicadores Eurostat: despesa em saude (% PIB), camas hospitalares (por 100K hab.), taxa de cesarianas. Paises de referencia: PT, ES, FR, IT, DE, Media UE-27.

---

## 13. Gerador de Relatorios (/relatorios)

Gera PDF com relatorio prospectivo por eixo. Seleccione eixo, horizonte, e seccoes opcionais (AI, Eurostat). O PDF inclui capa, scorecard, tabela de medidas, nota metodologica e rodape. Formato: A4, publicavel como policy brief.

**Como citar**: PETS Monitor (2026). Relatorio Prospectivo — Eixo N: [Nome]. Disponivel em: https://petspt-f019f.web.app/relatorios

---

## 14. Pagina Sobre (/sobre)

Informacao sobre o portal: fontes de dados, metodologia, periodos cromaticos, contexto do PETS, Grupo de Trabalho, codigo aberto.

---

## 15. Glossario

| Termo | Definicao |
|-------|-----------|
| BAU | Business-as-usual — projecao se nada mudar |
| CAC | Centro de Atendimento Clinico |
| CI | Intervalo de confianca (80% ou 95%) |
| CP | Contrato Programa (ACSS) |
| CRI | Centro de Responsabilidade Integrada |
| CSP | Cuidados de Saude Primarios |
| CTH | Consultas a Tempo e Horas |
| ECSM | Equipa Comunitaria de Saude Mental |
| ETL | Extract-Transform-Load (pipeline de dados) |
| HW | Holt-Winters (modelo de forecasting) |
| LIC | Lista de Inscritos para Cirurgia |
| MdF | Medico de Familia |
| PETS | Plano de Emergencia e Transformacao da Saude |
| QGR | Quadro Global de Referencia do SNS |
| SNS | Servico Nacional de Saude |
| TMRG | Tempo Maximo de Resposta Garantido |
| ULS | Unidade Local de Saude |
| IPO | Instituto Portugues de Oncologia |

---

## 16. Referencias e Fontes de Dados

### APIs
- Transparencia SNS: https://transparencia.sns.gov.pt (ODS v2.1, acesso publico)
- Eurostat: https://ec.europa.eu/eurostat
- ACSS: https://www.acss.min-saude.pt

### Legislacao
- Despacho n.o 6770/2024 (QGR 2024-2026)
- Despacho n.o 14012/2025 (QGR 2025-2027)
- Despacho Ministerial 10208-A/2024 (PETS)

### Referencias academicas
- Goiana-da-Silva et al. (2025). Front. Public Health, 13:1694713
- Hyndman & Athanasopoulos (2018). Forecasting: Principles and Practice, 3rd ed.
- Kaplan & Norton (1996). The Balanced Scorecard
- OECD (2023). Health at a Glance 2023

---

## 17. FAQ

**Q: Os dados sao oficiais?**
Nao. O PETS Monitor e um portal independente que agrega dados publicos. Nao e endossado pelo Ministerio da Saude.

**Q: Com que frequencia os dados sao actualizados?**
Os dados da API Transparencia SNS sao actualizados mensalmente pelo SNS. Os dados estaticos sao actualizados quando e publicado um novo relatorio do GT PETS.

**Q: Posso usar os graficos em publicacoes?**
Sim. O portal e open source (MIT). Cite como: PETS Monitor (2026). petspt.web.app.

**Q: A analise AI e fiavel?**
Os resumos AI sao gerados automaticamente por LLM e devem ser interpretados com cautela. As referencias Scopus sao reais mas a sintese e automatica.

**Q: Porque e que algumas ULS aparecem cinzentas nos alertas?**
Cinzento significa dados insuficientes para projecao (menos de 6 meses de dados para aquela ULS). Nao significa que esta em risco — significa que nao ha dados suficientes para avaliar.

**Q: Como posso contribuir?**
O codigo e open source em github.com/dpolonia/petspt. Pull requests, issues e sugestoes sao bem-vindos.

**Q: Posso replicar este portal para outro pais?**
Sim. A arquitectura e metodologia sao portaveis para qualquer sistema de saude com APIs de dados publicos. O codigo esta licenciado sob MIT. Basta substituir os datasets, indicadores e metas regulamentares pelos equivalentes do pais em questao.

**Q: Porque e que a Prospectiva mostra "Dados insuficientes" para alguns indicadores?**
O modelo Holt-Winters requer pelo menos 24 meses de dados para estimar sazonalidade. Datasets com inicio em 2024 tem apenas 12-18 meses de dados, pelo que o modelo usa um fallback de tendencia linear mais simples. A medida que mais dados sao acumulados, a qualidade das projecoes melhora automaticamente.

**Q: Os cenarios what-if sao previsoes?**
Nao. Os cenarios sao simulacoes indicativas que mostram o impacto estimado de uma alteracao de pressuposto, assumindo relacoes lineares simples. Nao substituem analise economica formal nem modelos de system dynamics. O objectivo e dar ao decisor politico uma intuicao quantificada sobre a magnitude relativa de diferentes opcoes de politica.

**Q: Como funciona o semaforo de risco nos alertas?**
O sistema executa o modelo Holt-Winters para cada combinacao ULS x indicador e compara a projecao com a meta contratualizada. Verde significa que tanto a projecao central como o intervalo de confianca a 80% estao dentro da meta. Amarelo significa que a projecao central esta dentro da meta mas o CI 80% cruza-a (risco moderado). Vermelho significa que a projecao central esta fora da meta (risco elevado). Cinzento significa dados insuficientes para fazer a projecao.

**Q: Com que frequencia devo consultar o portal?**
Recomendamos consulta mensal, apos a actualizacao dos dados da API Transparencia SNS. Para decisores com responsabilidades sobre ULS especificas, a pagina de Alertas e o ponto de entrada ideal — mostra rapidamente quais combinacoes ULS x indicador requerem atencao.

---

*PETS Monitor — petspt.web.app — Codigo aberto sob licenca MIT*
*Dados: Transparencia SNS + Relatorios GT PETS + Eurostat + ACSS*
