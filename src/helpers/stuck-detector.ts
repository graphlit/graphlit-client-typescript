import type { TurnResult, StuckEvaluation } from "../types/agent.js";

/**
 * Builds a set of character trigrams from a normalized string.
 * Used for approximate string similarity without external dependencies.
 */
function buildTrigrams(text: string): Set<string> {
  const trigrams = new Set<string>();
  for (let i = 0; i <= text.length - 3; i++) {
    trigrams.add(text.slice(i, i + 3));
  }
  return trigrams;
}

/**
 * Jaccard similarity over character trigrams. Returns 0.0–1.0.
 */
function trigramSimilarity(a: string, b: string): number {
  if (a === b) return 1.0;
  if (a.length < 3 || b.length < 3) return a === b ? 1.0 : 0.0;

  const setA = buildTrigrams(a);
  const setB = buildTrigrams(b);

  let intersection = 0;
  for (const tri of setA) {
    if (setB.has(tri)) intersection++;
  }

  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Normalize response text for comparison: lowercase, collapse whitespace, take first 500 chars.
 */
function normalizeResponse(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);
}

const STUCK_WINDOW = 5; // Number of recent turns to examine
const REPEAT_THRESHOLD = 3; // Minimum identical occurrences to detect a pattern
const SIMILARITY_THRESHOLD = 0.9; // Trigram similarity threshold for "same" response
const CONSECUTIVE_ERROR_THRESHOLD = 3; // Consecutive all-error turns
const CONSECUTIVE_EMPTY_THRESHOLD = 2; // Consecutive empty (no tool, no task_complete) turns

/**
 * Stateful detector that tracks patterns across harness turns and identifies
 * when the agent is stuck in a loop.
 *
 * Uses a two-strike system: first detection of a pattern triggers an intervention
 * (the harness injects a diagnostic prompt). If the same pattern is detected again,
 * the harness gives up and terminates.
 */
export class StuckDetector {
  private toolCallHistory: string[][] = [];
  private responseHistory: string[] = [];
  private errorHistory: boolean[] = [];
  private emptyTurnCount = 0;
  private interventions = new Set<string>();

  /**
   * Evaluate a completed turn for stuck patterns.
   * Checks patterns in priority order: repeating tools → repeating responses →
   * error loop → empty turns.
   */
  evaluate(turn: TurnResult): StuckEvaluation {
    // Update history
    const sortedTools = [...turn.toolCalls].sort();
    this.toolCallHistory.push(sortedTools);
    this.responseHistory.push(normalizeResponse(turn.responseText));

    const allErrors =
      turn.toolCallCount > 0 &&
      (turn.errors?.length ?? 0) >= turn.toolCallCount;
    this.errorHistory.push(allErrors);

    if (turn.toolCallCount === 0 && !turn.taskComplete) {
      this.emptyTurnCount++;
    } else {
      this.emptyTurnCount = 0;
    }

    // 1. Repeating tool calls — 3+ identical sorted tool name lists in recent history
    const recentTools = this.toolCallHistory.slice(-STUCK_WINDOW);
    if (recentTools.length >= REPEAT_THRESHOLD) {
      const current = JSON.stringify(sortedTools);
      if (sortedTools.length > 0) {
        let matches = 0;
        for (const past of recentTools) {
          if (JSON.stringify(past) === current) matches++;
        }
        if (matches >= REPEAT_THRESHOLD) {
          return this.strike("repeating_tool_calls");
        }
      }
    }

    // 2. Repeating responses — 3+ responses with >90% similarity
    const recentResponses = this.responseHistory.slice(-STUCK_WINDOW);
    if (recentResponses.length >= REPEAT_THRESHOLD) {
      const current = recentResponses[recentResponses.length - 1];
      if (current.length > 0) {
        let similarCount = 0;
        for (const past of recentResponses) {
          if (trigramSimilarity(past, current) >= SIMILARITY_THRESHOLD) {
            similarCount++;
          }
        }
        if (similarCount >= REPEAT_THRESHOLD) {
          return this.strike("repeating_responses");
        }
      }
    }

    // 3. Error loop — 3+ consecutive turns where all tool calls failed
    if (this.errorHistory.length >= CONSECUTIVE_ERROR_THRESHOLD) {
      const recentErrors = this.errorHistory.slice(
        -CONSECUTIVE_ERROR_THRESHOLD,
      );
      if (recentErrors.every(Boolean)) {
        return this.strike("error_loop");
      }
    }

    // 4. Empty turns — 2+ consecutive turns with 0 tool calls and no task_complete
    if (this.emptyTurnCount >= CONSECUTIVE_EMPTY_THRESHOLD) {
      return this.strike("empty_turns");
    }

    return { stuck: false };
  }

  /**
   * Two-strike system: first occurrence triggers intervention, second gives up.
   */
  private strike(pattern: string): StuckEvaluation {
    if (this.interventions.has(pattern)) {
      // Second strike — give up
      return { stuck: true, pattern, firstOccurrence: false };
    }
    // First strike — intervene
    this.interventions.add(pattern);
    return { stuck: false, pattern, firstOccurrence: true };
  }

  /** Reset all state (for fresh runs). */
  reset(): void {
    this.toolCallHistory = [];
    this.responseHistory = [];
    this.errorHistory = [];
    this.emptyTurnCount = 0;
    this.interventions.clear();
  }

  /** Replay existing turn results to rebuild state (for resume scenarios). */
  initializeFromHistory(turnResults: TurnResult[]): void {
    this.reset();
    for (const turn of turnResults) {
      this.evaluate(turn);
    }
  }
}
