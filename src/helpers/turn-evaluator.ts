import type {
  TurnResult,
  ContextWindowUsage,
} from "../types/agent.js";
import type {
  ExtractCompletion,
  ToolDefinitionInput,
} from "../generated/graphql-types.js";

/** Budget configuration for the multi-turn harness. */
export interface BudgetConfig {
  maxTurns: number;
  maxWallClockMs: number;
  maxToolCalls: number;
  windDownTurns: number;
  initialPrompt: string;
}

/** Input for buildTurnInstructions. */
export interface TurnInstructionConfig {
  turnNumber: number;
  turnsRemaining: number;
  isWindingDown: boolean;
  isStuckIntervention?: string; // the pattern name, if any
  contextWindowPercent?: number;
  originalTaskSummary?: string;
  needsSummarization?: boolean;
}

/** Signature for the extractText callback used by classifyComplexity. */
export type ExtractFn = (
  prompt: string,
  text: string,
  tools: ToolDefinitionInput[],
) => Promise<Array<ExtractCompletion | null> | null | undefined>;

const MAX_MULTIPLIER = 3.0;

/**
 * Manages budget enforcement, wind-down protocol, instruction building,
 * and adaptive budget adjustment for the multi-turn agent harness.
 */
export class TurnEvaluator {
  private maxTurns: number;
  private maxWallClockMs: number;
  private maxToolCalls: number;
  private readonly windDownTurns: number;
  private readonly initialPrompt: string;
  private extensionGranted = false;

  constructor(config: BudgetConfig) {
    this.maxTurns = config.maxTurns;
    this.maxWallClockMs = config.maxWallClockMs;
    this.maxToolCalls = config.maxToolCalls;
    this.windDownTurns = config.windDownTurns;
    this.initialPrompt = config.initialPrompt;
  }

  // ── Adaptive budget ──────────────────────────────────────────────────────

  /**
   * Uses an LLM to classify the complexity of the initial prompt and returns
   * a budget multiplier (1.0–3.0). Falls back to 1.0 on any error.
   */
  async classifyComplexity(
    prompt: string,
    extractFn: ExtractFn,
  ): Promise<{ multiplier: number; reason: string }> {
    try {
      const classificationTool: ToolDefinitionInput = {
        name: "classify_complexity",
        description:
          "Classify the complexity of a task to determine resource allocation.",
        schema: JSON.stringify({
          type: "object",
          properties: {
            multiplier: {
              type: "number",
              description:
                "Budget multiplier from 1.0 (simple) to 3.0 (highly complex). " +
                "1.0 = simple single-item task, 1.5 = moderate multi-step task, " +
                "2.0 = complex multi-item research, 3.0 = comprehensive deep analysis.",
              minimum: 1.0,
              maximum: 3.0,
            },
            reason: {
              type: "string",
              description:
                "Brief explanation of the complexity assessment.",
            },
          },
          required: ["multiplier", "reason"],
        }),
      };

      const classificationPrompt =
        "Evaluate the following task and classify its complexity. Consider:\n" +
        "- Task scope: single-item vs multi-item vs comprehensive\n" +
        "- Research depth required: surface summary vs deep analysis\n" +
        "- Number of distinct sub-tasks\n" +
        "- Expected tool call volume\n\n" +
        "Call the classify_complexity tool with your assessment.";

      const results = await extractFn(classificationPrompt, prompt, [
        classificationTool,
      ]);

      if (results && results.length > 0) {
        const result = results[0];
        if (result?.value) {
          const parsed = JSON.parse(result.value) as {
            multiplier: number;
            reason: string;
          };
          const clamped = Math.min(
            MAX_MULTIPLIER,
            Math.max(1.0, parsed.multiplier),
          );
          return { multiplier: clamped, reason: parsed.reason };
        }
      }
    } catch {
      // Classification failure is non-fatal — fall back to 1x
    }
    return { multiplier: 1.0, reason: "Default (classification unavailable)" };
  }

  /** Apply a multiplier to all budget limits. */
  adjustBudget(multiplier: number): void {
    this.maxTurns = Math.ceil(this.maxTurns * multiplier);
    this.maxWallClockMs = Math.ceil(this.maxWallClockMs * multiplier);
    this.maxToolCalls = Math.ceil(this.maxToolCalls * multiplier);
  }

  /** Current adjusted maxTurns. */
  get adjustedMaxTurns(): number {
    return this.maxTurns;
  }

  /** Current adjusted maxWallClockMs. */
  get adjustedMaxWallClockMs(): number {
    return this.maxWallClockMs;
  }

  /** Current adjusted maxToolCalls. */
  get adjustedMaxToolCalls(): number {
    return this.maxToolCalls;
  }

  // ── Wind-down ────────────────────────────────────────────────────────────

