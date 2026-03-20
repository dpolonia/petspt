/**
 * Data from the official SNS PETS portal (sns.gov.pt).
 *
 * BREAKTHROUGH (March 2026):
 * While the eixo pages only contain Power BI iframes (no JS charts),
 * the Power BI data IS programmatically extractable via the public
 * querydata API at wabi-north-europe-api.analysis.windows.net.
 *
 * Method:
 * 1. Decoded iframe src "r" parameter (base64 JSON with resourceKey + tenantId)
 * 2. Resolved cluster URL via embed page JS (getAPIMUrl function)
 * 3. Queried /public/reports/{key}/modelsAndExploration for table/column schema
 * 4. POSTed semantic queries to /public/reports/querydata
 *
 * Results: 2,164 data points extracted across 43 series from ALL 5 eixos:
 * - Eixo 1: 6 series, 198 points (surgeries onco/non-onco, consultations, LIC waiting lists)
 * - Eixo 2: 9 series, 211 points (births, cesareans, SNS24 Grávida, echographies)
 * - Eixo 3: 10 series, 1609 points (CAC, teleconsultas, encaminhamentos SU/CSP, vacinas)
 * - Eixo 4: 13 series, 112 points (utentes com/sem MdF, consultas CSP, ULS, SCM)
 * - Eixo 5: 5 series, 34 points (psychology/psychiatry episodes, TMRG)
 *
 * Eixos 3 & 4 used PBIX v3 format with visual configs in binary resource packages.
 * Table names were discovered via Playwright network interception, then queried via API.
 *
 * Full data saved in: data/sns_pets/powerbi_extracted_data.json
 * Model schemas saved in: data/sns_pets/eixo{1-5}_model.json
 *
 * Power BI embed URLs and report details:
 */

export interface SNSPortalPage {
  eixo: number;
  url: string;
  powerBiUrl: string;
  powerBiReportId: string;
  contentType: 'powerbi_embed';
  openDataEquivalent: boolean;
  transparencyGap: string;
  inlineData?: Record<string, string | number>;
}

