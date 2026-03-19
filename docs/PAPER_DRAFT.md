# Real-Time Monitoring and Prospective Analysis of Portugal's NHS Emergency Transformation Plan: An Open-Source Dashboard Integrating Administrative Data, Time Series Forecasting, and Policy Simulation

## Authors

[To be completed]

## Abstract

**Background.** In May 2024, Portugal launched the Plano de Emergencia e Transformacao da Saude (PETS), a comprehensive reform spanning 54 measures across five strategic axes: surgical waiting lists, maternal-infant health, emergency care, primary care, and mental health. Despite the plan's ambition, no systematic real-time monitoring tool existed to track implementation progress, project future demand trajectories, or compare institutional performance against contractual targets.

**Methods.** We developed PETS Monitor (petspt.web.app), an open-source web-based dashboard that integrates full-population administrative data from the Portuguese NHS Transparency Portal (10 datasets covering 2013-2025), Contract Programme targets from 41 Local Health Units extracted via automated PDF parsing, and the national Quadro Global de Referencia (QGR). The platform implements: (i) Holt-Winters triple exponential smoothing for 12-month demand projections with 80% and 95% prediction intervals, following the methodology of Goiana-da-Silva et al. (2025); (ii) territorial benchmarking with traffic-light risk classification across 39 ULS and 8 indicators; (iii) interactive what-if policy simulation with 7 pre-defined scenarios grounded in PETS measures and QGR targets; and (iv) automated PDF policy brief generation per strategic axis. The system was developed over 12 agile sprints with 45 automated tests and 165 acceptance criteria.

**Results.** The portal tracks all 54 PETS measures with semaphore status derived from official progress reports, provides prospective forecasts for 8 key indicators across all Local Health Units, compares institutional performance against both contracted and regulatory targets, and enables scenario modeling for policy alternatives including budget variations, workforce expansion, and service coverage changes. The forecasting engine runs entirely in the browser at zero marginal operational cost. The platform identified that the revised QGR 2025-2027 (Despacho 14012/2025) reduced the national surgery target by 6.6% (from 833,000 to 778,000) and the workforce growth limit from 5% to 1.9% compared to the original QGR 2024-2026.

**Conclusions.** Open-source, data-driven monitoring platforms can enhance health reform accountability by making implementation data accessible, forward-looking, and actionable. The architecture combining real-time monitoring, time series forecasting, contract compliance benchmarking, and policy simulation is portable to other health system transformation programs with public data APIs.

**Keywords:** health system monitoring, NHS reform, time series forecasting, Holt-Winters exponential smoothing, policy simulation, open-source dashboard, digital health, Portugal, PETS, balanced scorecard

---

## 1. Introduction

### 1.1 Context: Portugal's NHS reform challenge

Portugal's Servico Nacional de Saude (SNS) faces structural challenges that have accumulated over decades. The country has one of the highest emergency department utilisation rates in the OECD, with over 70 visits per 100 inhabitants annually compared to the OECD average of 28 (OECD, 2023). Approximately 1.6 million citizens lack an assigned family physician (Medico de Familia), and surgical waiting lists have persistently exceeded the legally mandated maximum response times (Tempo Maximo de Resposta Garantido, TMRG). The caesarean section rate stands at 33%, well above the WHO recommended range of 10-15% and the EU average of approximately 27% (Eurostat, 2023).

In response to these challenges, the Portuguese government launched the Plano de Emergencia e Transformacao da Saude (PETS) on 29 May 2024, under the coordination of Eurico Castro Alves. The plan defines 54 measures organised across five strategic axes: (1) Resposta a Tempo e Horas (timely access to surgery and consultations), (2) Bebes e Maes em Seguranca (maternal-infant safety), (3) Cuidados Urgentes e Emergentes (urgent and emergency care), (4) Saude Proxima e Familiar (primary health care), and (5) Saude Mental (mental health). Additionally, 16 transversal programmes address cross-cutting themes including workforce valorisation, digital health integration, and clinical research.

A dedicated Working Group (Grupo de Trabalho, GT) chaired by Carlos Robalo Cordeiro was appointed to monitor implementation and has published two progress reports: a first report in December 2024 and a second in April 2025. These reports provide narrative assessments and selected metrics but are published retrospectively, with a delay of several months.

