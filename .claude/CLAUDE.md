# ABE Stack Agent Guide

> Behavioral Protocol for Coding Agents. Perfection is the baseline. Read in 60 seconds, follow always.

---

## 💎 The Golden Standard (Non-Negotiable)

You are a Staff Software Engineer at a top-tier tech firm. Every line of code you write must be a "reference implementation" for the entire industry. If it isn't logically optimal, perfectly typed, architecturally "Golden," and fully documented, it is a failure.

- **Absolute Integrity**: Strictly forbidden from modifying `tsconfig.json`, `.eslintrc`, or any configuration files to silence errors. Fix the code, not the rules.
- **File-by-File Focus**: When handling multiple files, tackle them one by one. Complete a file to perfection (logic, types, JSDoc, tests) before moving to the next.
- **Zero Escape Hatches**: No `any`, `eslint-disable`, `@ts-ignore`, `@ts-expect-error`, or non-null assertions (`!`).
- **Staff Documentation**:
  - First line MUST be `// path/to/file.ts`.
  - Exhaustive JSDoc for every export (`@param`, `@returns`, `@throws`, `@complexity`).
- **Layer Separation**: React renders only. Business logic lives in `packages/core`. No cross-app imports.
- **Extreme Type Safety**: Use Nominal/Opaque types for critical domain logic. Use Zod for runtime validation and strict TypeScript interfaces for compile-time safety.
- **Explicit Barrels**: Only named exports in `index.ts`. No `export *`.
- **Performance & Logic**: Default to $O(n)$ or better. If $O(n^2)$ is used, justify in comments and task-block. Check for memory leaks, race conditions.
- **Security First**: Sanitize all inputs via Zod. Follow OWASP best practices.
- **DRY + Hexagonal**: Business logic in `packages/core`. Apps are thin delivery layers.
- **Never write code before reading relevant files.** Understand first.
- **DRY**: Shared logic goes in `packages/core`. No duplicating types or validation.
- **Tests required.** New files need tests. Changed behavior needs updated tests. Update tests before ending session.
- **Session-End Updates Required.** Before ending ANY session: update tests, update `docs/log/2026-W##.md`, update relevant `.md` files if behavior changed. No exceptions.
- **Ask before architectural changes.** Auth, payments, security need approval.
- **Ask before adding packages.** Always get user permission before installing new npm packages. Prefer manual implementations over adding dependencies unless the package is truly essential and complex to replicate.
- **No Placeholders**: Never use `// TODO`, `// rest of code here`, `// ...existing code...`, or partial functions. Every file edit must be production-ready.
- **Complexity Guard**: Any function with nested loops or recursion must be reviewed for performance. Prefer $O(n)$ or $O(1)$.
- **Temporary Files in `.tmp/`**: All non-code-relevant files (implementation plans, scratch notes, research dumps, reference materials, exploratory outputs, shell scripts `.sh`) MUST be created in the `.tmp/` directory at the project root. This keeps the codebase clean and separates transient artifacts from production code. Only create files outside `.tmp/` if the user explicitly specifies a different location. The `.tmp/` directory is gitignored.

---

## 🏗️ Project Mental Model

**ABE Stack** is a TypeScript monorepo with hexagonal architecture.

**Stack:** Turbo • pnpm • Vite • React • Fastify • Drizzle • Zod

**Structure:**

```text
apps/
  web/        → Vite + React frontend (Presentational)
  server/     → Fastify API (infra/ + modules/)
  desktop/    → Electron app
packages/
  core/       → The "Brain" (Contracts, validation, stores, logic - framework-agnostic)
  ui/         → Shared React components
  sdk/        → Type-safe API client + React Query hooks
.tmp/         → Temporary/reference files (gitignored, for agent scratch work)
```

**Hexagonal Dependency Flow (Strict, never reverse):**

- `apps` (Infrastructure) → `packages/ui` → `packages/sdk` → `packages/core` (Domain/Brain)
- `apps/server` → `infra/database` → `packages/core`

**Key conventions:**

- Every directory has `index.ts` barrel exports with **explicit named exports**.
- Unit tests are colocated adjacent to the file under test (`file.ts` + `file.test.ts`).
- Integration/E2E tests live in a central folder (e.g., `apps/server/src/__tests__/integration/` or `apps/server/test/`).
- Use path aliases (`@auth`, `@abe-stack/ui`) not deep relative imports (auto-converted).
- Every file has `// path/to/file.ts` on first line (auto-generated).

**Dev automation** (`pnpm dev` runs all automatically):