export const SNS_PORTAL_PAGES: SNSPortalPage[] = [
  {
    eixo: 1, url: 'https://www.sns.gov.pt/plano-de-emergencia-e-transformacao-na-saude-eixo-1/',
    powerBiUrl: 'https://app.powerbi.com/view?r=eyJrIjoiYjNiNDFmZTAtOTFiMy00ZjFkLTljMGMtNzJhYjg5NmZiZmMwIiwidCI6IjIyYzg0NjA4LWYwMWQtNDZjNS04MDI0LTYzY2M5NjJlNWY1MSIsImMiOjh9',
    powerBiReportId: 'b3b41fe0-91b3-4f1d-9c0c-72ab896fbfc0',
    contentType: 'powerbi_embed',
    openDataEquivalent: false,
    transparencyGap: 'Dados de listas de espera cirurgicas e TMRG em Power BI (fontes: SIGLIC, SICA). Sem API aberta. Dataset LIC parcial na Transparencia SNS (sem patologia oncologica). Power BI mostra cirurgias onco/nao-onco e consultas hospitalares mensais.',
  },
  {
    eixo: 2, url: 'https://www.sns.gov.pt/plano-de-emergencia-e-transformacao-na-saude-eixo-2/',
    powerBiUrl: 'https://app.powerbi.com/view?r=eyJrIjoiNzJlMmEwNWMtMTc0Zi00MDFiLWI2MDgtODRlODNhODNlNjBiIiwidCI6IjIyYzg0NjA4LWYwMWQtNDZjNS04MDI0LTYzY2M5NjJlNWY1MSIsImMiOjh9',
    powerBiReportId: '72e2a05c-174f-401b-b608-84e83a83e60b',
    contentType: 'powerbi_embed',
    openDataEquivalent: false,
    transparencyGap: 'Dados de partos e saude materno-infantil em Power BI. Dataset partos-e-cesarianas parcial (sem SNS Gravida). Power BI mostra triagens SNS24 Gravida e encaminhamentos mensais.',
  },
  {
    eixo: 3, url: 'https://www.sns.gov.pt/plano-de-emergencia-e-transformacao-na-saude-eixo-3/',
    powerBiUrl: 'https://app.powerbi.com/view?r=eyJrIjoiZmIzZWQ4ZjAtOWQ0Ni00MzM1LTgxMDAtNGY3ZjllNWQ3YmExIiwidCI6IjIyYzg0NjA4LWYwMWQtNDZjNS04MDI0LTYzY2M5NjJlNWY1MSIsImMiOjh9',
    powerBiReportId: 'fb3ed8f0-9d46-4335-8100-4f7f9e5d7ba1',
    contentType: 'powerbi_embed',
    openDataEquivalent: false,
    transparencyGap: 'Dados de urgencias e CAC em Power BI. Sem dataset publico de CAC. Dataset urgencias parcial.',
  },
  {
    eixo: 4, url: 'https://www.sns.gov.pt/plano-de-emergencia-e-transformacao-na-saude-eixo-4/',
    powerBiUrl: 'https://app.powerbi.com/view?r=eyJrIjoiODI5Yzk0MWQtZjhhMC00MDk2LTg5MzAtZmYwNDMwNDY1YWM3IiwidCI6IjIyYzg0NjA4LWYwMWQtNDZjNS04MDI0LTYzY2M5NjJlNWY1MSIsImMiOjh9',
    powerBiReportId: '829c941d-f8a0-4096-8930-ff0430465ac7',
    contentType: 'powerbi_embed',
    openDataEquivalent: false,
    transparencyGap: 'Dados de CSP e medicos de familia em Power BI. Dataset utentes-inscritos-csp existe mas Batas Brancas e USF-C nao.',
    inlineData: {
      meta_utentes_com_mdf: 350000,
      meta_municipios: '100+',
      meta_usf_c: 20,
      nota: 'Metas em texto HTML na pagina, nao em dados estruturados',
    },
  },
  {
    eixo: 5, url: 'https://www.sns.gov.pt/plano-de-emergencia-e-transformacao-na-saude-eixo-5/',
    powerBiUrl: 'https://app.powerbi.com/view?r=eyJrIjoiOWE0NTI1YTItMTgzMC00ZWZlLTg4NTEtNmIxYjRkNGEyMTkyIiwidCI6IjIyYzg0NjA4LWYwMWQtNDZjNS04MDI0LTYzY2M5NjJlNWY1MSIsImMiOjh9',
    powerBiReportId: '9a4525a2-1830-4efe-8851-6b1b4d4a2192',
    contentType: 'powerbi_embed',
    openDataEquivalent: false,
    transparencyGap: 'Dados de saude mental em Power BI. Sem dataset publico de ECSM, CRI, ou psicologos por especialidade.',
  },
];

/**
 * TRANSPARENCY FINDING (March 2026):
 *
 * The official portal uses Power BI "Publish to Web" embeds.
 * While the HTML contains NO data, the Power BI public API IS accessible.
 *
 * WHAT WORKS:
 * - Power BI querydata API responds to semantic queries
 * - Model schemas (tables, measures) are fully exposed
 * - Monthly data from Jan 2023 to Jan 2026 is extractable
 * - Eixos 1, 2, 5 fully queryable (443 data points extracted)
 * - Data confirmed from SIGLIC and SICA systems
 *
 * WHAT DOESN'T WORK:
 * - Eixos 3, 4 use resource-package visual configs (different format)
 * - No official open data API exists for this data
 * - The querydata endpoint is undocumented and could change
 * - Data requires custom DSR v2 format parser
 *
 * REMAINING TRANSPARENCY GAP:
 * Despite extraction success, this data should be published as
 * open data via Transparencia SNS API or dados.gov.pt.
 * The current approach requires reverse-engineering a proprietary API.
 *
 * KEY INSIGHT: The Power BI "Publish to Web" feature exposes data
 * via the public querydata API. This is a known characteristic
 * documented by Nokod Security (2024). Any "Publish to Web" report
 * effectively makes its underlying data public via this API.
 */