### 1.2 The monitoring gap

Health system reform monitoring has traditionally relied on retrospective reporting cycles. The OECD Health at a Glance series (OECD, 2023) provides biennial cross-country comparisons but with 18-24 month data lag. The WHO Universal Health Coverage Service Coverage Index (WHO, 2023) offers annual national-level assessments but lacks sub-national granularity. National dashboards exist in some countries — NHS England publishes monthly statistics, and the Portuguese DGS operated a COVID-19 dashboard — but these are typically single-purpose and descriptive rather than prospective.

The literature on health system performance monitoring identifies several gaps that limit its policy impact (Smith et al., 2009; Papanicolas & Smith, 2013). First, monitoring is predominantly retrospective: by the time a deviation from targets is identified in an annual report, the window for corrective action may have closed. Second, monitoring rarely includes prospective forecasting: decision-makers cannot see where current trajectories lead. Third, institutional benchmarking against contractual targets is typically done behind closed doors between the contracting authority (ACSS) and each institution, without public visibility. Fourth, scenario planning — the ability to ask "what if we change this policy parameter?" — is virtually absent from public monitoring tools.

Goiana-da-Silva et al. (2025) demonstrated the value of applying Holt-Winters exponential smoothing to project SNS24 telephone triage call volumes, estimating that without structural reinforcement, approximately 1 million calls would go unanswered during the 2025-2026 winter season. Their work showed that combining time series forecasting with capacity benchmarks can produce actionable policy-relevant intelligence from routine administrative data.

### 1.3 Objectives

This study presents PETS Monitor, an open-source web-based platform that addresses these monitoring gaps by:

1. Tracking implementation of all 54 PETS measures in real time using publicly available administrative data from 10 SNS datasets;
2. Projecting demand trajectories using Holt-Winters triple exponential smoothing with prediction intervals, generalising the methodology of Goiana-da-Silva et al. (2025) to all forecastable indicators;
3. Benchmarking institutional performance against contracted targets (Contract Programmes) and regulatory targets (Quadro Global de Referencia) for each of the 39 Local Health Units;
4. Enabling interactive what-if policy simulation through 7 pre-defined scenarios grounded in PETS measures and QGR parameters;
5. Generating automated prospective reports as policy briefs suitable for institutional dissemination;
6. Providing all functionality as open-source software with zero marginal operational cost for most features.

---

## 2. Materials and Methods

### 2.1 Data sources

The platform integrates data from five categories of public sources.

**Administrative data (API Transparencia SNS).** Ten datasets were identified and validated from the Portuguese NHS Transparency Portal (transparencia.sns.gov.pt), which implements the ODS v2.1 API protocol with public access requiring no authentication. Datasets cover surgical interventions (intervencoes-cirurgicas, n=7,128 records, 2013-2025), first hospital consultations (consultas-em-tempo-real, n=7,513, 2024-2025), SNS24 telephone triage operations (atividade-operacional-do-sns-24, n=549, 2021-2026), primary care enrolment (utentes-inscritos-em-cuidados-de-saude-primarios, n=6,255, 2016-2026), births and caesarean sections (partos-e-cesarianas, n=5,951, 2013-present), emergency department attendances by type (atendimentos-por-tipo-de-urgencia-hospitalar-link, n=6,241, 2024-2025), hospital bed capacity (lotacao-praticada-por-tipo-de-cama, n=17,979, 2015-2025), inpatient occupancy (ocupacao-do-internamento, n=7,298, 2024-present), waiting list compliance (inscritos-em-lic-dentro-do-tmrg-180-dias, n=4,344, 2024-2025), and oncological screening coverage (rastreios-oncologicos, n=6,950, 2015-2026). All datasets provide monthly granularity with decomposition by institution (Local Health Unit).

**Contract Programme targets.** PDF documents for the Contract Programmes 2024-2026 were identified and validated for 41 of 42 ULS/IPO from the ACSS website. Target metrics were extracted using a semi-automated pipeline combining pdf-parse text extraction with regex pattern matching, achieving coverage of 40-70% of target fields with confidence scoring (alta/media/baixa).

**Quadro Global de Referencia.** National aggregate targets were extracted from two regulatory instruments: Despacho 6770/2024 (QGR 2024-2026) and Despacho 14012/2025 (QGR 2025-2027, revised). Both versions are stored to enable analysis of target revisions.