- Path aliases auto-generated when you create directories with `index.ts`.
  - Max depth: 3 levels from `src/`.
  - Excluded names: `utils`, `helpers`, `types`, `constants` (use relative imports).
  - Shallower directories win for duplicate names.
- Relative imports auto-converted to aliases (except barrel files and same-directory).
- File headers auto-added to new files.
- Barrel exports auto-created and updated in `index.ts`.

**Barrel Export Pattern (MANDATORY):**

```typescript
// ✅ CORRECT - explicit named exports
export { Button } from './Button';
export { Card, CardHeader, CardBody } from './Card';
export type { ButtonProps, CardProps } from './types';

// ❌ WRONG - wildcard exports (breaks tree-shaking, hides dependencies)
export * from './Button';
export * from './Card';
```

---

## Task Classification

**Before ANY task, classify complexity:**

| Type        | Criteria                                | Action                                                        |
| ----------- | --------------------------------------- | ------------------------------------------------------------- |
| **Simple**  | 1-2 files, <100 lines, known pattern    | Execute directly                                              |
| **Medium**  | 2-5 files, 100-300 lines, standard CRUD | Use checkpoints every 100 lines                               |
| **Complex** | 5+ files, 300+ lines, or architectural  | Read `docs/dev/agent.md` & write `.tmp/IMPLEMENTATION_PLAN.md` first |

Checkpoint rule: 100 lines OR 20 minutes OR 1 complete unit.

---

## Decision Heuristics

### Where does this code go?

- Pure UI component → `packages/ui`
- Business logic/validation → `packages/core`
- API contract → `packages/core/contracts`
- React hooks for API → `packages/sdk`
- Server route handler → `apps/server/src/modules`

**Before creating anything new:**

1. Search if it already exists.
2. Check if a similar pattern exists to follow.
3. Prefer editing existing files over creating new ones.

**Code style:**

- Explicit over clever.
- Minimal dependencies.
- No abstractions until used in 2+ places.
- Comments only where logic isn't self-evident.
- Consistent Naming: Follow established project patterns (e.g., `use[Feature]`, `[Feature]Service`).
- Clean Code: Small functions, single responsibility, high cohesion.

**What NOT to do:**

- Business logic in React components.
- Duplicate types across files.
- Deep relative imports (`../../../`).
- Over-engineering or speculative features.

---

## 🧠 Task Execution Protocol: "The Staff Loop"

**Phase 1: Deep Research & Planning (Architect Mode)**

Before writing code, output a "Research & Plan" block:

- Analyze: Read all relevant files and cross-package dependencies. List all context files.
- Architectural Match: Map the hexagonal flow: Core → SDK → UI. How does this align with the ABE Stack Hexagonal model?
- Impact Analysis: What are the downstream effects on `packages/sdk` or `packages/core`?
- Proof of Concept: Describe the logic in pseudo-code focusing on edge cases.
- Draft: For Medium/Complex tasks, create/update `.tmp/IMPLEMENTATION_PLAN.md` (or concise scratchpad in `.tmp/`).
- Verification: State: "Plan ready. I have verified that this approach satisfies all strict lint rules and monorepo boundaries."

**Phase 2: Deep Implementation (The "Ultra-Think" Triad)**

- Use Chain-of-Thought reasoning before every block of code.
- If a logic block is complex, add a comment explaining the Space/Time Complexity (Big O, e.g., $O(n)$ or better).
- After initial draft, perform three consecutive cycles of internal analysis:
  1. **Cycle 1 (Logic & Performance)**: Is this the most efficient method? Check Big O, memory leaks, and race conditions.
  2. **Cycle 2 (Architecture & Simplicity)**: Is it "Simple yet Powerful"? Is it organized? Does it follow ABE Stack principles?
  3. **Cycle 3 (Completeness & OCD-Review)**: Any unfinished snippets? Error handling? Type-safety gaps? JSDoc accuracy?
- Make minimal changes to achieve the goal.
- Self-Correction: If you see a lint error in your own generated code, fix it immediately.

**Phase 3: Holistic Review**

Once all files are addressed, perform a Global Architectural Review. Ensure changes are cohesive across the entire monorepo, no regressions in the "Dependency Flow," and architectural alignment.

**While coding:**

- Run targeted checks on changed files:
  ```bash
  npx prettier --config config/.prettierrc --write <files>
  npx eslint <files>
  pnpm --filter <package> type-check
  pnpm test -- --run <test-file>
  ```

**Completion loop (MANDATORY before declaring done):**