  /** Returns true when the agent should begin winding down. */
  shouldWindDown(
    turn: number,
    elapsedMs: number,
    totalToolCalls: number,
    contextWindow?: ContextWindowUsage,
  ): boolean {
    // Within windDownTurns of maxTurns
    if (turn >= this.maxTurns - this.windDownTurns) return true;
    // Elapsed > 80% of max wall clock
    if (elapsedMs > this.maxWallClockMs * 0.8) return true;
    // Context window > 90%
    if (contextWindow && contextWindow.percentage > 90) return true;
    // Tool calls > 90% of max
    if (totalToolCalls > this.maxToolCalls * 0.9) return true;
    return false;
  }

  // ── Extension ────────────────────────────────────────────────────────────

  /**
   * One-time budget extension if the agent is making steady progress.
   * Grants windDownTurns * 2 additional turns.
   */
  shouldGrantExtension(
    turnResults: TurnResult[],
    contextPercent?: number,
  ): { grant: boolean; extraTurns: number } {
    if (this.extensionGranted) {
      return { grant: false, extraTurns: 0 };
    }

    // Must have at least 3 turns of history to evaluate progress
    if (turnResults.length < 3) {
      return { grant: false, extraTurns: 0 };
    }

    // Context must be under 60%
    if (contextPercent !== undefined && contextPercent >= 60) {
      return { grant: false, extraTurns: 0 };
    }

    // Recent turns must have successful tool calls (no all-error turns)
    const recentTurns = turnResults.slice(-3);
    const hasErrors = recentTurns.some(
      (t) =>
        t.toolCallCount > 0 &&
        (t.errors?.length ?? 0) >= t.toolCallCount,
    );
    if (hasErrors) {
      return { grant: false, extraTurns: 0 };
    }

    // Must be actively using tools
    const hasActivity = recentTurns.some((t) => t.toolCallCount > 0);
    if (!hasActivity) {
      return { grant: false, extraTurns: 0 };
    }

    const extraTurns = this.windDownTurns * 2;
    this.extensionGranted = true;
    this.maxTurns += extraTurns;
    return { grant: true, extraTurns };
  }

  // ── Instruction building ─────────────────────────────────────────────────

  /**
   * Build the `instructions` parameter for a turn. Returns undefined for
   * normal continuation turns (enables bare fast-path).
   */
  buildTurnInstructions(config: TurnInstructionConfig): string | undefined {
    const parts: string[] = [];

    // Stuck intervention (highest priority)
    if (config.isStuckIntervention) {
      const patternDescriptions: Record<string, string> = {
        repeating_tool_calls:
          "calling the same tools repeatedly with similar arguments",
        repeating_responses:
          "generating very similar responses across multiple turns",
        error_loop:
          "encountering errors on all tool calls for multiple consecutive turns",
        empty_turns:
          "producing empty turns with no tool calls or progress",
      };
      const description =
        patternDescriptions[config.isStuckIntervention] ??
        config.isStuckIntervention;
      parts.push(
        `You appear to be ${description}. ` +
          "Take a different approach: try alternative tools, different arguments, " +
          "or reconsider your strategy. If the task cannot be completed with " +
          "available tools, call task_complete with a summary of what was accomplished " +
          "and what remains.",
      );
    }

    // Wind-down
    if (config.isWindingDown) {
      parts.push(
        `You are running low on remaining capacity (${config.turnsRemaining} turn(s) remaining). ` +
          "Wrap up your work: synthesize your findings, provide your final answer, " +
          "and call task_complete. Do not start new lines of investigation.",
      );
    }

    // Context pressure
    if (
      config.contextWindowPercent !== undefined &&
      config.contextWindowPercent > 85
    ) {
      parts.push(
        `Context window is at ${config.contextWindowPercent}% capacity. ` +
          "Be concise in your responses and tool usage to avoid running out of context.",
      );
    }

    // Summarization trigger: >70% context AND early in run (< 50% turns used)
    if (config.needsSummarization) {
      parts.push(
        "Before continuing, summarize your progress so far in a few sentences. " +
          "This will help manage context window usage for the remaining work.",
      );
    }

    // Task restatement every 5th turn
    if (config.originalTaskSummary) {
      parts.push(
        `Reminder: your original task is: ${config.originalTaskSummary}`,
      );
    }

    if (parts.length === 0) return undefined;
    return parts.join("\n\n");
  }

  // ── Hard budget checks ───────────────────────────────────────────────────

  /** Returns true if any hard budget limit has been exhausted. */
  isBudgetExhausted(
    turn: number,
    elapsedMs: number,
    totalToolCalls: number,
  ): boolean {
    if (turn >= this.maxTurns) return true;
    if (elapsedMs >= this.maxWallClockMs) return true;
    if (totalToolCalls >= this.maxToolCalls) return true;
    return false;
  }
}