**Progress reports.** Measure-level implementation status (completed, in progress, partial, not implemented) was extracted manually from the GT PETS reports of December 2024 and April 2025.

**International comparison.** Three Eurostat datasets provide cross-country context: health expenditure as percentage of GDP (hlth_sha11_hf), caesarean section rates (hlth_co_proc2), and hospital beds per 100,000 inhabitants (hlth_rs_bdsrg), with data for Portugal, Spain, France, Italy, Germany, and the EU-27 average.

### 2.2 Technology architecture

The platform is built as a single-page application using React 18 with TypeScript, Vite as build tool, and Tailwind CSS for styling. Data visualisation uses Recharts. The backend consists of Firebase Hosting for static content delivery, Firestore for pre-aggregated data storage, and Cloud Functions (Node.js) for server-side operations including AI-assisted analysis (via Anthropic/OpenAI APIs), Contract Programme PDF extraction, ETL data pipelines, and PDF report generation (PDFKit).

An Extract-Transform-Load (ETL) pipeline aggregates raw API data by period (national totals and per-ULS decomposition) and stores the results in Firestore, reducing frontend data requirements from multiple paginated API calls to single document reads. The ETL is scheduled to run daily for incremental updates.

The codebase follows agile development practices with 12 sprints, 165 acceptance criteria, and 45 automated tests using Vitest. The production bundle is code-split into four chunks totalling approximately 111 KB gzipped for the main application code.

### 2.3 Descriptive monitoring layer

All 54 PETS measures are classified into semaphore status (completed, in progress, partial, not implemented) based on the April 2025 GT PETS progress report. Each measure is tagged with its strategic axis (1-5), priority level (urgent, priority, structural), and a narrative description of implementation progress. Five macro KPIs are displayed on the main dashboard, one per axis, with trend indicators.

Three chromatic period bands provide temporal context on all time series charts: pre-PETS baseline (January-June 2024, pink), first year of PETS (July 2024-June 2025, light orange), and second year (July 2025 onwards, dark orange).

### 2.4 Prospective forecasting: Holt-Winters exponential smoothing

We implement the additive Holt-Winters triple exponential smoothing model (Winters, 1960; Hyndman & Athanasopoulos, 2018, Chapter 7.3) in pure TypeScript, executable entirely in the browser without server-side computation.

The model decomposes a time series into level (l_t), trend (b_t), and seasonal (s_t) components with update equations:

- Level: l_t = alpha * (y_t - s_{t-m}) + (1 - alpha) * (l_{t-1} + b_{t-1})
- Trend: b_t = beta * (l_t - l_{t-1}) + (1 - beta) * b_{t-1}
- Seasonal: s_t = gamma * (y_t - l_t) + (1 - gamma) * s_{t-m}
- Forecast: y_hat_{t+h} = l_t + h * b_t + s_{t+h-m}

where m = 12 for monthly data. Parameters alpha, beta, and gamma are optimised automatically via grid search over {0.01, 0.1, 0.2, ..., 0.9} to minimise mean squared error (MSE) on the fitted series.

Prediction intervals are computed as:

- PI_{h} = y_hat_{t+h} +/- z_q * sigma * sqrt(h)

where sigma is the standard deviation of in-sample residuals and z_q is the standard normal quantile (1.28 for 80%, 1.96 for 95%). This simplified variance formula follows Hyndman et al. (2008) for additive ETS models.

For time series with fewer than 2m = 24 observations, the model falls back to simple linear trend extrapolation with analogous prediction intervals.

Following Goiana-da-Silva et al. (2025), when a capacity benchmark is defined, unmet demand is estimated as max(0, forecast - capacity), with prediction interval bounds propagated accordingly.

### 2.5 Territorial benchmarking and risk classification

Each ULS-indicator combination is classified into a traffic-light risk level based on the relationship between the 12-month forecast and the contracted target (from Contract Programme or QGR):

- **Green**: both the central forecast and the 80% prediction interval lower bound meet or exceed the target;
- **Yellow**: the central forecast meets the target but the 80% PI lower bound falls below it;
- **Red**: the central forecast itself falls below the target;
- **Grey**: insufficient data for forecasting (fewer than 6 observations).