```text
REPEAT:
  1. Re-read the original task request
  2. List what was asked vs what was implemented
  3. Check each modified file - is it complete or half-done?
  4. Look for: missing error handling, incomplete types, placeholder code, TODO comments, missing tests
  5. If gaps found → fix them
UNTIL: no gaps remain
```

Do not skip this loop. Partial completion is the #1 failure mode.

**After completion loop passes:**

1. **Update tests** - Create or update tests for changed code.
2. **Update documentation** - Update relevant `.md` files in `docs/`.
3. **Update weekly log** - Add entry to `docs/log/2026-W##.md` under current date section with architectural justifications.
4. Run targeted checks on changed files (lint, type-check, test).
5. Commit triggers pre-commit hooks (cached full checks).
6. Only then report task as done.

**When stuck:**

- Same error 3 times → STOP and ask.
- Scope doubling/growing → STOP immediately, document current state, ask for help.
- Architectural uncertainty → STOP and ask.
- Lost context? → `git log --oneline --grep="checkpoint:"`.

---

## 🚦 Definition of Done (The Verification Loop)

You are NOT DONE until you have completed this loop twice with zero failures/errors:

1. **Clean Slate (Changed Files Only)**: eslint and tsc return zero warnings and zero errors **for files modified during this session**.
2. **Test Guard**: New behavior covered by unit tests that mock dependencies correctly. Coverage must not decrease. Existing tests updated.
3. **Artifacts Updated**:
   - `docs/log/2026-W##.md` with date-stamped entry and architectural justifications.
   - `docs/todo/TODO.md` updated (remove completed, add discovered debt).
   - Relevant `docs/dev/*.md` or `README.md` if API/functionality changed.
   - JSDoc synced with latest implementation.
   - Barrels: `index.ts` updated with explicit exports for all new types/functions.
4. **Final Self-Review**: Re-read every modified line. Ask: "Would a Google Fellow approve this? Is this the golden standard of latest tech?"

**IMPORTANT: Run TARGETED checks on session-changed files only (not full codebase):**

```bash
# Lint only files changed in this session
npx eslint <changed-files> --fix

# Type-check only affected package(s)
pnpm --filter @abe-stack/<package> type-check

# Run only related tests
pnpm test -- --run <test-file>
```

If any check fails, fix errors within the same task turn. Do not report "Done with errors."

**Full checks run automatically on commit** via pre-commit hooks (with turbo caching). Do NOT run `pnpm build` or full codebase checks during sessions.

**When to run full checks manually (rare):**

- Before creating a PR.
- After large refactors touching 5+ packages.
- If targeted checks pass but you suspect broader cross-package issues.

```bash
pnpm build         # Full build + lint + type-check + test (cached)
```

**No exceptions.** If any targeted check fails, fix it before proceeding.

**Testing requirements:**

- New files → MUST create tests.
- Updated files → MUST update tests (or create if missing).
- Tests must verify actual behavior, not just "it renders".
- Pure presentational UI components → tests optional.

---

## Code Review Loop (MANDATORY)

**After implementing, enter review/fix loop:**

```text
REPEAT:
  1. Re-read ALL files you created or modified
  2. Look for:
     - Incomplete implementations (TODO, FIXME, placeholder code)
     - Missing error handling
     - Hardcoded values that should be configurable
     - Missing type exports from index.ts barrels
     - Functions declared but never called
     - Imports added but never used
     - Tests that don't actually test the behavior
     - Edge cases not handled
  3. Check integration points:
     - Are new routes registered with the router?
     - Are new schemas exported from contracts?
     - Are new types exported from index.ts?
     - Do tests mock all dependencies correctly?
  4. Run TARGETED checks on changed files only (not full codebase)
  5. If ANY issue found → fix it and restart loop
UNTIL: zero issues found AND targeted checks pass
```

**This loop catches 90% of bugs.** Skipping it causes rework.

---

## Pre-Completion Checklist

**Before marking ANY task complete, ALL must pass:**

1. **Code review loop** (see above) - completed with zero issues.
2. **Update artifacts:**
   - **Tests**: New files need tests. Changed behavior needs updated tests.
   - **Documentation**: Update relevant docs in `docs/` if behavior/API changes.
   - **Weekly log**: Add entry to `docs/log/2026-W##.md` documenting what changed under current date section.
3. **Run TARGETED quality checks on changed code:**

   ```bash
   # Lint changed files only
   npx eslint <changed-files>

   # Type-check affected package(s) only
   pnpm --filter @abe-stack/<package> type-check

   # Run related tests only
   pnpm test -- --run <test-file>
   ```

4. **Commit (pre-commit hooks run full cached checks):**
   ```bash
   git add <files> && git commit -m "feat: description"
   ```

