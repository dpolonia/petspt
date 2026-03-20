/**
 * Data quality validation: compare Firestore data against GT PETS ground truth.
 */

import { KPIGroundTruth } from '../config/kpiGroundTruth';

export type ValidationMatch = 'exact' | 'close' | 'mismatch' | 'missing' | 'gt_only';

export interface ValidationResult {
  medidaId: string;
  periodo: string;
  groundTruth: number;
  firestoreValue: number | null;
  match: ValidationMatch;
  deviation_pct: number | null;
}

export interface ValidationSummary {
  medidaId: string;
  totalPoints: number;
  exact: number;
  close: number;
  mismatch: number;
  missing: number;
  badge: 'validado' | 'aproximado' | 'divergente' | 'relatorio_gt' | 'nao_validado';
  badgeLabel: string;
}

export function validateAgainstGroundTruth(
  medidaId: string,
  firestoreSeries: { periodo: string; valor: number }[],
  groundTruth: KPIGroundTruth,
  tolerancePct = 5,
): ValidationResult[] {
  const results: ValidationResult[] = [];

  for (const gt of groundTruth.dataPoints) {
    const fsPoint = firestoreSeries.find(d => d.periodo === gt.periodo);

    if (!fsPoint) {
      results.push({ medidaId, periodo: gt.periodo, groundTruth: gt.valor, firestoreValue: null, match: 'missing', deviation_pct: null });
      continue;
    }

    const deviation = gt.valor !== 0
      ? ((fsPoint.valor - gt.valor) / gt.valor) * 100
      : (fsPoint.valor === 0 ? 0 : 100);

    results.push({
      medidaId, periodo: gt.periodo,
      groundTruth: gt.valor, firestoreValue: fsPoint.valor,
      match: Math.abs(deviation) < 0.1 ? 'exact' : Math.abs(deviation) < tolerancePct ? 'close' : 'mismatch',
      deviation_pct: Math.round(deviation * 10) / 10,
    });
  }

  return results;
}

export function summarizeValidation(results: ValidationResult[], hasFirestore: boolean): ValidationSummary {
  const id = results[0]?.medidaId || '';
  const exact = results.filter(r => r.match === 'exact').length;
  const close = results.filter(r => r.match === 'close').length;
  const mismatch = results.filter(r => r.match === 'mismatch').length;
  const missing = results.filter(r => r.match === 'missing').length;

  let badge: ValidationSummary['badge'];
  let badgeLabel: string;

  if (!hasFirestore) {
    badge = 'relatorio_gt';
    badgeLabel = 'Dados: Relatorios GT PETS';
  } else if (mismatch > 0) {
    badge = 'divergente';
    badgeLabel = `Divergente (${mismatch} desvios >5%)`;
  } else if (close > 0) {
    badge = 'aproximado';
    badgeLabel = `Aproximado (desvio <5%)`;
  } else if (exact > 0) {
    badge = 'validado';
    badgeLabel = 'Validado contra GT PETS';
  } else {
    badge = 'nao_validado';
    badgeLabel = 'Sem referencia GT PETS';
  }

  return { medidaId: id, totalPoints: results.length, exact, close, mismatch, missing, badge, badgeLabel };
}
