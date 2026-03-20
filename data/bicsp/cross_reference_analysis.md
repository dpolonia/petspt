# BI-CSP Cross-Reference Analysis for PETS Monitoring

## 1. What BI-CSP Contains

**BI-CSP** (Business Intelligence dos Cuidados de Saude Primarios) is the primary health care analytics platform at `bicsp.min-saude.pt`.

### Structure (via SharePoint API discovery)
- **20 report configurations** across 5 granularity levels
- **Power BI dashboards** (organization-level, NOT "Publish to Web")
- **Tables discovered**: Tempo, Local Inscricao, Dim ARS, Dim ACES, Dim UF, Hierarquia UF, Local Prescricao

### Granularity Levels
| Level | Description | Filter Column |
|-------|-------------|---------------|
| NACIONAL | National aggregate | Cod. Mes |
| ARS | Regional Health Administration (5 ARS) | Cod. ARS |
| ACES | Primary Care Cluster (~50 ACES) | Cod. ACeS |
| ULS | Local Health Unit (~40 ULS) | Cod. ULS |
| UF | Functional Unit (USF-A, USF-B, UCSP, UCC, USP, URAP) | Cod. UF |

### Dashboard Tabs
| Tab | Content |
|-----|---------|
| QUEM SERVIMOS | Demographics, inscritos, population served |
| O QUE FAZEMOS | Activity indicators, consultations, programs |
| COMO FAZEMOS | Prescription, methodology, processes |
| QUEM SOMOS | Organization structure (ULS level only) |
| O QUE OFERECEMOS | Service portfolio, carta de compromisso |
| FATOR X | Innovation, special projects |

### Contractualization Indicators
- **IDE** (Indicador de Desempenho da Entidade) — entity performance
- **IDG UF** (Indicador de Desempenho de Gestao) — unit management
- **IDG ACES** — cluster management
- **Planos de Acao UF** — unit action plans
- **Relatorios de Atividade** — activity reports

## 2. PETS Measures Cross-Referenceable with BI-CSP

| PETS Measure | BI-CSP Relevance | Potential Data |
|---|---|---|
| E4.A1 (Medicos de Familia) | **HIGH** — BI-CSP "QUEM SERVIMOS" tracks utentes inscritos per USF with/without MdF | Monthly utentes com MdF at USF level |
| E4.A2 (Batas Brancas) | **HIGH** — "O QUE FAZEMOS" has consultation tracking by type | Consultation volume by unit |
| E4.B1 (USF-C) | **MEDIUM** — UF-level reports include USF type breakdown | USF-C creation tracking |
| E4.C2 (Rastreios) | **HIGH** — IDE includes screening indicators | Rastreio coverage by ACES |
| E5.A1 (Psicologos CSP) | **MEDIUM** — UF activity includes psychology | Psychology consultations per USF |
| E3.A1 (Urgencias) | **MEDIUM** — SDM indicator 411 (frequent emergency users) | ER utilization per USF catchment |
| E4.A4 (Ligue Antes) | **LOW** — CSP agendamento only, not SNS24 | CSP-side of referral chain |

## 3. Access Limitations

- **Authentication**: Requires institutional email (@arsXXX.min-saude.pt, @ulsXXX.min-saude.pt)
- **Power BI format**: Organization workspace (groups/375c253b-...), NOT "Publish to Web"
- **No public API**: SharePoint REST API is open but returns metadata only, not indicator data
- **No data exports**: No CSV/JSON download capability found

### What IS Publicly Accessible
- **SharePoint list metadata**: 23 lists, 20 report configurations, 34 category mappings
- **Report structure**: Granularity levels, tabs, filter columns, UF types
- **SDM indicator definitions**: Methodology, formulas, targets at sdm.min-saude.pt/bi.aspx

## 4. SDM Public Indicators Relevant to PETS

SDM (Sistema de Definicao de Metricas) has publicly accessible indicator definitions:

| SDM ID | Name | PETS Relevance |
|--------|------|----------------|
| 002 | Taxa de utilizacao global de consultas medicas | E4.A2 — Consultation utilization rate |
| 411 | Taxa ajustada de utilizadores muito frequentes do SU hospitalar | E3.A1 — Frequent ER users, targets [0; 0.2] per 100 inscritos |

**Data source**: SIARS (Sistema de Informacao dos Cuidados de Saude Primarios)
**Periodicity**: Monthly (floating 12-month window)
**Available since**: December 2016

## 5. Recommendations

### Short-term
1. Use SDM public indicator definitions to validate our methodology for E4 measures
2. Cross-reference Power BI-extracted E4 data (utentes inscritos) with BI-CSP targets
3. Document the IDE/IDG framework in methodology page

### Medium-term
4. Request ACSS to publish BI-CSP national/ARS aggregates as open data
5. Add BI-CSP indicator IDs to our measure mappings for traceability
6. Use SDM targets (e.g., 73.5-85% consultation utilization) as benchmarks

### Long-term
7. Advocate for BI-CSP "Publish to Web" for national-level dashboards
8. Propose dados.gov.pt publication of IDE/IDG annual results
9. Create cross-walk between our 54 PETS measures and ~500 SDM indicators

### Impact on Monitorability
If BI-CSP national aggregates were published as open data:
- E4.A1 (MdF): Grade 5/10 -> 8/10 (USF-level data would be available)
- E4.A2 (Batas Brancas): Grade 4/10 -> 7/10 (consultation breakdown)
- E4.C2 (Rastreios): Grade 4/10 -> 7/10 (screening coverage by ACES)
- E5.A1 (Psicologos): Grade 3/10 -> 6/10 (psychology activity by unit)
- Average Eixo 4 improvement: +2.5 points