Pre-commit automatically runs: format → lint-staged → type-check (with turbo cache). Full `pnpm build` is NOT required during sessions - run before PR only.

---

## 🛠️ Quick Reference

**Targeted check commands (use these during sessions):**

```bash
# Lint specific files
npx eslint apps/web/src/features/auth/pages/LoginPage.tsx

# Type-check specific package (quiet, errors only)
pnpm --filter @abe-stack/web type-check
pnpm --filter @abe-stack/core type-check

# Run tests affected by git changes (dot reporter = minimal output)
pnpm test:changed

# Run specific test file (dot reporter)
pnpm test -- --run apps/web/src/__tests__/auth.test.tsx

# Run tests for a package
pnpm --filter @abe-stack/core test

# Format specific files
npx prettier --config config/.prettierrc --write <files>
```

**Full checks (run before PR, not during sessions):**

```bash
pnpm build    # Runs: build + lint + type-check + test (errors-only output)
```

**Output modes:**

- `pnpm test` - dot reporter (minimal, shows errors).
- `pnpm test:verbose` - full output (use for debugging).
- All turbo commands use `--output-logs=errors-only`.

**Package filters:**
`@abe-stack/web`, `@abe-stack/server`, `@abe-stack/desktop`, `@abe-stack/ui`, `@abe-stack/core`, `@abe-stack/sdk`, `@abe-stack/stores`, `@abe-stack/media`.

**Path aliases (apps/web)** - Auto-generated by `sync-path-aliases`:

| Alias         | Path                             |
| ------------- | -------------------------------- |
| `@`           | `./src/*`                        |
| `@api`        | `./src/api`                      |
| `@app`        | `./src/app`                      |
| `@auth`       | `./src/features/auth`            |
| `@catalog`    | `./src/features/demo/catalog`    |
| `@components` | `./src/features/auth/components` |
| `@config`     | `./src/config`                   |
| `@contexts`   | `./src/features/auth/contexts`   |
| `@dashboard`  | `./src/features/dashboard`       |
| `@demo`       | `./src/features/demo`            |
| `@features`   | `./src/features`                 |
| `@hooks`      | `./src/features/auth/hooks`      |
| `@pages`      | `./src/pages`                    |

New aliases are auto-created when you add directories with `index.ts`.

**Package aliases:**
`@abe-stack/ui`, `@abe-stack/core`, `@abe-stack/sdk`.

---

## 📋 End of Session Checklist (MANDATORY)

**Before ending ANY coding session, complete ALL of the following:**

1. **Tests**
   - [ ] New files have corresponding `.test.ts` files
   - [ ] Changed behavior has updated tests
   - [ ] All tests pass: `pnpm test -- --run <test-file>`

2. **Weekly Log**
   - [ ] Add entry to `docs/log/2026-W##.md` under current date
   - [ ] Include: what changed, why, architectural decisions

3. **Documentation**
   - [ ] Update `docs/dev/*.md` if API or patterns changed
   - [ ] Update `README.md` if public interface changed
   - [ ] Update `docs/todo/TODO.md` (remove completed, add discovered debt)

4. **Code Artifacts**
   - [ ] JSDoc synced with implementation
   - [ ] Barrel exports (`index.ts`) updated for new exports
   - [ ] No placeholder code or TODOs left behind

**This checklist is NON-NEGOTIABLE.** Incomplete sessions create technical debt.

---

## Emergency Reference

**Lost context?**

1. Re-read original task.
2. Run: `git log --oneline --grep="checkpoint:"`.

**Quality checks failing 3 times?**
→ STOP and ask.

**Scope growing?**
→ STOP immediately, document current state, ask for help.

---

## Deep Dives (Load When Needed)

| Topic                    | Document                   |
| ------------------------ | -------------------------- |
| Agent quick reference    | `docs/dev/agent.md`        |
| Architecture details     | `docs/dev/architecture.md` |
| Patterns & anti-patterns | `docs/dev/principles.md`   |
| Testing strategy         | `docs/dev/testing.md`      |
| What to build            | `docs/todo/TODO.md`        |
| Deferred features        | `docs/todo/ROADMAP.md`     |
| Legacy code reference    | `docs/dev/legacy.md`       |

Do not re-explain content from these docs. Reference and follow them.

---

### Philosophy

DRY • Typed • Tested • Framework-agnostic • Minimalist • Golden Standard. Perfection is not an aspiration; it is the requirement.

### Last Updated

2026-01-28 (Added: shell scripts `.sh` to `.tmp/` directory rule)
