# BSLT Marketing Content Spec

This marketing page should describe the current `bslt-main` repository as a clone-and-own SaaS starter, not as a broad paid "SaaS engine" with every platform module enabled by default.

## Positioning

BSLT is a production-oriented TypeScript SaaS starter for teams that want to own the source. The default path is intentionally thin, then deeper platform systems are enabled through recipes when product requirements justify them.

Primary promise:

> Start with React 19 + Vite, Fastify, PostgreSQL, email/password auth, workspaces, settings, generated contracts, tests, and deploy guardrails. Add billing, advanced auth, advanced admin, and workers only when needed.

## Default Starter Surface

- Vite React web app.
- Fastify API.
- PostgreSQL with custom SQL repositories.
- Email/password registration, verification, reset, sessions, account settings, and account deletion.
- Workspace creation, switching, member list, invitations, and basic roles.
- Minimal admin health/readiness/user lookup.
- Local dev services, local file/avatar support, and local email.
- Checked request/response schemas, generated API clients, and React hooks.
- Route-contract, docs-link, public-asset, lint, type-check, test, and build verification.
- Docker compose and provider deploy guides.

## Optional Recipes

- `billing`: pricing, checkout, billing settings, provider wiring, and admin linkage.
- `advanced-auth`: OAuth, magic links, passkeys, and MFA surfaces.
- `advanced-admin`: tenants, jobs, webhooks, audit/legal views, feature flags, and route diagnostics.
- `workers`: background workers for retries, scheduled work, and long-running product jobs.

## Claims to Avoid

- Do not claim Electron, native desktop, or native mobile ships in the starter.
- Do not claim billing, workers, advanced admin, media processing, push notifications, or advanced auth are enabled by default.
- Do not market Drizzle, Prisma, Zod, `ts-rest`, GraphQL, or tRPC unless the repo actually uses them.
- Do not claim fixed test counts, JSDoc percentages, paid license terms, refunds, or private repo access.
- Do not present optional adapters as production-ready defaults.

## Recommended Page Language

- "Clone-and-own SaaS starter."
- "Starter profile by default; recipes when needed."
- "Generated contracts, clients, hooks, and route audits."
- "React 19 + Vite, Fastify, PostgreSQL, Turborepo, pnpm workspaces, Docker."
- "Own the code, keep the default lane thin, and add platform depth deliberately."
