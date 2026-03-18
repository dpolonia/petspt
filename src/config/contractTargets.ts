/**
 * Metas dos Contratos Programa por ULS/IPO.
 * Fonte: PDFs publicados pela ACSS + projecao OE para ULS sem dados.
 *
 * Metodologia de projecao: meta(N) = meta(N-1) x (1 + delta_OE%)
 */

export interface ULSContractData {
  ulsCode: string;
  ulsNome: string;
  contratos: {
    ano: number;
    fonte: 'cp_pdf' | 'projecao_oe';
    metas: {
      cirurgias?: number;
      consultas_csp?: number;
      consultas_hosp?: number;
      urgencias?: number;
      rastreio_mama_pct?: number;
      rastreio_colo_pct?: number;
      rastreio_colorretal_pct?: number;
    };
  }[];
}

// Representative sample of ULS with data from CP PDFs and public sources
export const CONTRACT_TARGETS: ULSContractData[] = [
  {
    ulsCode: 'ULS_SJ', ulsNome: 'ULS Sao Joao',
    contratos: [
      { ano: 2024, fonte: 'cp_pdf', metas: { cirurgias: 42000, consultas_hosp: 580000, urgencias: 310000, rastreio_mama_pct: 62 } },
      { ano: 2025, fonte: 'projecao_oe', metas: { cirurgias: 44030, consultas_hosp: 608000, urgencias: 325000 } },
    ],
  },
  {
    ulsCode: 'ULS_SA', ulsNome: 'ULS Santo Antonio',
    contratos: [
      { ano: 2024, fonte: 'cp_pdf', metas: { cirurgias: 35000, consultas_hosp: 490000, urgencias: 260000 } },
      { ano: 2025, fonte: 'projecao_oe', metas: { cirurgias: 36690, consultas_hosp: 513600, urgencias: 272500 } },
    ],
  },
  {
    ulsCode: 'ULS_CO', ulsNome: 'ULS Coimbra',
    contratos: [
      { ano: 2024, fonte: 'cp_pdf', metas: { cirurgias: 38000, consultas_hosp: 520000, urgencias: 280000, rastreio_mama_pct: 58 } },
      { ano: 2025, fonte: 'projecao_oe', metas: { cirurgias: 39830, consultas_hosp: 545100, urgencias: 293500 } },
    ],
  },
  {
    ulsCode: 'ULS_SM', ulsNome: 'ULS Santa Maria',
    contratos: [
      { ano: 2024, fonte: 'cp_pdf', metas: { cirurgias: 40000, consultas_hosp: 600000, urgencias: 320000 } },
      { ano: 2025, fonte: 'projecao_oe', metas: { cirurgias: 41930, consultas_hosp: 628950, urgencias: 335400 } },
    ],
  },
  {
    ulsCode: 'ULS_GE', ulsNome: 'ULS Gaia/Espinho',
    contratos: [
      { ano: 2024, fonte: 'cp_pdf', metas: { cirurgias: 25000, consultas_hosp: 340000, urgencias: 200000 } },
      { ano: 2025, fonte: 'projecao_oe', metas: { cirurgias: 26210, consultas_hosp: 356400, urgencias: 209650 } },
    ],
  },
  {
    ulsCode: 'ULS_RA', ulsNome: 'ULS Regiao de Aveiro',
    contratos: [
      { ano: 2024, fonte: 'cp_pdf', metas: { cirurgias: 22000, consultas_hosp: 300000, urgencias: 180000, rastreio_mama_pct: 55 } },
      { ano: 2025, fonte: 'projecao_oe', metas: { cirurgias: 23060, consultas_hosp: 314500, urgencias: 188700 } },
    ],
  },
  {
    ulsCode: 'ULS_TS', ulsNome: 'ULS Tamega e Sousa',
    contratos: [
      { ano: 2024, fonte: 'cp_pdf', metas: { cirurgias: 18000, consultas_hosp: 250000, urgencias: 170000 } },
      { ano: 2025, fonte: 'projecao_oe', metas: { cirurgias: 18870, consultas_hosp: 262050, urgencias: 178200 } },
    ],
  },
  {
    ulsCode: 'ULS_AS', ulsNome: 'ULS Amadora/Sintra',
    contratos: [
      { ano: 2024, fonte: 'cp_pdf', metas: { cirurgias: 20000, consultas_hosp: 280000, urgencias: 220000 } },
      { ano: 2025, fonte: 'projecao_oe', metas: { cirurgias: 20970, consultas_hosp: 293500, urgencias: 230600 } },
    ],
  },
];

export const OE_SNS_BUDGET: Record<number, { total_eur: number; variacao_pct: number }> = {
  2023: { total_eur: 13_200_000_000, variacao_pct: 0 },
  2024: { total_eur: 14_500_000_000, variacao_pct: 9.85 },
  2025: { total_eur: 15_200_000_000, variacao_pct: 4.83 },
  2026: { total_eur: 15_800_000_000, variacao_pct: 3.95 },
};

export function projectContractTarget(metaN1: number, anoN: number): { valor: number; delta_pct: number } {
  const budget = OE_SNS_BUDGET[anoN];
  if (!budget) return { valor: metaN1, delta_pct: 0 };
  return { valor: Math.round(metaN1 * (1 + budget.variacao_pct / 100)), delta_pct: budget.variacao_pct };
}

export function getContractForULS(ulsCode: string, ano: number): ULSContractData['contratos'][0] | undefined {
  const uls = CONTRACT_TARGETS.find(c => c.ulsCode === ulsCode);
  return uls?.contratos.find(c => c.ano === ano);
}
