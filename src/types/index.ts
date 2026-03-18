/**
 * Tipos globais do portal PETS.
 */

// ─── Estado das Medidas ───────────────────────────────

export type Estado = 'concluida' | 'em_curso' | 'nao_implementada' | 'parcial';

export interface Medida {
  id: string;
  eixo: number;
  nome: string;
  estado: Estado;
  prioridade: 'urgente' | 'prioritaria' | 'estruturante';
}

// ─── Dados e Gráficos ────────────────────────────────

export interface DataPoint {
  periodo: string;   // 'YYYY-MM' ou 'YYYY-MM-DD'
  valor: number;
  uls?: string;      // código ULS para stacked
  label?: string;
}

export interface ChartData {
  indicadorId: string;
  titulo: string;
  unidade: string;   // ex: 'doentes', '%', 'consultas'
  dados: DataPoint[];
  meta?: number;      // target/objetivo se existir
}

// ─── LLM Cost Governance ─────────────────────────────
// Re-exportado de llmConfig para consumo global.

export type { LLMProvider, LLMTier, AppEnv, TierCost, LLMProviderConfig } from '../config/llmConfig';
export type { LLMCallRecord, WeeklyCostSummary } from '../services/llm/costTracker';
