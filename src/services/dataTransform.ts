/**
 * Funções de transformação de dados API para formato de gráficos Recharts.
 */

import { SNSRecord } from './snsApi';
import { ULS_REGISTRY } from '../config/ulsRegistry';

export interface TimeSeriesPoint {
  periodo: string;
  [key: string]: string | number | null;
}

export interface StackedByULSPoint {
  periodo: string;
  [ulsCode: string]: string | number;
}

export function extractPeriodo(record: SNSRecord, fieldHints: string[] = []): string | null {
  const candidates = [...fieldHints, 'tempo', 'periodo', 'data', 'mes'];
  for (const field of candidates) {
    const val = record[field];
    if (val && typeof val === 'string') {
      if (/^\d{4}-\d{2}$/.test(val)) return val;
      if (/^\d{4}-\d{2}-\d{2}/.test(val)) return val.substring(0, 7);
      if (/^\d{4}\/\d{2}/.test(val)) return val.replace('/', '-').substring(0, 7);
    }
  }
  return null;
}

export function extractInstituicao(record: SNSRecord, fieldHints: string[] = []): string | null {
  const candidates = [...fieldHints, 'instituicao', 'entidade', 'hospital', 'uls', 'aces'];
  for (const field of candidates) {
    const val = record[field];
    if (val && typeof val === 'string') return val;
  }
  return null;
}

export function matchULS(apiName: string): string | null {
  const normalized = apiName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const uls of ULS_REGISTRY) {
    const ulsNorm = uls.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalized.includes(ulsNorm.replace('uls ', '')) || ulsNorm.includes(normalized)) {
      return uls.code;
    }
  }
  return null;
}

export function toTimeSeries(
  records: SNSRecord[],
  valueField: string,
  periodoFieldHint?: string,
): TimeSeriesPoint[] {
  const byPeriod = new Map<string, number>();

  for (const r of records) {
    const periodo = extractPeriodo(r, periodoFieldHint ? [periodoFieldHint] : []);
    if (!periodo) continue;
    const val = Number(r[valueField]);
    if (isNaN(val)) continue;
    byPeriod.set(periodo, (byPeriod.get(periodo) || 0) + val);
  }

  return Array.from(byPeriod.entries())
    .map(([periodo, valor]) => ({ periodo, valor }))
    .sort((a, b) => a.periodo.localeCompare(b.periodo));
}

export function toMultiSeries(
  records: SNSRecord[],
  valueFields: Record<string, string>,
  periodoFieldHint?: string,
): TimeSeriesPoint[] {
  const byPeriod = new Map<string, Record<string, number>>();

  for (const r of records) {
    const periodo = extractPeriodo(r, periodoFieldHint ? [periodoFieldHint] : []);
    if (!periodo) continue;
    if (!byPeriod.has(periodo)) byPeriod.set(periodo, {});
    const entry = byPeriod.get(periodo)!;
    for (const [alias, field] of Object.entries(valueFields)) {
      const val = Number(r[field]);
      if (!isNaN(val)) entry[alias] = (entry[alias] || 0) + val;
    }
  }

  return Array.from(byPeriod.entries())
    .map(([periodo, values]) => ({ periodo, ...values }))
    .sort((a, b) => a.periodo.localeCompare(b.periodo));
}

export function toStackedByULS(
  records: SNSRecord[],
  valueField: string,
  periodoFieldHint?: string,
  instituicaoFieldHint?: string,
): StackedByULSPoint[] {
  const byPeriodULS = new Map<string, Map<string, number>>();

  for (const r of records) {
    const periodo = extractPeriodo(r, periodoFieldHint ? [periodoFieldHint] : []);
    const inst = extractInstituicao(r, instituicaoFieldHint ? [instituicaoFieldHint] : []);
    if (!periodo || !inst) continue;
    const val = Number(r[valueField]);
    if (isNaN(val)) continue;
    const ulsCode = matchULS(inst) || inst;
    if (!byPeriodULS.has(periodo)) byPeriodULS.set(periodo, new Map());
    const periodMap = byPeriodULS.get(periodo)!;
    periodMap.set(ulsCode, (periodMap.get(ulsCode) || 0) + val);
  }

  return Array.from(byPeriodULS.entries())
    .map(([periodo, ulsMap]) => {
      const point: StackedByULSPoint = { periodo };
      for (const [uls, val] of ulsMap) point[uls] = val;
      return point;
    })
    .sort((a, b) => (a.periodo as string).localeCompare(b.periodo as string));
}

export function filterByDateRange(
  records: SNSRecord[],
  startPeriodo: string,
  endPeriodo?: string,
  periodoFieldHint?: string,
): SNSRecord[] {
  return records.filter(r => {
    const p = extractPeriodo(r, periodoFieldHint ? [periodoFieldHint] : []);
    if (!p) return false;
    if (p < startPeriodo) return false;
    if (endPeriodo && p > endPeriodo) return false;
    return true;
  });
}

// ─── Chart view transforms ───────────────────────────

export function filterFromBaseline<T extends { periodo: string }>(data: T[], baseline = '2024-01'): T[] {
  return data.filter(d => d.periodo >= baseline);
}

type PeriodoRow = { periodo: string } & Record<string, number | string>;

export function aggregateToQuarterly<T extends { periodo: string; [key: string]: unknown }>(
  data: T[], valueFields: string[]
): PeriodoRow[] {
  const byQ = new Map<string, Record<string, number>>();
  for (const d of data) {
    const [year, month] = d.periodo.split('-').map(Number);
    const q = `${year}-Q${Math.ceil(month / 3)}`;
    if (!byQ.has(q)) byQ.set(q, {});
    const entry = byQ.get(q)!;
    for (const f of valueFields) {
      const v = Number(d[f]);
      if (!isNaN(v)) entry[f] = (entry[f] || 0) + v;
    }
  }
  return Array.from(byQ.entries()).sort(([a], [b]) => a.localeCompare(b))
    .map(([periodo, vals]) => ({ periodo, ...vals }));
}

export function cumulativeYearly<T extends { periodo: string; [key: string]: unknown }>(
  data: T[], valueFields: string[]
): PeriodoRow[] {
  const result: PeriodoRow[] = [];
  const accum: Record<string, Record<string, number>> = {};
  for (const d of data) {
    const year = d.periodo.split('-')[0];
    if (!accum[year]) accum[year] = {};
    const entry: Record<string, number> = {};
    for (const f of valueFields) {
      const v = Number(d[f]);
      if (!isNaN(v)) {
        accum[year][f] = (accum[year][f] || 0) + v;
        entry[f] = accum[year][f];
      }
    }
    result.push({ periodo: d.periodo, ...entry });
  }
  return result;
}
