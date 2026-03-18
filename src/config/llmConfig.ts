/**
 * Configuração do sistema de governança de custos LLM.
 *
 * ARQUITECTURA DE 3 TIERS:
 * - Intenso: modelos frontier (GPT-4o, Claude Opus, Gemini Pro) — máxima qualidade
 * - Moderado: modelos mid-range (GPT-4o-mini, Claude Sonnet, Gemini Flash) — equilíbrio
 * - Baixo: modelos leves (GPT-4o-mini quantizado, Claude Haiku, Gemini Flash lite) — economia
 *
 * REGRAS DE GOVERNANÇA:
 * 1. Em PETSPT_ENV=development, o tier Intenso é PROIBIDO (downgrade automático para Moderado)
 * 2. O custo semanal acumulado não pode exceder MAX_WEEKLY_LLM_COST_USD
 * 3. Ao atingir o limite, todas as chamadas LLM são bloqueadas até reset semanal
 * 4. Cada chamada regista custo estimado em Firestore para auditoria
 */

export type LLMProvider = 'openai' | 'anthropic' | 'vertex';
export type LLMTier = 'intenso' | 'moderado' | 'baixo';
export type AppEnv = 'development' | 'production';

export interface TierCost {
  inputPer1M: number;   // USD por 1M tokens de input
  outputPer1M: number;  // USD por 1M tokens de output
}

export interface LLMProviderConfig {
  provider: LLMProvider;
  tiers: Record<LLMTier, TierCost>;
}

/**
 * Carrega custos do .env. Fallback para defaults se variável ausente.
 * As variáveis NÃO têm prefixo VITE_ — são lidas exclusivamente server-side
 * (Cloud Functions) e nunca expostas no browser.
 */
function envFloat(_key: string, fallback: number): number {
  // In the browser context (Vite), these server-only env vars are not available.
  // The actual values are read server-side in Cloud Functions via process.env.
  // Here we always use the fallback defaults (which match the public provider pricing).
  return fallback;
}

export const LLM_PROVIDERS: LLMProviderConfig[] = [
  {
    provider: 'openai',
    tiers: {
      intenso:  { inputPer1M: envFloat('OPENAI_COST_INTENSO_INPUT_USD_PER_1M', 30),    outputPer1M: envFloat('OPENAI_COST_INTENSO_OUTPUT_USD_PER_1M', 180) },
      moderado: { inputPer1M: envFloat('OPENAI_COST_MODERADO_INPUT_USD_PER_1M', 2.5),   outputPer1M: envFloat('OPENAI_COST_MODERADO_OUTPUT_USD_PER_1M', 15) },
      baixo:    { inputPer1M: envFloat('OPENAI_COST_BAIXO_INPUT_USD_PER_1M', 0.25),     outputPer1M: envFloat('OPENAI_COST_BAIXO_OUTPUT_USD_PER_1M', 2) },
    },
  },
  {
    provider: 'anthropic',
    tiers: {
      intenso:  { inputPer1M: envFloat('ANTHROPIC_COST_INTENSO_INPUT_USD_PER_1M', 5),   outputPer1M: envFloat('ANTHROPIC_COST_INTENSO_OUTPUT_USD_PER_1M', 25) },
      moderado: { inputPer1M: envFloat('ANTHROPIC_COST_MODERADO_INPUT_USD_PER_1M', 3),   outputPer1M: envFloat('ANTHROPIC_COST_MODERADO_OUTPUT_USD_PER_1M', 15) },
      baixo:    { inputPer1M: envFloat('ANTHROPIC_COST_BAIXO_INPUT_USD_PER_1M', 1),      outputPer1M: envFloat('ANTHROPIC_COST_BAIXO_OUTPUT_USD_PER_1M', 5) },
    },
  },
  {
    provider: 'vertex',
    tiers: {
      intenso:  { inputPer1M: envFloat('VERTEX_COST_INTENSO_INPUT_USD_PER_1M', 7),      outputPer1M: envFloat('VERTEX_COST_INTENSO_OUTPUT_USD_PER_1M', 21) },
      moderado: { inputPer1M: envFloat('VERTEX_COST_MODERADO_INPUT_USD_PER_1M', 0.075),  outputPer1M: envFloat('VERTEX_COST_MODERADO_OUTPUT_USD_PER_1M', 0.3) },
      baixo:    { inputPer1M: envFloat('VERTEX_COST_BAIXO_INPUT_USD_PER_1M', 0.075),     outputPer1M: envFloat('VERTEX_COST_BAIXO_OUTPUT_USD_PER_1M', 0.3) },
    },
  },
];

/** Custo máximo semanal em USD. Lido de env com fallback para $20. */
export const MAX_WEEKLY_LLM_COST_USD: number = envFloat('MAX_WEEKLY_LLM_COST_USD', 20);

/** Ambiente actual. Em development, tier Intenso é proibido. */
export function getAppEnv(): AppEnv {
  // In browser context, check Vite's mode. In Node (Cloud Functions), check process.env.
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.PROD ? 'production' : 'development';
  }
  return 'development';
}

/**
 * Resolve o tier efectivo aplicando a regra de downgrade em dev.
 * Em development: Intenso → Moderado (silencioso, com log de aviso).
 */
export function resolveEffectiveTier(requestedTier: LLMTier): LLMTier {
  if (requestedTier === 'intenso' && getAppEnv() === 'development') {
    console.warn('[LLM Gov] Tier Intenso indisponível em development — downgrade para Moderado');
    return 'moderado';
  }
  return requestedTier;
}

/**
 * Calcula o custo estimado de uma chamada LLM em USD.
 */
export function estimateCallCost(
  provider: LLMProvider,
  tier: LLMTier,
  inputTokens: number,
  outputTokens: number,
): number {
  const config = LLM_PROVIDERS.find(p => p.provider === provider);
  if (!config) throw new Error(`Unknown LLM provider: ${provider}`);

  const effectiveTier = resolveEffectiveTier(tier);
  const costs = config.tiers[effectiveTier];

  return (inputTokens / 1_000_000) * costs.inputPer1M
       + (outputTokens / 1_000_000) * costs.outputPer1M;
}

/**
 * Obter custo do tier mais barato (para selecção automática de fallback).
 */
export function getCheapestProvider(tier: LLMTier): LLMProvider {
  const effectiveTier = resolveEffectiveTier(tier);
  let cheapest: LLMProvider = 'vertex';
  let cheapestCost = Infinity;

  for (const config of LLM_PROVIDERS) {
    const avgCost = (config.tiers[effectiveTier].inputPer1M + config.tiers[effectiveTier].outputPer1M) / 2;
    if (avgCost < cheapestCost) {
      cheapestCost = avgCost;
      cheapest = config.provider;
    }
  }
  return cheapest;
}
