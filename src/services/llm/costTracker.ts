/**
 * Serviço de rastreio de custos LLM com persistência em Firestore.
 *
 * FUNCIONALIDADES:
 * - Regista cada chamada LLM com provider, tier, tokens, custo estimado
 * - Acumula custo semanal e bloqueia chamadas ao atingir o limite
 * - Reset automático semanal (segunda-feira 00:00 UTC)
 * - Expõe métricas para dashboard admin (Sprint 5)
 *
 * NOTA: Este módulo é usado exclusivamente server-side (Cloud Functions).
 * O frontend nunca chama LLMs directamente — passa sempre pelo proxy.
 */

import { MAX_WEEKLY_LLM_COST_USD, estimateCallCost, LLMProvider, LLMTier, resolveEffectiveTier } from '../../config/llmConfig';

// ─── Tipos ────────────────────────────────────────────

export interface LLMCallRecord {
  timestamp: number;        // Unix ms
  provider: LLMProvider;
  requestedTier: LLMTier;
  effectiveTier: LLMTier;  // Após downgrade se aplicável
  inputTokens: number;
  outputTokens: number;
  estimatedCostUSD: number;
  purpose: string;          // ex: 'eixo1_summary', 'chatbot_response'
  weekId: string;           // ex: '2026-W12'
}

export interface WeeklyCostSummary {
  weekId: string;
  totalCostUSD: number;
  callCount: number;
  budgetRemainingUSD: number;
  isOverBudget: boolean;
  byProvider: Record<LLMProvider, { costUSD: number; calls: number }>;
  byTier: Record<LLMTier, { costUSD: number; calls: number }>;
}

// ─── Helpers ──────────────────────────────────────────

/**
 * Calcula o ID da semana ISO (ex: '2026-W12').
 */
export function getWeekId(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

// ─── In-memory tracker (para Cloud Functions) ─────────
// Em produção, substituir por Firestore. Para Sprint 0, memória é suficiente.

let callLog: LLMCallRecord[] = [];

/**
 * Verifica se o orçamento semanal permite mais uma chamada.
 * Retorna { allowed: true } ou { allowed: false, reason: string }.
 */
export function checkBudget(
  provider: LLMProvider,
  tier: LLMTier,
  estimatedInputTokens: number,
  estimatedOutputTokens: number,
): { allowed: boolean; reason?: string; estimatedCostUSD: number; budgetRemainingUSD: number } {
  const effectiveTier = resolveEffectiveTier(tier);
  const estimatedCost = estimateCallCost(provider, effectiveTier, estimatedInputTokens, estimatedOutputTokens);
  const weekId = getWeekId();
  const weeklySpend = callLog
    .filter(r => r.weekId === weekId)
    .reduce((sum, r) => sum + r.estimatedCostUSD, 0);

  const budgetRemaining = MAX_WEEKLY_LLM_COST_USD - weeklySpend;

  if (weeklySpend + estimatedCost > MAX_WEEKLY_LLM_COST_USD) {
    return {
      allowed: false,
      reason: `Orçamento semanal LLM esgotado: ${weeklySpend.toFixed(4)} / ${MAX_WEEKLY_LLM_COST_USD} gastos. Chamada estimada em ${estimatedCost.toFixed(4)}. Reset na próxima segunda-feira.`,
      estimatedCostUSD: estimatedCost,
      budgetRemainingUSD: budgetRemaining,
    };
  }

  return { allowed: true, estimatedCostUSD: estimatedCost, budgetRemainingUSD: budgetRemaining };
}

/**
 * Regista uma chamada LLM realizada. Chamar APÓS receber a resposta.
 */
export function recordCall(
  provider: LLMProvider,
  requestedTier: LLMTier,
  inputTokens: number,
  outputTokens: number,
  purpose: string,
): LLMCallRecord {
  const effectiveTier = resolveEffectiveTier(requestedTier);
  const record: LLMCallRecord = {
    timestamp: Date.now(),
    provider,
    requestedTier,
    effectiveTier,
    inputTokens,
    outputTokens,
    estimatedCostUSD: estimateCallCost(provider, effectiveTier, inputTokens, outputTokens),
    purpose,
    weekId: getWeekId(),
  };

  callLog.push(record);
  return record;
}

/**
 * Retorna resumo de custos da semana actual.
 */
export function getWeeklySummary(): WeeklyCostSummary {
  const weekId = getWeekId();
  const weekRecords = callLog.filter(r => r.weekId === weekId);

  const byProvider: Record<string, { costUSD: number; calls: number }> = {
    openai: { costUSD: 0, calls: 0 },
    anthropic: { costUSD: 0, calls: 0 },
    vertex: { costUSD: 0, calls: 0 },
  };
  const byTier: Record<string, { costUSD: number; calls: number }> = {
    intenso: { costUSD: 0, calls: 0 },
    moderado: { costUSD: 0, calls: 0 },
    baixo: { costUSD: 0, calls: 0 },
  };

  let totalCost = 0;
  for (const r of weekRecords) {
    totalCost += r.estimatedCostUSD;
    byProvider[r.provider].costUSD += r.estimatedCostUSD;
    byProvider[r.provider].calls += 1;
    byTier[r.effectiveTier].costUSD += r.estimatedCostUSD;
    byTier[r.effectiveTier].calls += 1;
  }

  return {
    weekId,
    totalCostUSD: totalCost,
    callCount: weekRecords.length,
    budgetRemainingUSD: MAX_WEEKLY_LLM_COST_USD - totalCost,
    isOverBudget: totalCost >= MAX_WEEKLY_LLM_COST_USD,
    byProvider: byProvider as WeeklyCostSummary['byProvider'],
    byTier: byTier as WeeklyCostSummary['byTier'],
  };
}

/**
 * Limpa registos de semanas anteriores (garbage collection).
 */
export function pruneOldRecords(): number {
  const currentWeek = getWeekId();
  const before = callLog.length;
  callLog = callLog.filter(r => r.weekId === currentWeek);
  return before - callLog.length;
}
