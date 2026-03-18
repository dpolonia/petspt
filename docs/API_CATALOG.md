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

### 8. `atendimentos-por-tipo-de-urgencia-hospitalar-link`
- **Total registos**: 6241
- **Data range**: 2024-01 até 2025-12
- **Campo período**: `tempo` (formato: `YYYY-MM`)
- **Campo instituição**: `instituicao`
- **Campo região**: `regiao`
- **Métricas**:
  - `urgencias_geral` (int)
  - `urgencias_pediatricas` (int)
  - `urgencia_obstetricia` (int)
  - `urgencia_psiquiatrica` (int, nullable)
  - `total_urgencias` (int)

### 9. `lotacao-praticada-por-tipo-de-cama`
- **Total registos**: 17979
- **Data range**: 2015-01 até 2025-12
- **Campo período**: `tempo` (formato: `YYYY-MM`)
- **Campo instituição**: `instituicao`
- **Campo região**: `regiao`
- **Campo tipo**: `tipo_de_camas` (enum: `Camas Cirúrgicas`, `Camas Médicas`, `Camas Neutras`, `Outras Camas`)
- **Métricas**:
  - `lotacao` (int)

### 10. `ocupacao-do-internamento`
- **Total registos**: 7298
- **Data range**: 2024-01 até present
- **Campo período**: `tempo` (formato: `YYYY-MM`)
- **Campo instituição**: `instituicao`
- **Campo região**: `regiao`
- **Métricas**:
  - `no_de_dias_de_internamento` (int)
  - `lotacao_praticada` (int)
  - `taxa_anual_de_ocupacao_em_internamento` (float, %)

### 11. `rastreios-oncologicos`
- **Total registos**: 6950
- **Data range**: 2015-01 até 2026-02
- **Campo período**: `tempo` (formato: `YYYY-MM`)
- **Campo região**: `regiao` (ex: `Alentejo`)
- **Campo instituição**: `area_csp` (ex: `Área dos CSP da ULS Alto Alentejo`)
- **Métricas**:
  - `proporcao_mulheres_50_70_a_c_mamogr_2_anos` (float, %) — Mama
  - `proporcao_mulheres_25_60_a_c_colpoc_atuali` (float, %) — Colo do útero
  - `proporcao_utentes_50_75_a_c_rastreio_cancro_cr` (float, %) — Colorretal
  - `contagem_de_mulheres_com_registo_de_mamografia_nos_ultimos_dois_anos` (int)
  - `contagem_de_mulheres_com_colpocitologia_atualizada` (int)
  - `contagem_de_utentes_inscritos_com_rastreio_do_cancro_do_colon_e_reto_efetuado` (int)

## Datasets NÃO Encontrados (usar dados estáticos)
- `atividade-cirurgica-programada` — Não existe. Usar `intervencoes-cirurgicas`.
- `tempos-medios-de-espera-para-cirurgia` — Não existe.
- `atividade-assistencial-sns-24` — Não existe. Usar `atividade-operacional-do-sns-24`.
- `hospitalizacao-domiciliaria` — Não existe.
- `primeiras-consultas-hospitalares-realizadas` — Não existe. Usar `consultas-em-tempo-real`.
- `consultas-externas-hospitalares` — Não existe. Usar dados estáticos para consultas psicologia/psiquiatria.
