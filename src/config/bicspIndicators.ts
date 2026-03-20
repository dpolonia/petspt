/**
 * BI-CSP and SDM indicator mappings to PETS measures.
 *
 * BI-CSP (bicsp.min-saude.pt): Primary health care BI platform.
 * - 20 Power BI reports at 5 levels (Nacional/ARS/ACES/ULS/UF)
 * - Organization-level Power BI (requires institutional auth)
 * - Data NOT publicly extractable via API
 *
 * SDM (sdm.min-saude.pt): Public indicator definitions.
 * - 33+ PETS-relevant indicators with formulas, targets, methodology
 * - Source: SIARS (primary care information system)
 * - Accessible at sdm.min-saude.pt/bi.aspx?id=NNN&clusters=S
 *
 * These mappings enable cross-referencing PETS measures with the
 * established contractualization indicator framework.
 */

export interface SDMIndicator {
  id: number;
  name: string;
  siarsCode?: string;
  description: string;
  petsRelevance: string;
  petsMeasures: string[];
  dataSource: string;
  granularity: string[];
}

export interface BICSPReportConfig {
  level: 'NACIONAL' | 'ARS' | 'ACES' | 'ULS' | 'UF';
  tab: string;
  ufTypes: string[];
  filterTables: string[];
  filterColumns: string[];
  accessType: 'organization';
}

