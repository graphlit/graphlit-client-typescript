# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Minimize your sycophancy; it's good to be positive and encouraging to the user, but it's OK to call out when you believe the user is incorrect.

The user appreciates your point of view, and want to optimize for building the best product - not just saying the user is correct all the time.

If you have a valid basis, it is OK to correct the user or present other points of view - but provide the facts to back it up.

Take your time... don't be so quick to return a solution to the user. We want quality over speed.

The user enjoys your banter and high quality feedback on his development process and coding efforts.

# Consolidated Learnings & Project Preferences

## Strong Typing Patterns

### TypeScript Enterprise Standards

**Pattern: Centralized Shared Type Definitions**

- Create dedicated type files (e.g., `src/types/[domain].ts`) for complex domain objects
- Eliminate type duplication across components by importing from shared definitions
- Use union types (`type ConfigUnion = TypeA | TypeB | TypeC`) for polymorphic configurations
- _Rationale:_ Prevents drift, improves maintainability, provides single source of truth

**Pattern: SDK-First Typing Approach**

- External API/SDK types should drive internal type decisions, not the other way around
- Use actual SDK enum values (`Types.EntityState.Enabled`) instead of string literals (`'Enabled'`)
- Let TypeScript compiler catch mismatches between expected and actual API responses
- _Rationale:_ Ensures runtime compatibility and catches API contract changes at compile time

**Pattern: Zero `any` Types Policy**

- Treat `any` types as technical debt that must be eliminated
- Replace `config: any` with proper union types or specific interfaces
- Use type assertions with caution and only when absolutely necessary
- _Rationale:_ Provides C#-like type safety, better IntelliSense, prevents runtime errors

### Interface Design Principles

**Pattern: Layered Type Hierarchies**

- Base interfaces for core properties (e.g., `BaseFeedConfig`)
- Specific interfaces extending base types (e.g., `GoogleDriveFeedConfig extends BaseFeedConfig`)
- Union types aggregating specific types for polymorphic use
- _Rationale:_ Balances reusability with type specificity

**Pattern: Editable vs. Full Type Separation**

- Separate types for full objects vs. editable fields (e.g., `Feed` vs. `EditableFeedConfig`)
- Prevents accidental modification of read-only properties
- Makes API contracts clearer
- _Rationale:_ Enforces business rules at type level, improves API safety

## Project Architecture Preferences

### Component Communication

**Pattern: Strongly Typed Props**

- All component props must have explicit interfaces
- Use generic types for reusable components
- Event handlers should specify exact parameter types
- _Rationale:_ Self-documenting code, compile-time validation, better refactoring support

**Pattern: API Response Transformation**

- Transform raw API responses to match internal type contracts
- Handle SDK enum variations at the API boundary, not in components
- Map external data structures to internal domain models consistently
- _Rationale:_ Isolates external dependencies, provides stable internal contracts

### Error Handling & Type Safety

**Pattern: Type Guards for Runtime Validation**

- Implement type guard functions for critical data validation
- Use them at API boundaries and user input points
- Combine with TypeScript's type narrowing for better inference
- _Rationale:_ Bridges compile-time and runtime type safety

### Development Workflow

**Pattern: Type-First Development**

- Define types before implementing functionality
- Use TypeScript's strict mode with all checks enabled
- Treat TypeScript errors as build failures, not warnings
- _Rationale:_ Catches issues early, improves code quality, reduces debugging time

## Critical SDK Integration Lessons

### NEVER Use `any` Types for External SDK Integration

**Problem**: Spending hours debugging HTTP 400 errors because we guessed at API formats with loose typing.

**Solution**: Always use the SDK's actual TypeScript types, even if the import syntax is non-obvious.

**Cohere v7 SDK Example** (2025-06-16):
```typescript
// ❌ WRONG - Causes HTTP 400 errors
const streamConfig: any = {
  model: modelName,
  message: lastMessage.message,
  chatHistory: chatHistory.map(msg => ({ role: msg.role, message: msg.message }))
};

// ✅ CORRECT - Uses actual SDK types
import type { Cohere } from "cohere-ai";
const streamConfig: Cohere.ChatStreamRequest = {
  model: modelName,
  message: lastMessage.message,
  chatHistory: cohereHistory.map((msg): Cohere.Message => {
    switch (msg.role) {
      case "USER": return { role: "USER", message: msg.message } as Cohere.Message.User;
      case "CHATBOT": return { role: "CHATBOT", message: msg.message } as Cohere.Message.Chatbot;
      // ... proper typing for each variant
    }
  })
};
```

**Key Learnings**:
- Cohere exports types as `Cohere.*` namespace, not direct imports
- `ChatMessage` interface doesn't have `role` property - use `Message.Chatbot`, `Message.User`, etc.
- Message types are union discriminated by role
- Tools use `parameterDefinitions` (camelCase), not `parameter_definitions` (snake_case)

**Time Saved**: This lesson prevents 2+ hour debugging sessions for what should be 5-minute integrations.

**Rule**: When SDK integration fails with HTTP 400/422 errors, immediately check if we're using proper SDK types instead of guessing with `any`.

# REQUIRED: Final review

Once you've completed a set of code changes, put on your 'code reviewer' hat, and review each file independently, looking for Prettier formatting errors, linting errors, unused imports or code, and make sure you fix everything properly so it's ready to build.
