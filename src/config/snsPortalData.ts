/**
 * Data from the official SNS PETS portal (sns.gov.pt).
 *
 * KEY FINDING: All 5 eixo pages use embedded Power BI dashboards.
 * The PETS monitoring data is locked inside Power BI — NOT available
 * as open data, NOT accessible via API, NOT scrapable.
 *
 * This is a significant transparency gap: the government monitors
 * PETS implementation via Power BI, but citizens cannot independently
 * access or verify the underlying data.
 *
 * Power BI embed URLs discovered via scraping (March 2026):
 */

export interface SNSPortalPage {
  eixo: number;
  url: string;
  powerBiUrl: string;
  powerBiReportId: string;
  contentType: 'powerbi_embed';
  openDataEquivalent: boolean;
  transparencyGap: string;
}

export const SNS_PORTAL_PAGES: SNSPortalPage[] = [
  {
    eixo: 1, url: 'https://www.sns.gov.pt/plano-de-emergencia-e-transformacao-na-saude-eixo-1/',
    powerBiUrl: 'https://app.powerbi.com/view?r=eyJrIjoiYjNiNDFmZTAtOTFiMy00ZjFkLTljMGMtNzJhYjg5NmZiZmMwIiwidCI6IjIyYzg0NjA4LWYwMWQtNDZjNS04MDI0LTYzY2M5NjJlNWY1MSIsImMiOjh9',
    powerBiReportId: 'b3b41fe0-91b3-4f1d-9c0c-72ab896fbfc0',
    contentType: 'powerbi_embed',
    openDataEquivalent: false,
    transparencyGap: 'Dados de listas de espera cirurgicas e TMRG em Power BI. Sem API aberta. Dataset LIC parcial na Transparencia SNS (sem patologia oncologica).',
  },
  {
    eixo: 2, url: 'https://www.sns.gov.pt/plano-de-emergencia-e-transformacao-na-saude-eixo-2/',
    powerBiUrl: 'https://app.powerbi.com/view?r=eyJrIjoiNzJlMmEwNWMtMTc0Zi00MDFiLWI2MDgtODRlODNhODNlNjBiIiwidCI6IjIyYzg0NjA4LWYwMWQtNDZjNS04MDI0LTYzY2M5NjJlNWY1MSIsImMiOjh9',
    powerBiReportId: '72e2a05c-174f-401b-b608-84e83a83e60b',
    contentType: 'powerbi_embed',
    openDataEquivalent: false,
    transparencyGap: 'Dados de partos e saude materno-infantil em Power BI. Dataset partos-e-cesarianas parcial (sem SNS Gravida).',
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
    powerBiReportId: '829c941d-f8a0-4096-8930-ff043046 5ac7',
    contentType: 'powerbi_embed',
    openDataEquivalent: false,
    transparencyGap: 'Dados de CSP e medicos de familia em Power BI. Dataset utentes-inscritos-csp existe mas Batas Brancas e USF-C nao.',
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
 * TRANSPARENCY FINDING:
 * The official Portuguese government portal for PETS monitoring
 * (sns.gov.pt/plano-de-emergencia-e-transformacao-na-saude/)
 * presents ALL eixo data via embedded Power BI dashboards.
 *
 * Power BI dashboards are:
 * - NOT accessible via API (no open data endpoint)
 * - NOT scrapable (data rendered client-side in iframe)
 * - NOT downloadable (no export to CSV/JSON)
 * - NOT verifiable independently (opaque data source)
 *
 * This means the government HAS the data for all 54 measures
 * but chooses to present it in a non-open, non-verifiable format.
 *
 * RECOMMENDATION: Publish the underlying Power BI datasets
 * as open data via the Transparencia SNS API or dados.gov.pt.
 * This would immediately raise the average monitorability grade
 * from ~3.4/10 to an estimated ~7/10.
 */
