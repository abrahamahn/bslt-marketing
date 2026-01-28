You are absolutely right to look at [Vite.dev](https://vite.dev) for inspiration. It is currently the "Gold Standard" for developer marketing because it sells **complex tooling** through **simple, visceral speed.**

I have analyzed the Vite landing page and found three specific "marketing engineering" patterns we should steal for Basalt.

### What we are stealing from Vite.dev:

1. **The "Instant" Visualizer:** Vite doesn't just _say_ it's fast; it visualizes the difference between "Bundle-based" (Slow) vs. "Native ESM" (Fast). We will adapt this for Basalt as **"The Cold Start Comparison."**
2. **Granularity Grid:** Vite lists every framework (Vue, React, Svelte) with a tiny icon. We will do this for **Integrations** (Stripe, AWS, PostHog) to show the ecosystem breadth.
3. **"Rich Features" Cards:** Vite uses small cards with simple headers (TS, JSX, CSS) that link to deep docs. We will use this for our "Stack Primitives."

Here is the **Updated, Vite-Enhanced `FEATURES.md**`.

---

# FEATURES.md (Vite-Enhanced Edition)

## 1. Hero Section: The "Instant" Promise

Instead of a generic laptop screen, we use a **Split-Screen Performance Visualizer** inspired by Vite's "Native ESM" diagram.

- **Headline:** "Ready before you blink."
- **Sub-headline:** "The PERN monorepo that skips the boilerplate traffic jam."
- **The Visual:** A "Race Track" comparison animation (CSS only).
- **Left Lane (Others):** A progress bar labelled "Next.js DIY" loading slowly... `Installing Eslint...` `Configuring Jest...` `Fixing Types...` (Takes 5 seconds).
- **Right Lane (Basalt):** A solid green beam labelled "Basalt". Instantly hits 100%. Text flashes: **"0ms Cold Start."**

- **CTA:** "Start Building (0.4s)" – The button itself includes the time-to-interactive.

## 2. The "Universal Support" Grid (Vite Style)

Vite shows support for every framework. Basalt shows support for every **SaaS Essential**. We use a 6-column grid of small, monochrome logos that light up on hover.

- **Headline:** "Pre-configured for the modern web."
- **The Grid:**
- **Payment:** Stripe, LemonSqueezy.
- **Auth:** Google, GitHub, Magic Links, MFA.
- **Ops:** Docker, Railway, Vercel, AWS S3.
- **Data:** PostgreSQL, Redis, Supabase.
- **Tools:** PostHog, Sentry, Resend (Email).

- **Interaction:** Hovering "Stripe" doesn't just light it up; it changes the sub-text below the grid to: _"Includes Webhook handlers, Checkout Sessions, and Portal config."_

## 3. The "Rich Features" Bento Box

We replace generic feature cards with **Technical Deep-Dive Cards**, mimicking Vite's "TS/JSX/CSS" feature section.

- **Card 1: End-to-End Type Safety**
- _Visual:_ An animated arrow flowing from a SQL Database table `User` -> API Route -> React Component props.
- _Caption:_ "Change your DB schema. Your frontend breaks instantly. Fix it before you ship."

- **Card 2: The "Internal" Tier**
- _Visual:_ A 3-Layer Diagram (Internal / Pro / Standard).
- _Caption:_ "Keep your admin tools secret. Ship the product clean. The only architecture that separates Business Logic from Product Logic."

- **Card 3: Optimized Build**
- _Visual:_ A Docker whale icon with a file size badge.
- _Text:_ "Multi-stage Docker builds reducing images from 1.2GB to 80MB."

## 4. The "Lightning" Code Block

Vite emphasizes HMR (Hot Module Replacement). We emphasize **DX (Developer Experience)**.

- **Headline:** "It feels like cheating."
- **Component:** An interactive IDE window.
- **Action:**

1. User clicks a button "Add Subscription".
2. The code block "types" itself out: `npx basalt add subscription`.
3. The file tree sidebar instantly populates with: `stripe.ts`, `pricing-table.tsx`, `webhook-handler.ts`.
4. _Toast Notification:_ "Subscription module added in 400ms."

## 5. Pricing: The "Plugins" Mental Model

Vite treats frameworks as plugins. We treat Business Features as plugins.

- **Concept:** "Don't pay for what you don't need."
- **Visual:** The pricing table looks like a **Package Manager Config**.
- **Core (Free):** `{ monorepo: true, auth: true }`
- **Standard ($149):** `...Core, { stripe: true, dashboard: true }`
- **Magma ($299):** `...Standard, { multi_tenancy: true, ai_drivers: true }`

## 6. Social Proof: The "Ecosystem"

Vite relies heavily on showing who uses it.

- **The "Used By" ticker:** Instead of just company logos, use **Project Avatars**. "Built with Basalt: _Project A_, _SaaS B_, _Tool C_."
- **The GitHub Button:** A large, prominent button in the footer that says "View the Source on GitHub" with a live star count.

---

### Why this works (The Vite Effect)

Vite's marketing works because it respects the developer's intelligence. It doesn't promise "Easy money"; it promises **"Less suffering."**

- **Vite:** "No more waiting for bundlers."
- **Basalt:** "No more waiting for boilerplate setup."

By visualizing the _removal of pain_ (the "Race Track" and the "Type Safety" flow), you are using the exact psychological hook that made Vite the #1 build tool in the world.

Here is a relevant video that analyzes why Vite's specific approach to "unbundled" development (and its marketing of speed) is so effective for developers.

[Vite in 100 Seconds](https://www.youtube.com/watch?v=KCrXgy8qtjM)
_This video breaks down exactly how Vite's "Instant Server Start" works technically, which you can mimic visually in your Hero section's comparison animation._
