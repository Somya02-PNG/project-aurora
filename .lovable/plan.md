## Full Site Overhaul Plan

### 1. Theme & Color Tokens (`src/styles.css`)

- Update CSS variables to the new palette:
  - `--background: #020408`, `--surface: #060d1a`, `--surface-2: #0a1628`
  - `--card: #0c1a2e`, `--border: #1a3050`
  - `--foreground: #ffffff`, `--muted-foreground: #8aa8c8`
  - `--primary/--accent: #3b82f6`
- Replace existing nebula/glow gradients with darker, more restrained values.
- Remove pulsing-glow / shimmer / orbit keyframes from active utilities (keep file but unused).
- Add `.grain-overlay` utility (3–5% opacity SVG noise, fixed, pointer-events none, z-index 0).
- Refine `.reveal-on-scroll` to include scale 0.95 → 1.0 alongside fade + Y-translate, 0.6s ease-out.
- Keep `prefers-reduced-motion` overrides.

### 2. Global Background (`src/components/background/GlobalBackground.tsx`)

Strip the current "deep space cinematic" layers down to minimal:

- Solid base `#020408` with a single very subtle radial gradient toward `#060d1a`.
- Canvas with ~180 tiny static star pinpoints (0.5–1.2px, white / `#B0C8FF`, opacity 0.15–0.25). No drift, no animation.
- Two static radial glow divs (`#0d2644`, 8–12% opacity, ~700px blur) anchored in two opposite corners only.
- Remove: breathing scale animation, drifting cyan particles, nebula blobs, animated layers.
- Add fixed grain overlay div on top of background (still behind content, `z-index: -1`, pointer-events none).

### 3. Hero Right Visual (`src/components/sections/HeroOverlay.tsx` + new assets)

- Generate two new transparent PNG assets:
  - `src/assets/hero-hand.png` — single futuristic digital hand, palm up, transparent background, no chain, no frame.
  - `src/assets/hero-connector.png` — single glowing cyan/blue connector/link piece, transparent background, centered.
- Rebuild the right column:
  - Remove current `heroChain` masked layers and the duplicated chain wrapper.
  - Static `<img>` of the hand, no mask, no border, no box — naturally floats on the dark background (slight drop-shadow only).
  - Connector image positioned above the hand inside a single `#connector-wrapper` div.
  - Animate connector via one rAF loop on a single transform: `rotateY(0→360deg)` continuous, ~9s linear, plus a subtle constant `filter: drop-shadow(0 0 18px rgba(59,130,246,0.55))`.
  - No tilt, no float separation — pure Y-spin so it never "breaks into parts".
- Respect `prefers-reduced-motion` (no spin).

### 4. Scroll Animations (`src/hooks/useReveal.ts` + usage)

- Ensure the hook uses `IntersectionObserver` (threshold ~0.15) to add `.is-visible`.
- Update `.reveal-on-scroll` keyframes to fade + scale 0.95→1.0 + translateY(20→0), 0.6s ease-out.
- In hero, services, about, CTA, footer sections, ensure heading/subtext/buttons each carry `reveal-on-scroll` with `--reveal-index` 0/1/2 for the 100–150ms stagger.
- Verify no width/height-based reveals on mobile to prevent layout shift.

### 5. Section Backgrounds

- Replace `bg-section-*` utilities with very subtle `#0a1628` tinted radial gradients (or pure transparent) so the global bg shows through but section variation reads at `#0a1628`.
- Remove any leftover purple/cyan ambient glows from `HeroSection`, `ServicesSection`, `StatsSection`, `WorldSection`, `ProofSection`, `TestimonialsSection`, `CTASection`, `Footer`, route pages (`about`, `contact`, `services.*`, `case-studies.*`, `industries`, `technologies`).

### 6. Cards & Borders (`src/components/ui/GlassCard.tsx` + shadcn card usages)

- Update card background to `rgba(12,26,46,0.78)` with `1px solid #1a3050`.
- Tone down hover glow to a soft `#3b82f6` border highlight only.

### 7. Z-Index Discipline

- Global background container: `z-index: -1`.
- Grain overlay: `z-index: 0`, pointer-events none.
- Main app wrapper in `__root.tsx`: `position: relative; z-index: 10`.
- Hero connector animation confined to its column; no overflow into text column.

### 8. Cleanup

- Stop importing/rendering unused heavy 3D scenes from the homepage (`CosmosCanvas`, `HomeJourneyCanvas` if still referenced) to keep the minimal aesthetic.
- Keep all routes, copy, nav links, fonts, and layout structure exactly as-is.

### Out of Scope (explicitly unchanged)

- All text/copy, headings, button labels, navigation structure, route files, font families/sizes, page order, form behavior.

### Verification

- Visual check across `/`, `/about`, `/services`, a service detail page, `/case-studies`, `/contact` at desktop (1280) and mobile (390) widths via Playwright screenshots.
- Confirm no white backgrounds, hero connector spins as one piece, scroll reveals fire once per section, no text/element overlap with background effects.i want equally that nmy hero section is looks so good make sure i want sigle hand and connerctor above it whixh rotate properly 
-  