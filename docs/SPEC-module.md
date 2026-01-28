Basalt Marketing Website: Feature Specification

1. Core Experience (UX/UI)
   The "Basalt" Design System:

Default Dark Mode: The site defaults to a rich, charcoal/black theme (The "Basalt" theme) to appeal to developers.

Magma Accents: Interaction states (hover, focus, active) use a gradient of bright orange to deep red.

Glassmorphism: Navigation and floating elements use backdrop-filter: blur(12px) to simulate obsidian glass.

Performance First:

Zero Layout Shift: Skeleton loaders or strict dimensions for all assets.

Font Loading Strategy: Inter and JetBrains Mono (for code) loaded with swap to ensure text is visible immediately.

2. Homepage Structure (The Conversion Flow)
   A. The "Terminal" Hero
   Instead of a generic stock photo, we use a code-first approach.

Headline: "Form Your Foundation."

Sub-headline: High-contrast text explaining the value proposition (Speed + Solidity).

Visual: An interactive-looking Terminal window.

Animation: Types out npx create-basalt-app my-saas.

Output: fast-scrolling success messages (green text) ending with "Done in 1.4s."

Primary CTA: "Get Started" (Links to Pricing).

Secondary CTA: "View GitHub" (Social Proof).

Clipboard Copy: A distinct command box npx create-basalt-app that copies to clipboard on click.

B. The "Tech Stack" Marquee
An infinite horizontal scroll component.

Content: Greyscale logos that light up in color on hover.

Logos: Next.js, TypeScript, PostgreSQL, Stripe, Tailwind, Shadcn/UI, Docker, AWS.

Tooltip: Hovering a logo shows a micro-tooltip explaining how it's used (e.g., Hover Stripe -> "Pre-configured Subscription Webhooks").

C. The "Strata" Bento Grid (Features)
A modular grid layout (Apple/Linear style) showcasing key technical wins.

Card 1: Monorepo Native. Visualization of the folder structure.

Card 2: Type Safety. A split view showing a DB schema changes auto-updating the Frontend types.

Card 3: Auth Ready. A UI mockup of the login screen.

Card 4: Performance. A Lighthouse score gauge locked at "100".

D. "Code Proof" Tabs
Developers don't trust marketing copy; they trust code.

Component: A tabbed code block viewer.

Tabs: api-route.ts, schema.prisma, subscription.ts.

Feature: Syntax highlighting (PrismJS or Shiki).

Goal: Show the cleanliness and strictness of the boilerplate code.

E. "Basalt vs. Concrete" (Comparison Table)
A direct comparison to alternatives (DIY or other boilerplates).

Columns: Basalt vs. "Starting from Scratch".

Rows: Setup Time, Type Safety, Stripe Integration, Email Templates, SEO Setup.

Visuals: Checkmarks (Green) vs. Crosses (Red) or Warning signs (Yellow).

3. The Pricing Module
   A psychological pricing design to drive users to the "Standard" or "Magma" tier.

Toggle Switch: "Monthly" (Subscription SaaS model) vs. "Lifetime" (One-time code purchase). Note: Logic needs to handle different product types.

Tier 1: Lite (Open Source)

Price: $0.

CTA: "Clone from GitHub".

Features: "Core Monorepo", "Basic Auth".

Tier 2: Standard (The Product)

Price: $149 (One-time).

Highlight: "Best Value".

CTA: "Buy License".

Features: Everything in Lite + "Stripe", "Dashboard UI", "Email System".

Tier 3: Magma (SaaS)

Price: $299 (One-time) or Subscription.

CTA: "Go Enterprise".

Features: Everything in Standard + "Multi-Tenancy", "AI Modules", "Priority Support".

Trust Signals: "30-day money-back guarantee" and "Secure checkout via Stripe" badges below the cards.

4. Developer Experience Features (DX)
   These are "nice to have" features that impress serious engineers.

Keyboard Shortcuts:

Press G to go to GitHub.

Press D to open Documentation.

Command Palette (Cmd+K):

A simple modal to jump to "Pricing", "Features", or "Docs" without using the mouse.

Changelog Widget:

A small badge in the navbar showing the latest version (e.g., "v1.2 shipped"). Clicking it opens a modal with the latest release notes.

5. Trust & Social Proof
   Testimonial Wall: Masonry layout of Tweets/Comments.

GitHub Star Counter: Live fetch of the repo's star count (cached to prevent rate limits).

"Built with Basalt" Showcase: Logos or screenshots of real startups built using the stack.

6. Footer & Legal
   Sitemap: Organized links (Product, Resources, Legal).

Legal Pages:

Privacy Policy: Standard GDPR compliant text.

Terms of License: CRITICAL. Clearly stating what they can/cannot do with the code (e.g., "You cannot resell this boilerplate as a boilerplate").

Socials: Twitter (X), Discord, GitHub.

7. SEO & Technical Specs
   Robots.txt: Allow indexing of all pages except /legal.

Sitemap.xml: Auto-generated.

Canonical URLs: Self-referencing to prevent duplicate content issues.

Open Graph Images: Custom designed images for Twitter Cards and LinkedIn (Dynamically generated or static).

JSON-LD: SoftwareApplication schema embedded in index.html.
