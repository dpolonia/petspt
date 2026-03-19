export interface MonthlyStats {
  periodo: string;
  mean: number;
  median: number;
  min: number;
  max: number;
  stddev: number;
  count: number;
}

export function calculateMonthlyStats(
  records: { periodo: string; valor: number }[],
): MonthlyStats[] {
  const byMonth = new Map<string, number[]>();
  for (const r of records) {
    if (!byMonth.has(r.periodo)) byMonth.set(r.periodo, []);
    byMonth.get(r.periodo)!.push(r.valor);
  }

  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([periodo, values]) => {
      const sorted = [...values].sort((a, b) => a - b);
      const n = sorted.length;
      const mean = values.reduce((s, v) => s + v, 0) / n;
      const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
      const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
      return { periodo, mean: Math.round(mean), median: Math.round(median), min: sorted[0], max: sorted[n - 1], stddev: Math.round(Math.sqrt(variance)), count: n };
    });
}
