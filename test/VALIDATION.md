# Test Validation System

This directory includes automated validation to catch type errors and other issues before running tests.

## Quick Start

```bash
# Run tests with automatic validation (recommended)
npm test

# Run tests without validation (not recommended)
npm run test:unsafe

# Run only validation
npm run validate

# Quick validation (faster, less thorough)
npm run validate:quick
```

## What Gets Validated

1. **TypeScript Compilation**: Ensures all TypeScript compiles without errors
2. **Strict Type Checking**: Catches type mismatches, wrong property names, etc.
3. **Unused Variables**: Finds unused variables and parameters
4. **File Dependencies**: Verifies required files exist

## Scripts Available

- `npm test` - Runs validation then tests (recommended)
- `npm run validate` - Full validation suite
- `npm run validate:quick` - Faster validation
- `npm run typecheck` - TypeScript compilation check only
- `npm run lint:types` - Strict type checking only
- `npm run lint:unused` - Unused variables check only
- `npm run test:unsafe` - Skip validation and run tests directly

## Setting Up Git Hooks

To automatically validate before commits:

```bash
# Copy the pre-commit hook
cp pre-commit-hook.sh ../.git/hooks/pre-commit
chmod +x ../.git/hooks/pre-commit
```

## CI/CD Integration

For GitHub Actions, use the example workflow:

```bash
# Copy to your repository
mkdir -p ../.github/workflows
cp .github-workflow-example.yml ../.github/workflows/test-validation.yml
```

## Common Issues and Fixes

### Issue: Wrong property names (like `thinkingLimit` vs `thinkingTokenLimit`)

**Fix**: Check the generated types in `../src/generated/graphql-types.ts` for correct property names

### Issue: Unused variables

**Fix**: Remove unused variables or prefix with underscore: `_unusedParam`

### Issue: Type mismatches

**Fix**: Ensure your objects match the expected TypeScript interfaces

### Issue: Missing imports

**Fix**: Add proper import statements for all used types

## Why This Matters

- **Catches errors early**: Find type issues before API calls fail
- **Better developer experience**: Clear error messages at compile time
- **Safer refactoring**: TypeScript ensures changes don't break existing code
- **Documentation**: Strong types serve as documentation
- **Consistency**: Ensures all team members follow same standards

## Bypassing Validation (Emergency Only)

```bash
# Skip validation for tests (not recommended)
npm run test:unsafe

# Skip git pre-commit validation (not recommended)
git commit --no-verify
```

## Troubleshooting

If validation is too slow, use quick validation:

```bash
npm run validate:quick
```

If you need to exclude certain checks, modify `validate.js` or `tsconfig.json`.
