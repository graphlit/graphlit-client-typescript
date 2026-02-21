/**
 * Partial GraphQL error surfacing.
 *
 * When a GraphQL response contains both `data` and `errors`, the SDK returns
 * the partial data so callers don't break.  This module lets callers opt-in to
 * inspecting the errors that came alongside that partial data.
 *
 * Errors are attached as a non-enumerable, Symbol-keyed property so they are
 * invisible to JSON.stringify, Object.keys, for…in, and spread — no breaking
 * changes for any existing consumer.
 */

// Symbol.for() is globally shared, so even if two copies of the SDK are loaded
// (e.g. CJS + ESM, or different versions) they will share the same key.
export const PARTIAL_ERRORS_KEY = Symbol.for("graphlit.partialErrors");

/**
 * Simplified representation of a GraphQL error that doesn't require consumers
 * to depend on the `graphql` package.
 */
export interface PartialGraphQLError {
  message: string;
  path?: ReadonlyArray<string | number>;
  extensions?: Record<string, unknown>;
}

/**
 * Retrieve partial errors attached to an SDK result, if any.
 *
 * @returns The array of errors, or `undefined` if the result had no errors.
 *
 * @example
 * ```ts
 * const result = await client.queryGitHubRepositories(input);
 * const errors = getPartialErrors(result);
 * if (errors) {
 *   console.warn("Partial errors:", errors);
 * }
 * ```
 */
export function getPartialErrors(
  result: unknown,
): PartialGraphQLError[] | undefined {
  if (
    result != null &&
    typeof result === "object" &&
    PARTIAL_ERRORS_KEY in (result as Record<symbol, unknown>)
  ) {
    return (result as Record<symbol, PartialGraphQLError[]>)[PARTIAL_ERRORS_KEY];
  }
  return undefined;
}

/**
 * Attach partial errors to an SDK result object.  The property is
 * non-enumerable so it won't appear in serialisation or iteration.
 *
 * @internal — only called from client.ts
 */
export function attachPartialErrors<T>(
  data: T,
  errors: ReadonlyArray<{ message: string; path?: ReadonlyArray<string | number>; extensions?: Record<string, unknown> }>,
): T {
  if (data != null && typeof data === "object" && errors.length > 0) {
    const simplified: PartialGraphQLError[] = errors.map((e) => ({
      message: e.message,
      ...(e.path ? { path: e.path } : {}),
      ...(e.extensions ? { extensions: e.extensions as Record<string, unknown> } : {}),
    }));

    Object.defineProperty(data, PARTIAL_ERRORS_KEY, {
      value: simplified,
      enumerable: false,
      writable: false,
      configurable: true,
    });
  }
  return data;
}
