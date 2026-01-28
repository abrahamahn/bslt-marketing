# Basalt Marketing Website: Technical Master Plan

## 1. Project Overview

- **Project Name:** `basalt-marketing`
- **Product Identity:** **Basalt** (The solid foundation formed by rapid execution).
- **Goal:** A high-performance, conversion-optimized landing page that serves as the "Sales Rep" for the Basalt boilerplate.
- **Key Differentiator:** Raw speed. No heavy frameworks (React/Next.js) to slow down the first paint.

## 2. Tech Stack & Architecture

We are using the "Golden Standard" Vanilla configuration for maximum longevity and zero-dependency risk.

- **Build Tool:** [Vite](https://vitejs.dev/) (Preset: `vanilla-ts`)
- **Language:** TypeScript (Strict Mode)
- **Styling:** CSS + PostCSS + Autoprefixer
- **Linting:** ESLint + Prettier
- **Hosting:** Vercel / Netlify (Edge Network)
- **Package Manager:** `pnpm`

## 3. Directory Structure (Blueprint)

This structure is "Feature-Based." Instead of separating files by type (all CSS in one folder), we group them by _feature_. This makes deleting or refactoring code safer.

```text
basalt-marketing/
├── public/                  # Static assets (served at root /)
│   ├── images/              # WebP images only (TODO)
│   ├── fonts/               # Woff2 files (TODO)
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── assets/              # Imported assets (SVGs, icons)
│   ├── styles/              # Global Design System
│   │   ├── reset.css        # Modern CSS reset
│   │   ├── variables.css    # CSS custom properties (Basalt Dark, Magma Orange)
│   │   ├── typography.css   # Font faces and fluid type scales
│   │   ├── layout.css       # Layout components (hero, sections, footer)
│   │   └── main.css         # Entry point (imports all)
│   ├── modules/             # Interactive Logic (The "Features")
│   │   ├── navbar/
│   │   │   ├── navbar.ts           # Scroll logic & mobile toggle
│   │   │   └── navbar.css          # Component styles
│   │   ├── keyboard/
│   │   │   └── keyboard.ts         # Keyboard shortcuts (G, D, P)
│   │   ├── pricing-toggle/         # (TODO)
│   │   │   ├── pricing.ts          # Monthly/Yearly math logic
│   │   │   └── pricing.css
│   │   └── hero-terminal/          # (TODO)
│   │       ├── terminal.ts         # Typewriter effect logic
│   │       └── terminal.css
│   ├── utils/               # Shared helpers
│   │   └── dom.ts           # Typed document.querySelector wrappers
│   ├── main.ts              # App Entry (Imports styles & initializes modules)
│   └── vite-env.d.ts
├── docs/                    # Documentation
│   ├── SPEC.md              # This file
│   └── SPEC-module.md       # Feature specifications
├── index.html               # Homepage
├── legal.html               # Privacy Policy (TODO)
├── package.json             # Project manifest
├── pnpm-lock.yaml           # Lockfile
├── vite.config.ts           # Build optimization config
├── tsconfig.json            # Strict TypeScript config
├── eslint.config.js         # ESLint flat config
├── postcss.config.js        # PostCSS + Autoprefixer
├── .prettierrc              # Formatting rules
├── .prettierignore          # Prettier ignore patterns
└── .gitignore               # Git ignore patterns
```

## 4. Design & Feature Specs

### A. Core UI Components

1. **The "Magma" Nav:**

- **State 1:** Transparent background (Hero view).
- **State 2:** Solid `Basalt Dark` (#0a0a0a) with blur effect (on scroll > 50px).
- **Links:** Features, Pricing, Docs (External), GitHub (External).
- **CTA:** "Get Basalt" (Gradient Magma Button).

2. **Hero Section:**

- **H1:** "Form Your Foundation."
- **Sub:** "The production-ready monorepo boilerplate forged in the heat of shipping."
- **Visual:** A dark, geometric 3D basalt block or a minimal code terminal animation.

3. **The "Strata" Grid:**

- Bento-box style grid layout using CSS Grid.
- **Cards:** "Monorepo Native", "Type Safe", "Stripe Ready".
- **Interaction:** Subtle border glow on hover.

4. **Pricing Section:**

- **Toggle:** "Solo" (Monthly) vs "Team" (Lifetime).
- **Logic:** Toggling switches the price text instantly via DOM manipulation.
- **Link:** "Buy" button links to `https://app.basalt.dev/register?plan=pro`.

### B. Integration Points

- **Auth:** NO server code. "Login" links to `app.basalt.dev/login`.
- **Payments:** NO Stripe SDK. Links directly to hosted checkout or app registration.
- **Forms:** Newsletter signup (if any) uses a simple `fetch()` POST to a third-party API (ConvertKit/Mailchimp).

## 5. Performance & SEO (The Golden Standard)

### A. Performance Targets

| Metric                     | Target | Method                                 |
| -------------------------- | ------ | -------------------------------------- |
| **Lighthouse Score**       | 100    | Minified assets, accessible colors.    |
| **First Contentful Paint** | < 0.5s | Critical CSS inline, no JS blocking.   |
| **Layout Shift (CLS)**     | 0.00   | Explicit `width/height` on all images. |
| **JS Bundle Size**         | < 30kb | No frameworks. Pure DOM TS.            |

### B. SEO Setup

**1. Meta Tags (In `<head>`):**

```html
<title>Basalt | Form Your Foundation</title>
<meta
  name="description"
  content="Ship faster with Basalt. The production-ready TypeScript monorepo boilerplate for SaaS."
/>
<meta property="og:image" content="https://basalt.dev/images/og-social.jpg" />
<meta property="og:title" content="Basalt | Form Your Foundation" />
<meta name="twitter:card" content="summary_large_image" />
```

**2. Structured Data (JSON-LD):**
Place this in `index.html` to tell Google this is software.

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Basalt",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "149.00",
      "priceCurrency": "USD"
    }
  }
</script>
```

## 6. Development Best Practices (Rules of Engagement)

### A. TypeScript Golden Rules (`tsconfig.json`)

We do not want "loose" TypeScript. We want strict safety.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["vite/client"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

### B. CSS Architecture

- **Variables:** Never hardcode hex codes. Use CSS custom properties from `variables.css`.
- **Mobile First:** Write the mobile styles as default, use `@media (min-width: 768px)` for desktop overrides.
- **Modern CSS:** Use `clamp()` for fluid typography instead of massive lists of media queries.

### C. Asset Handling

- **Images:** All images must be `.webp`. Use [Squoosh.app](https://squoosh.app/) to compress before committing.
- **Fonts:** Self-host fonts (Woff2). Do not use Google Fonts CDN (privacy/performance cost).
- _Implementation:_ `@font-face { font-display: swap; }` to prevent invisible text.

### D. Code Quality & Formatting

- **ESLint:** Strict TypeScript rules via `typescript-eslint`.
- **Prettier:** Use `.prettierrc` to enforce consistent formatting (semicolons, single quotes).

## 7. Implementation Status

| Task | Status |
|------|--------|
| Vite + TypeScript setup | Done |
| PostCSS + Autoprefixer | Done |
| ESLint + Prettier | Done |
| CSS Design System | Done |
| Navbar scroll effect | Done |
| Keyboard shortcuts (G, D, P) | Done |
| JSON-LD structured data | Done |
| robots.txt / sitemap.xml | Done |
| dom.ts utility | Done |
| Hero terminal animation | Pending |
| Pricing toggle | Pending |
| Self-hosted fonts | Pending |
| OG images | Pending |
| legal.html page | Pending |
| analytics.ts utility | Pending |