For inverted indicators where lower values are desirable (e.g., patients without a family physician, patients exceeding TMRG), the logic is reversed. A composite risk score per ULS is computed as 3 * (number of red indicators) + 1 * (number of yellow indicators).

### 2.6 What-if policy simulation

A scenario engine applies parametric transformations to the Holt-Winters baseline forecast without modifying the original. Five transformation types are supported: multiplicative (forecast * (1 + delta%)), additive (forecast + delta), target interpolation (linear interpolation from current forecast to specified target), capacity change (altering the benchmark), and trend shift (progressive acceleration/deceleration). Prediction intervals from the baseline are transformed identically.

Seven pre-defined scenarios are grounded in specific PETS policies, QGR parameters, and published research. For example, the "SNS24 Coverage Expansion" scenario models the projected 31.6% increase in call volume if the remaining 12 ULS (approximately 2.5 million additional users) join the Ligue Antes, Salve Vidas telephone triage system, directly parameterised from Goiana-da-Silva et al. (2025).

### 2.7 Software quality assurance

The platform includes 45 automated unit tests covering the Holt-Winters engine (9 tests: horizon, parameters, CI expansion, CI ordering, benchmark, fallback, clamping, RMSE, period generation), scenario engine (7 tests: all transformation types, immutability, impact metrics), risk engine (4 tests: counts, scoring, ordering, cap), configuration integrity (15 tests across 6 config files), API layer (4 tests), and static data (4 tests). Tests run in under 500ms.

---

## 3. Results

### 3.1 Portal overview

The platform comprises 15 pages covering the complete analytical pipeline: descriptive monitoring (Dashboard, 5 Axis pages, Transversal Programmes, About), analytical tools (ULS Comparator, Prospective Analysis, Benchmarking, Scenario Simulator, Alerts Dashboard, International Comparison), and reporting (PDF Report Generator). The platform is accessible at petspt-f019f.web.app.

### 3.2 Descriptive monitoring

Of the 54 PETS measures tracked, 29 (53.7%) are classified as completed, 20 (37.0%) as in progress, 2 (3.7%) as partially implemented, and 3 (5.6%) as not implemented, based on the April 2025 GT PETS report. All three non-implemented measures belong to Axis 2 (maternal-infant health) and are classified as structural (long-term) priority.

### 3.3 Territorial risk assessment

Applying the forecasting engine across 8 indicators and 39 ULS generates up to 312 risk assessments. The proportion of assessments classified as grey (insufficient data) varies by dataset temporal coverage, with post-2024 datasets yielding more grey classifications due to shorter series lengths.

### 3.4 QGR revision analysis

Comparison of QGR 2024-2026 (Despacho 6770/2024) with QGR 2025-2027 (Despacho 14012/2025) reveals systematic downward revisions: the national surgery target for 2025 was reduced from 833,000 to 778,000 (-6.6%), the workforce growth limit from 5% to 1.9%, and the total workforce target from 164,822 to 153,896 (-6.6%). The family physician coverage target for 2026 was reduced from 98% to 88%.

### 3.5 Scenario simulation examples

The what-if scenario simulator enables quantification of policy alternatives. Three illustrative examples demonstrate the platform's analytical capability.

The "SNS24 Coverage Expansion" scenario models the projected impact of the remaining 12 ULS joining the Ligue Antes, Salve Vidas telephone triage system, adding approximately 2.5 million users (31.6% increase in demand). With the current installed capacity of approximately 600,000 calls per month, the scenario projects significant unmet demand during winter peak periods, consistent with the findings of Goiana-da-Silva et al. (2025). Increasing capacity to 800,000 calls per month (via PPP workforce reinforcement) substantially reduces but does not eliminate the projected gap.

The "GP Recruitment" scenario models the impact of contracting additional family physicians, each covering approximately 1,800 patients. Recruiting 500 additional GPs would reduce the unassigned patient population by approximately 900,000 over the projection horizon, bringing coverage closer to the QGR 2024-2026 target of 98% (though the revised QGR 2025-2027 reduced this target to 88%).

The "Budget Variation" scenario illustrates the sensitivity of production targets to budget allocation. A 1 percentage point increase in the SNS budget growth rate (from 4.83% to 5.83%) projects an increase of approximately 8,000 additional surgeries annually, assuming a linear relationship between funding and output — a simplification that does not account for workforce constraints, infrastructure capacity, or diminishing marginal returns.