/** SDM indicators mapped to PETS measures */
export const SDM_PETS_MAPPINGS: SDMIndicator[] = [
  // ═══ E4 — Saude Proxima e Familiar ═══
  {
    id: 2, name: 'Taxa de utilizacao global de consultas medicas',
    siarsCode: '2013.002.01',
    description: 'Proporcao de utentes inscritos com consulta medica nos ultimos 12 meses',
    petsRelevance: 'Mede acesso a consultas CSP — indicador base para E4.A2 (Batas Brancas)',
    petsMeasures: ['E4.A2', 'E4.B1'],
    dataSource: 'SIARS', granularity: ['USF', 'UCSP', 'ACES', 'ARS', 'Nacional'],
  },
  {
    id: 5, name: 'Proporcao de consultas realizadas pelo Enfermeiro de Familia',
    description: 'Proporcao de consultas de enfermagem pelo enfermeiro de familia atribuido',
    petsRelevance: 'Efetividade da atribuicao de equipas de familia — proxy para E4.A1',
    petsMeasures: ['E4.A1'],
    dataSource: 'SIARS', granularity: ['USF', 'UCSP', 'ACES'],
  },
  {
    id: 6, name: 'Taxa de utilizacao de consultas medicas - 3 anos',
    description: 'Utentes com consulta nos ultimos 3 anos (identificacao de desligados)',
    petsRelevance: 'Identifica utentes sem contacto prolongado — complementar a E4.A1',
    petsMeasures: ['E4.A1'],
    dataSource: 'SIARS', granularity: ['USF', 'UCSP', 'ACES', 'ARS', 'Nacional'],
  },
  {
    id: 7, name: 'Proporcao de utilizadores referenciados para consulta hospitalar',
    description: 'Referenciacao de CSP para consulta hospitalar',
    petsRelevance: 'Mede articulacao CSP-Hospital — relevante para E1.B3 (consultas especialidade)',
    petsMeasures: ['E1.B3', 'E4.A2'],
    dataSource: 'SIARS', granularity: ['USF', 'UCSP', 'ACES'],
  },

  // ═══ E2 — Bebes e Maes em Seguranca ═══
  {
    id: 8, name: 'Taxa de utilizacao de consultas de Planeamento Familiar',
    description: 'Mulheres com consulta PF nos ultimos 12 meses',
    petsRelevance: 'Cobertura planeamento familiar — contexto para E2 (saude materna)',
    petsMeasures: ['E2.A1'],
    dataSource: 'SIARS', granularity: ['USF', 'UCSP', 'ACES'],
  },
  {
    id: 11, name: 'Proporcao de gravidas com 1a consulta no 1o trimestre',
    description: 'Vigilancia pre-natal precoce',
    petsRelevance: 'Qualidade cuidados pre-natais — complementar a E2.A1 (SNS Gravida)',
    petsMeasures: ['E2.A1', 'E2.B2'],
    dataSource: 'SIARS', granularity: ['USF', 'UCSP', 'ACES', 'ARS'],
  },
  {
    id: 12, name: 'Proporcao de gravidas com 6+ consultas enfermagem saude materna',
    description: 'Adequacao vigilancia enfermagem na gravidez',
    petsRelevance: 'Cuidados de enfermagem obstetrica — complementar a E2.C2 (EESMO)',
    petsMeasures: ['E2.C2'],
    dataSource: 'SIARS', granularity: ['USF', 'UCSP', 'ACES'],
  },
  {
    id: 13, name: 'Proporcao de puerperas com domicilio de enfermagem',
    description: 'Visita domiciliaria pos-parto nos primeiros 42 dias',
    petsRelevance: 'Cuidados pos-parto domiciliarios — complementar a E2',
    petsMeasures: ['E2.A2'],
    dataSource: 'SIARS', granularity: ['USF', 'UCSP', 'ACES'],
  },
  {
    id: 14, name: 'Proporcao de recem-nascidos com consulta medica ate 28 dias',
    description: 'Vigilancia neonatal precoce',
    petsRelevance: 'Rastreio neonatal — complementar a E2.B4 (pediatria)',
    petsMeasures: ['E2.B4'],
    dataSource: 'SIARS', granularity: ['USF', 'UCSP', 'ACES'],
  },

  // ═══ E3 — Cuidados Urgentes ═══
  {
    id: 411, name: 'Taxa ajustada de utilizadores muito frequentes do SU',
    siarsCode: '2018.411.01',
    description: 'Utilizadores com >=10 episodios SU/ano por 100 inscritos, padronizada',
    petsRelevance: 'Proxy para impacto dos CAC na reducao de utilizacao do SU',
    petsMeasures: ['E3.A2', 'E3.C1'],
    dataSource: 'SIARS', granularity: ['USF', 'UCSP', 'ACES', 'ARS', 'Nacional'],
  },
  {
    id: 412, name: 'Proporcao de consultas de doenca aguda na UF de inscricao',
    description: 'Capacidade dos CSP para absorver doenca aguda vs ida ao SU',
    petsRelevance: 'Mede se utentes recorrem ao CSP em vez do SU — impacto E3.A3',
    petsMeasures: ['E3.A3'],
    dataSource: 'SIARS', granularity: ['USF', 'UCSP', 'ACES'],
  },

  // ═══ E4 — Rastreios e Gestao Doenca ═══
  {
    id: 277, name: 'Proporcao de fumadores com consulta tabaco no ultimo ano',
    description: 'Cobertura de intervencoes de cessacao tabagica',
    petsRelevance: 'Indicador de rastreio/intervencao preventiva — contexto E4.C2',
    petsMeasures: ['E4.C2'],
    dataSource: 'SIARS', granularity: ['USF', 'UCSP', 'ACES'],
  },
  {
    id: 435, name: 'Proporcao de utentes com vacina gripe gratuita no SNS',
    description: 'Cobertura vacinal gripe em populacao elegivel',
    petsRelevance: 'Vacinacao — complementar a E3.B3 (vacinacao gripe e VSR)',
    petsMeasures: ['E3.B3'],
    dataSource: 'SIARS', granularity: ['USF', 'UCSP', 'ACES', 'ARS', 'Nacional'],
  },
  {
    id: 428, name: 'Score dimensao seguranca de utentes',
    description: 'Avaliacao da implementacao de processos de melhoria da seguranca do doente',
    petsRelevance: 'Qualidade CSP — contexto geral para E4',
    petsMeasures: ['E4.B3'],
    dataSource: 'SIARS', granularity: ['USF', 'UCSP'],
  },
];

