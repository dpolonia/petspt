/**
 * Metas do Quadro Global de Referencia do SNS.
 * Fontes:
 *   - QGR 2024-2026: Despacho n.o 6770/2024, de 18/Jun (DR Serie II n.o 116/2024)
 *   - QGR 2025-2027: Despacho n.o 14012/2025, de 25/Nov (DR Serie II n.o 228/2025)
 */

export interface QGRTarget {
  id: string;
  indicador: string;
  unidade: string;
  qgr_2024_2026: { ano2024: number | null; ano2025: number | null; ano2026: number | null };
  qgr_2025_2027: { ano2025: number | null; ano2026: number | null; ano2027: number | null };
  forecastCatalogId?: string;
  observacoes?: string;
}

export const QGR_TARGETS: QGRTarget[] = [
  // PRODUCAO
  {
    id: 'QGR_CONSULTAS_CSP',
    indicador: 'Consultas medicas CSP (milhoes)',
    unidade: 'milhoes',
    qgr_2024_2026: { ano2024: 34.6, ano2025: 35.5, ano2026: 36.4 },
    qgr_2025_2027: { ano2025: 33.2, ano2026: 34.0, ano2027: 34.8 },
    observacoes: 'QGR 2025-2027 reviu em baixa ~6%',
  },
  {
    id: 'QGR_CONSULTAS_HOSP',
    indicador: 'Consultas hospitalares (milhoes)',
    unidade: 'milhoes',
    qgr_2024_2026: { ano2024: 13.8, ano2025: 14.0, ano2026: 14.3 },
    qgr_2025_2027: { ano2025: 13.5, ano2026: 13.8, ano2027: 14.1 },
  },
  {
    id: 'QGR_CIRURGIAS',
    indicador: 'Intervencoes cirurgicas (milhares)',
    unidade: 'milhares',
    qgr_2024_2026: { ano2024: 825, ano2025: 833, ano2026: 841 },
    qgr_2025_2027: { ano2025: 778, ano2026: 801, ano2027: 824 },
    forecastCatalogId: 'FC_CIRURGIAS',
    observacoes: 'QGR 2025-2027 reviu: 778K em 2025 (vs 833K), 801K em 2026 (vs 841K)',
  },
  {
    id: 'QGR_INTERNAMENTOS',
    indicador: 'Episodios de internamento (milhares)',
    unidade: 'milhares',
    qgr_2024_2026: { ano2024: 980, ano2025: 990, ano2026: 1000 },
    qgr_2025_2027: { ano2025: 945, ano2026: 960, ano2027: 975 },
  },
  // ACESSO
  {
    id: 'QGR_UTENTES_MDF',
    indicador: '% utentes com MdF atribuido',
    unidade: '%',
    qgr_2024_2026: { ano2024: 86, ano2025: 91, ano2026: 98 },
    qgr_2025_2027: { ano2025: 85, ano2026: 88, ano2027: 92 },
    forecastCatalogId: 'FC_UTENTES_SEM_MDF',
    observacoes: 'Meta 98% em 2026 considerada irrealista — revista para 88% em QGR 2025-2027',
  },
  {
    id: 'QGR_URGENCIAS',
    indicador: 'Episodios de urgencia (milhoes)',
    unidade: 'milhoes',
    qgr_2024_2026: { ano2024: 6.0, ano2025: 5.85, ano2026: 5.7 },
    qgr_2025_2027: { ano2025: 6.1, ano2026: 5.95, ano2027: 5.8 },
    forecastCatalogId: 'FC_URGENCIAS',
    observacoes: 'PT tem 70+ visitas ED per capita vs OECD 28 (OECD Health at a Glance 2023)',
  },
  // RECURSOS HUMANOS
  {
    id: 'QGR_TRABALHADORES',
    indicador: 'Trabalhadores SNS (total)',
    unidade: 'trabalhadores',
    qgr_2024_2026: { ano2024: 157000, ano2025: 164822, ano2026: 173034 },
    qgr_2025_2027: { ano2025: 153896, ano2026: 154665, ano2027: 155600 },
    observacoes: 'Revisao drastica: 164.822 -> 153.896 em 2025; limite contratacao 5% -> 1,9%',
  },
  // ECONOMICO-FINANCEIRO
  {
    id: 'QGR_ORCAMENTO_SNS',
    indicador: 'Orcamento SNS (M EUR)',
    unidade: 'M EUR',
    qgr_2024_2026: { ano2024: 14500, ano2025: 15200, ano2026: 15800 },
    qgr_2025_2027: { ano2025: 15100, ano2026: 15600, ano2027: 16100 },
  },
];

export function getQGRTargetByForecastId(forecastId: string): QGRTarget | undefined {
  return QGR_TARGETS.find(t => t.forecastCatalogId === forecastId);
}
