/**
 * Definição dos 3 períodos cromáticos para fundo dos gráficos.
 * Estes períodos reflectem as fases de implementação do PETS.
 */

export interface PeriodConfig {
  id: string;
  label: string;
  start: string;  // ISO date
  end: string;    // ISO date (ou 'now' para dinâmico)
  color: string;  // hex
  opacity: number;
}

export const PERIODS: PeriodConfig[] = [
  {
    id: 'pre-pets',
    label: 'Pré-PETS (baseline)',
    start: '2024-01-01',
    end: '2024-06-30',
    color: '#FFE0E6',  // Rosa
    opacity: 0.4,
  },
  {
    id: 'pets-ano1',
    label: '1.º ano PETS',
    start: '2024-07-01',
    end: '2025-06-30',
    color: '#FFE0B2',  // Laranja leve
    opacity: 0.4,
  },
  {
    id: 'pets-ano2',
    label: '2.º ano PETS',
    start: '2025-07-01',
    end: 'now',         // Dinâmico: até à data actual
    color: '#FF9800',  // Laranja carregado
    opacity: 0.3,
  },
];

/**
 * Resolve 'now' para a data actual em formato ISO.
 */
export function resolvePeriodEnd(end: string): string {
  return end === 'now' ? new Date().toISOString().split('T')[0] : end;
}

/**
 * Retorna a data mínima e máxima do intervalo total (para eixo X dos gráficos).
 */
export function getGlobalDateRange(): { min: string; max: string } {
  return {
    min: PERIODS[0].start,
    max: resolvePeriodEnd(PERIODS[PERIODS.length - 1].end),
  };
}