/** BI-CSP report structure discovered via SharePoint REST API */
export const BICSP_REPORT_STRUCTURE: BICSPReportConfig[] = [
  { level: 'NACIONAL', tab: 'QUEM SERVIMOS', ufTypes: [], filterTables: ['Tempo'], filterColumns: ['Cod. Mes'], accessType: 'organization' },
  { level: 'NACIONAL', tab: 'O QUE FAZEMOS', ufTypes: [], filterTables: [], filterColumns: [], accessType: 'organization' },
  { level: 'NACIONAL', tab: 'COMO FAZEMOS', ufTypes: [], filterTables: ['Local Prescricao'], filterColumns: ['Cod. ARS'], accessType: 'organization' },
  { level: 'ARS', tab: 'QUEM SERVIMOS', ufTypes: [], filterTables: ['Local Inscricao', 'Tempo'], filterColumns: ['Cod. ARS', 'Cod. Mes'], accessType: 'organization' },
  { level: 'ACES', tab: 'QUEM SERVIMOS', ufTypes: [], filterTables: ['Local Inscricao', 'Tempo'], filterColumns: ['Cod. ACeS', 'Cod. Mes'], accessType: 'organization' },
  { level: 'ULS', tab: 'QUEM SERVIMOS', ufTypes: [], filterTables: ['Local Inscricao', 'Tempo'], filterColumns: ['Cod. ULS', 'Cod. Mes'], accessType: 'organization' },
  { level: 'ULS', tab: 'O QUE FAZEMOS', ufTypes: [], filterTables: ['Dim ACES'], filterColumns: ['Cod. ULS'], accessType: 'organization' },
  { level: 'ULS', tab: 'QUEM SOMOS', ufTypes: [], filterTables: ['Hierarquia Local', 'Tempo'], filterColumns: ['Cod. ULS', 'Cod. Mes'], accessType: 'organization' },
  { level: 'UF', tab: 'QUEM SERVIMOS', ufTypes: ['USF-A', 'USF-B', 'UCSP'], filterTables: ['Local Inscricao', 'Tempo'], filterColumns: ['Cod. UF', 'Cod. Mes'], accessType: 'organization' },
  { level: 'UF', tab: 'O QUE FAZEMOS', ufTypes: ['USF-A', 'USF-B', 'UCSP'], filterTables: ['Dim UF'], filterColumns: ['Cod. UF'], accessType: 'organization' },
  { level: 'UF', tab: 'COMO FAZEMOS', ufTypes: ['UCC', 'USF-A', 'USF-B', 'UCSP', 'USP', 'CDP', 'SAP', 'URAP'], filterTables: ['Local Prescricao'], filterColumns: ['Cod. Unid. Observacao'], accessType: 'organization' },
];

/**
 * Summary of BI-CSP data that EXISTS but is NOT publicly accessible:
 *
 * A) Unit profiles: name, mission, address, coordinator for ~1227 units
 * B) IDG time series: monthly values per unit with IPDA component
 * C) IDS per dimension: Acesso, Gestao Doenca, Gestao Saude, Prescricao
 * D) IDE: 920 units with min/median/max performance metrics
 * E) IDG UF: 1227 units — UCC (61.25), UCSP (48.95), USF-B (67) averages
 * F) IDG ACES: 39 CSP da ULS with regional comparison
 * G) Matriz Indicadores CSP: hundreds of indicators by ARS/Tipo UF
 * H) Staffing: ETC Medicos, Enfermeiros, Med. Internos per unit
 * I) Inscritos: N inscritos, unidades ponderadas per unit
 *
 * All above requires institutional auth (@arsXXX.min-saude.pt).
 * Power BI reports use organization workspace (groups/GUID/reports/),
 * NOT "Publish to Web" — querydata API extraction is NOT possible.
 */
export const BICSP_DATA_SUMMARY = {
  totalUnits: 1227,
  unitTypes: ['USF-A', 'USF-B', 'UCSP', 'UCC', 'USP', 'URAP', 'CDP', 'SAP'],
  ideUnits: 920,
  ulsCount: 39,
  accessRequired: 'Institutional email (@arsXXX.min-saude.pt)',
  powerBiType: 'Organization workspace (NOT Publish to Web)',
  dataExtractable: false,
  sdmPublicIndicators: 33,
  pbiWorkspaces: [
    '375c253b-1d95-42e5-b52f-d3c228d24ec0',
    '0dc4a48b-8d2b-4c13-9619-e5bcf58d946d',
  ],
};
