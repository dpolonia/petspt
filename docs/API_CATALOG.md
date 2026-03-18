# API Catalog — Transparência SNS

Discovered via API exploration on 2026-03-18.
Base URL: `https://transparencia.sns.gov.pt/api/explore/v2.1/catalog/datasets`

## Datasets Relevantes para o PETS

### 1. `intervencoes-cirurgicas`
- **Total registos**: 7128
- **Data range**: 2013-01 até 2025-12
- **Campo período**: `tempo` (formato: `YYYY-MM`)
- **Campo instituição**: `instituicao` (ex: `Unidade Local de Saúde do Baixo Alentejo, EPE`)
- **Campo região**: `regiao` (ex: `Região de Saúde do Alentejo`)
- **Métricas**:
  - `no_intervencoes_cirurgicas_programadas` (int)
  - `no_intervencoes_cirurgicas_convencionais` (int)
  - `no_intervencoes_cirurgicas_de_ambulatorio` (int)
  - `no_intervencoes_cirurgicas_urgentes` (int)
- **Filtros**: regiao, instituicao
- **Nota**: Não distingue oncológica/não-oncológica. Valores são anuais acumulados.

### 2. `inscritos-em-lic-dentro-do-tmrg-180-dias`
- **Total registos**: 4344
- **Data range**: 2024-01 até 2025-12
- **Campo período**: `tempo` (formato: `YYYY-MM`)
- **Campo instituição**: `instituicao`
- **Campo região**: `regiao`
- **Métricas**:
  - `no_de_doentes_inscritos_dentro_do_tmrg_sigic` (int)
  - `no_de_doentes_inscritos_sigic` (int)
  - `de_inscritos_em_lic_dentro_do_tmrg` (float, %)
- **Filtros**: regiao, instituicao

### 3. `inscritos-lic-dentro-tmrg`
- Similar ao anterior mas com TMRG de 270 dias

### 4. `consultas-em-tempo-real`
- **Total registos**: 7513
- **Data range**: 2024-01 até 2025-12
- **Campo período**: `tempo` (formato: `YYYY-MM`)
- **Campo instituição**: `instituicao`
- **Campo região**: `regiao`
- **Métricas**:
  - `no_primeiras_ce_prestadas_dentro_do_tmrg` (int)
  - `no_primeiras_ce_realizadas_com_registo_no_cth` (int)
  - `1as_consultas_realizadas_em_tempo_adequado` (float, %)
- **Filtros**: regiao, instituicao

### 5. `atividade-operacional-do-sns-24`
- **Total registos**: 549
- **Data range**: 2021-01 até 2026-01
- **Campo período**: `periodo` (formato: `YYYY-MM`)
- **Campo indicador**: `indicador` (enum)
- **Campo valor**: `valor` (float)
- **Indicadores disponíveis**:
  - `Chamadas Recebidas`
  - `Chamadas Atendidas`
  - `Taxa Atendimento (%)`
  - `Taxa Atendimento revista (%)`
  - `Tempo Médio de Espera (seg)`
  - `Chamadas aconselhamento: Utentes`
  - `Chamadas aconselhamento: Profissionais de saúde`
  - `Chamadas atendidas no SNS 24 via iLGP`
- **Nota**: Dados nacionais agregados, sem decomposição por instituição.

### 6. `utentes-inscritos-em-cuidados-de-saude-primarios`
- **Total registos**: 6255
- **Data range**: 2016-01 até 2026-01
- **Campo período**: `periodo` (formato: `YYYY-MM`)
- **Campo região**: `ars` (ex: `Alentejo`, `Algarve`)
- **Campo instituição**: `aces` (ex: `CSP da ULS Alentejo Central`)
- **Métricas**:
  - `utentes_inscritos_csp` (int)
  - `total_utentes_com_mdf_atribuido` (int)
  - `total_utentes_com_mdf_atribuido0` (float, %)
  - `total_utentes_sem_mdf_atribuido` (int)
  - `total_utentes_sem_mdf_atribuido0` (float, %)
  - `total_utentes_sem_mdf_atribuido_por_opcao` (int)
  - `taxa_de_utilizacao_consultas_medicas_1_ano_todos_os_utentes` (float, %)
  - `taxa_de_utilizacao_consultas_medicas_1_ano_nos_utentes_sem_mdf` (float, %)

### 7. `partos-e-cesarianas`
- **Total registos**: 5951
- **Data range**: 2013-01 até present
- **Campo período**: `tempo` (formato: `YYYY-MM`)
- **Campo instituição**: `instituicao`
- **Campo região**: `regiao`
- **Métricas**:
  - `no_de_partos` (int)
  - `no_de_cesarianas` (int)

## Datasets NÃO Encontrados (usar dados estáticos)
- `atividade-cirurgica-programada` — Não existe. Usar `intervencoes-cirurgicas`.
- `tempos-medios-de-espera-para-cirurgia` — Não existe.
- `atividade-assistencial-sns-24` — Não existe. Usar `atividade-operacional-do-sns-24`.
- `hospitalizacao-domiciliaria` — Não existe.
- `primeiras-consultas-hospitalares-realizadas` — Não existe. Usar `consultas-em-tempo-real`.