### 3.6 International context

Portugal's caesarean section rate (33%) exceeds the EU-27 average (27%) by 6 percentage points, placing it among the highest in Western Europe alongside Italy (32%) and Germany (31%). Hospital bed density (355 per 100,000 inhabitants) is 33% below the EU average (530) and 55% below Germany's rate (780). Health expenditure as a share of GDP (10.6%) is close to the EU average (10.9%) but significantly below France (12.1%) and Germany (12.7%). These comparisons provide context for the ambition level of QGR targets and the structural constraints facing the PETS reform.

### 3.7 Technical performance

The production build achieves a main bundle size of approximately 111 KB gzipped, with code-split chunks for Recharts (124 KB), PDF generation (175 KB), and Firebase (80 KB). Page load times from Firestore-backed data are typically under 500ms for pre-aggregated datasets. The Holt-Winters engine executes a full 36-month series optimisation in approximately 50ms in the browser (Chrome, M1 processor). The risk assessment batch (8 indicators x approximately 30 ULS with sufficient data) completes in approximately 12-15 seconds with 200ms API throttling between requests.

---

## 4. Discussion

### 4.1 Principal findings

To our knowledge, PETS Monitor is the first open-source, real-time monitoring dashboard for a national health system reform plan that integrates descriptive tracking, time series forecasting, contract compliance benchmarking, and interactive policy simulation in a single platform. The platform demonstrates that actionable prospective intelligence can be derived from routine publicly available administrative data at minimal cost.

### 4.2 Comparison with existing approaches

Existing health system monitoring tools fall into three categories: retrospective reports (OECD Health at a Glance, WHO Health Systems Performance Assessment), national statistical dashboards (NHS England monthly statistics), and pandemic-specific dashboards (numerous COVID-19 trackers). PETS Monitor is distinctive in combining prospective forecasting with institutional benchmarking and policy simulation, addressing the monitoring gaps identified by Smith et al. (2009).

