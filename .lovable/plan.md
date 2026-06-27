## Goal

Three concrete upgrades to the current build:

1. Recreate the uploaded video's look (deep-space gravity well, swirling particle nebula, drifting light streaks, soft volumetric glow) as an interactive WebGL background on the homepage.
2. Reuse that same scene on every inner page in a **dimmed + blurred + slowed** state so the cosmic atmosphere carries through without competing with content.
3. Bring the 7 service sub-pages up to full PRD spec (overview, benefits, delivery process, technologies, related case studies, FAQ accordion, dual CTA).

Out of scope this pass (per the answers): industries sub-pages, full case study build-out, testimonials section, copy mirrored from dimisi.tech.

---

## 1. New homepage background ("Cosmos" scene)

Replace the current `ScrollWorld` scroll-driven world on the homepage with a single ambient `CosmosScene` that mirrors the video:

- **Gravity well core** — a dark spherical lens at center with a thin rim-light shader (Fresnel) and a faint accretion-style ring. Subtle rotation, no aggressive bloom.
- **Particle nebula** — ~6k additive points distributed in a torus + sphere hybrid, drifting around the core. Color gradient: deep indigo `#1B1140` → electric blue `#3B82F6` → cyan `#06B6D4` → magenta highlights `#A855F7`.
- **Light streaks** — instanced long thin planes with additive blending streaming tangentially around the well (the "comet trails" in the video).
- **Volumetric haze** — large back-facing sphere with a radial gradient shader for the soft purple/blue glow.
- **Postprocessing** — Bloom (threshold 0.6, intensity 0.7), subtle chromatic aberration, vignette. Keep bloom low so text stays readable.
- **Interactivity** — slow auto-rotation + mouse-parallax tilt (clamped). Scroll progress (0–1) only modulates camera dolly + nebula density, not entire scene swaps — keeps it ambient rather than scene-by-scene.

Performance gates:
- `useDevicePerformance` already exists → low/mid devices get half particle counts, no chromatic aberration, no light streaks.
- Reduced-motion → static gradient fallback (already wired).
- DPR clamp `[1, 1.5]`.

The existing `HeroSection`, `WorldSection`, `ServicesSection`, `ProofSection`, `CTASection` stay; they just sit over the new background. The legacy `Planet`, `Globe`, `EnergyRings`, multi-scene `ScrollWorld` are removed from the homepage (kept in repo only if reused).

## 2. Inner-page background ("Cosmos — ambient" mode)

Promote the canvas out of `routes/index.tsx` into `__root.tsx` so it persists across navigation. The same `CosmosScene` component accepts a `mode` prop:

- `mode="hero"` — full intensity, used on `/`.
- `mode="ambient"` — used on every other route: rotation speed ×0.3, particle alpha ×0.4, bloom off, plus a CSS layer `backdrop-filter: blur(14px)` and a `rgba(5,11,24,0.55)` overlay above the canvas.

Mode is chosen from `useRouterState().location.pathname === "/"`. Inner pages keep their existing dark gradient look but with the soft cosmic motion bleeding through.

## 3. Service sub-pages → full PRD spec

The 7 routes already exist (`services.software-development.tsx`, …`services.consulting.tsx`) and share `ServiceDetail.tsx`. Expand the shared component + per-service data so each page contains, in this order:

1. Hero — service name, one-line value prop, dual CTA (Book Consultation · View Case Studies).
2. Overview — 2–3 paragraphs of business-language explanation.
3. Benefits grid — 4–6 outcome-focused cards with icons.
4. Delivery process — 5-step horizontal timeline (Discovery → Planning → Build → QA → Launch & Support), each step iconed + one-line description.
5. Technologies used — chip grid, sourced from `mockData.technologies` filtered per service.
6. Related case studies — 2 cards pulled from `mockData.caseStudies`.
7. FAQ — shadcn `Accordion`, 4 questions per service.
8. Final CTA banner.

Per-service content lives in a new `src/lib/serviceContent.ts` keyed by slug (benefits, process copy overrides, tech list, faqs). Existing `mockData.ts` services array stays as the directory source. Each route's `head()` gets a unique title + description + og:title + og:description (currently they share generic copy).

## Technical notes (for the dev team)

- New files: `src/components/3d/scenes/CosmosScene.tsx`, `src/components/3d/CosmosCanvas.tsx` (replaces `HomeCanvas` usage; mounted in `__root.tsx`), `src/components/3d/objects/GravityWell.tsx`, `src/components/3d/objects/LightStreaks.tsx`, `src/components/3d/objects/VolumetricHaze.tsx`, `src/lib/serviceContent.ts`.
- Modified: `src/routes/__root.tsx` (mount canvas + route-aware mode), `src/routes/index.tsx` (drop local canvas), `src/components/sections/ServiceDetail.tsx` (expanded layout), all 7 `services.*.tsx` route files (richer head + pass slug).
- Removed from active homepage render: the multi-scene `ScrollWorld`. Old `Planet`/`Globe`/`EnergyRings` files left untouched.
- No new deps — `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing` are already installed.
- Accessibility: canvas stays `aria-hidden`, `pointer-events: none`; reduced-motion fallback preserved.

## Acceptance

- Homepage: cosmic scene visibly matches the video's gravity-well + streaming particle feel, runs ≥45 fps on a mid laptop.
- Navigating to `/services`, `/about`, `/contact`, etc. keeps the same scene behind a blur+dim layer; content remains fully legible.
- Each of the 7 service sub-pages renders the 8 sections above with service-specific copy, unique `<title>`, and a working FAQ accordion.