The COVID-19 pandemic demonstrated both the feasibility and public demand for real-time health data dashboards. Platforms such as the Johns Hopkins CSSE dashboard, Our World in Data, and national dashboards (including Portugal's DGS dashboard) showed that open data, updated daily or weekly, can inform public discourse and policy decisions. However, these were single-purpose (pandemic tracking) and typically descriptive (no forecasting or scenario modeling). PETS Monitor extends this paradigm to structural health reform monitoring, demonstrating that the same technological approach can be applied to multi-dimensional reform tracking with prospective and simulation capabilities.

The OECD Health Systems Performance Assessment (HSPA) framework (Papanicolas and Smith, 2013) provides a comprehensive conceptual model for performance measurement but is implemented primarily through periodic reports rather than real-time tools. The balanced scorecard approach (Kaplan and Norton, 1996), adapted for the public sector by Niven (2003), provides the multi-dimensional perspective that PETS Monitor operationalises through its five-axis structure combined with cross-cutting analytical layers.

### 4.3 Policy implications

The platform serves several policy functions. First, it enhances **accountability** by making contract compliance publicly visible for each ULS. Second, it provides **early warning** by identifying institutions on trajectories of non-compliance before annual reporting cycles. Third, it enables **scenario planning** by quantifying the expected impact of policy alternatives. Fourth, it documents **target revisions** — the QGR 2025-2027's downward revision of multiple targets compared to QGR 2024-2026 is transparently visible.

### 4.4 Methodological considerations

The Holt-Winters additive model offers several advantages for this application: interpretability of components, no stationarity requirement, and browser-executable performance. However, it assumes constant seasonal patterns and does not incorporate exogenous variables. The ETS framework (Hyndman et al., 2008) encompasses 30 model variants; future work could implement automatic model selection via information criteria.

The what-if simulation engine uses linear and multiplicative transformations that represent simplified causal relationships. A system dynamics approach (Homer & Hirsch, 2006; Sterman, 2000) would better capture feedback loops and non-linear interactions but at the cost of model complexity and parameterisation requirements.

### 4.5 Limitations

Several limitations should be acknowledged. First, the platform relies on aggregated administrative data that may not capture clinical outcomes or patient experience. Second, capacity benchmarks are static and may not reflect true operational throughput. Third, Contract Programme data extraction via regex achieves 40-70% field coverage, with remaining fields using budget-proportional projections. Fourth, AI-generated summaries are produced by large language models and have not been peer-reviewed. Fifth, the Eurostat comparison is limited to three indicators. Sixth, the platform is independent and not endorsed by the Portuguese Ministry of Health.

### 4.6 Future directions

Several extensions are planned or feasible: (i) automatic model selection from the full ETS/ARIMA framework via server-side Python computation; (ii) integration of patient-level outcome data if available through linked datasets; (iii) cross-service spillover analysis following Goiana-da-Silva et al.'s observation of increased INEM call volumes potentially linked to SNS24 saturation; (iv) multi-country deployment for comparative health reform monitoring within the EU.

---

## 5. Conclusions

The PETS Monitor demonstrates that an open-source, browser-based dashboard can transform publicly available administrative data into a comprehensive monitoring, forecasting, and policy simulation platform for national health system reform. By combining Holt-Winters exponential smoothing with contract compliance benchmarking and interactive scenario modeling, the platform provides decision-makers with forward-looking, actionable intelligence at zero marginal operational cost for most analytical features. The architecture and methodology are fully portable to other health systems with public data APIs, offering a replicable model for evidence-informed health reform governance.

---

## Data Availability Statement

All data used in this study are publicly available from the Portuguese NHS Transparency Portal (transparencia.sns.gov.pt), Eurostat (ec.europa.eu/eurostat), the ACSS website (acss.min-saude.pt), and the Portuguese Official Gazette (Diario da Republica). The complete source code, including data extraction pipelines, forecasting engine, and frontend application, is available at github.com/dpolonia/petspt under the MIT open-source license.

## Author Contributions

[To be completed]

## Funding

[To be completed]

## Conflict of Interest

The authors declare that the research was conducted in the absence of any commercial or financial relationships that could be construed as a potential conflict of interest.

---

## References

1. Cairney P (2016). The Politics of Evidence-Based Policy Making. London: Palgrave Macmillan.
2. Eurostat (2023). Healthcare resource statistics. Luxembourg: European Commission.
3. Goiana-da-Silva F, Leite A, Perelman J, et al. (2025). The growing pains of the 2024/2025 Portugal's NHS telephone triage system national rollout. Frontiers in Public Health, 13:1694713.
4. Homer JB, Hirsch GB (2006). System dynamics modeling for public health: background and opportunities. American Journal of Public Health, 96(3):452-458.
5. Hyndman RJ, Athanasopoulos G (2018). Forecasting: Principles and Practice, 3rd edition. Melbourne: OTexts.
6. Hyndman RJ, Koehler AB, Ord JK, Snyder RD (2008). Forecasting with Exponential Smoothing: The State Space Approach. Berlin: Springer.
7. Kaplan RS, Norton DP (1996). The Balanced Scorecard: Translating Strategy into Action. Boston: Harvard Business Press.
8. Ministerio da Saude (2024). Plano de Emergencia e Transformacao da Saude. Lisboa.
9. Niven PR (2003). Balanced Scorecard Step-by-Step for Government and Nonprofit Agencies. Hoboken: Wiley.
10. OECD (2023). Health at a Glance 2023: OECD Indicators. Paris: OECD Publishing.
11. Papanicolas I, Smith PC (2013). Health System Performance Comparison: An Agenda for Policy, Information and Research. Maidenhead: Open University Press.
12. Smith PC, Mossialos E, Papanicolas I, Leatherman S (2009). Performance Measurement for Health System Improvement. Cambridge: Cambridge University Press.
13. Sterman JD (2000). Business Dynamics: Systems Thinking and Modeling for a Complex World. Boston: McGraw-Hill.
14. WHO (2023). Early Warning, Alert and Response Systems. Geneva: World Health Organization.
15. Winters PR (1960). Forecasting sales by exponentially weighted moving averages. Management Science, 6(3):324-342.
16. Despacho n.o 6770/2024 de 18 de Junho. Diario da Republica, Serie II, n.o 116.
17. Despacho n.o 14012/2025 de 25 de Novembro. Diario da Republica, Serie II, n.o 228.
