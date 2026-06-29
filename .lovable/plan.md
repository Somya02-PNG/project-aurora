# DIMISI Visual Redesign — Plan

Scope: visuals only. No text, routing, buttons, features, or page structure change.

## 1. Color tokens (src/styles.css)

Replace current electric-blue palette with the deep-navy + cyan-blue system:

- `--background: #020B18`, `--surface: #041020`, `--surface-2: #061428`
- `--card: rgba(6,20,40,0.80)` (apply via `GlassCard` / `glass` utilities)
- `--foreground: #FFFFFF`, `--muted-foreground: #8BA8C4`
- `--primary: #00B4FF`, `--ring: #00B4FF`
- `--border: rgba(0,180,255,0.12)`, hover `rgba(0,180,255,0.40)`
- Button primary stays `#2563EB` / white text
- Update `--gradient-primary`, `--gradient-nebula`, `--shadow-glow` to cyan-blue equivalents
- Update selection color + scrollbar gradient to blue tones

This propagates automatically to every page/component that uses tokens.

## 2. Global background system

New component `src/components/background/GlobalBackground.tsx` mounted once in `src/routes/__root.tsx` (replaces / wraps `GlobalStarfield`). Fixed, `z-index: 0`, `pointer-events: none`.

Three stacked layers:

1. **Base gradient div** — radial ellipse `#0A1628 → #041020 → #020B18 → #010810`.
2. **Static glow blobs** — 3 absolutely-positioned blurred circles (top-left, center, bottom-right) with the exact rgba/sizes from the spec, `filter: blur(120px)`.
3. **Particle canvas** — 280 cyan particles (`#00B4FF`, size 1–2px, opacity 0.5–0.9, drift 0.1–0.3 px/frame, wrap edges, connect with `rgba(0,180,255,0.06)` when distance < 100px). Uses `requestAnimationFrame`, pauses on `visibilitychange`, disabled under `prefers-reduced-motion`.

All content wrappers get `position: relative; z-index: 10` so background never overlaps text.

## 3. Per-section ambient glows

Add lightweight section-glow utility classes in `styles.css` (`.glow-services`, `.glow-tech`, `.glow-cases`, `.glow-cta`) — each renders a single radial-gradient pseudo-element at the spec position. Sections themselves stay transparent so the global canvas shows through. Apply to existing `ServicesSection`, `WorldSection` (tech), `ProofSection` (cases), `CTASection`. CTA also gets +40 ambient particles via a prop on the canvas component.

## 4. Cards

Update `GlassCard` + `.glass` / `.glass-strong` utilities to:
- bg `rgba(6,20,40,0.80)`, border `rgba(0,180,255,0.12)`, `backdrop-filter: blur(10px)`
- hover: border `rgba(0,180,255,0.45)`, bg `rgba(6,20,40,0.92)`, shadow `0 0 30px rgba(0,120,255,0.10), 0 20px 40px rgba(0,0,0,0.5)`, `translateY(-4px)`, 0.3s cubic-bezier
- Drop `will-change: transform` after transition

## 5. Navigation

Update `Navbar.tsx`:
- Default: `rgba(2,11,24,0.88)` + `backdrop-blur(24px)` + border-bottom `rgba(0,180,255,0.08)`
- Scrolled past 60px: `rgba(2,11,24,0.97)`, border `rgba(0,180,255,0.15)`, shadow `0 4px 30px rgba(0,0,0,0.6)`
- Hover/active link color `#00B4FF`

## 6. Hero 3D right side

Disable the existing journey canvas content on the hero portion (keep `HomeJourneyCanvas` for later sections, just clear hero stage) and rebuild the right-side panel in `HeroOverlay.tsx`:

- Replace static `hero-chain.png` block with a framed canvas container: `border-radius: 16px`, `bg: rgba(2,11,24,0.6)`, border `1px solid rgba(0,180,255,0.15)`, `overflow: hidden`.
- Inside, use the existing `hero-chain.png` (it already contains both the hand and the chain). Split visually with two layered elements via CSS positioning:
  - **Hand**: full image positioned bottom-right, cropped (object-position bottom-right, scale 1.15), static, with `filter: drop-shadow(0 0 30px rgba(0,180,255,0.4))`.
  - **Chain object**: a masked/clipped copy of the same image showing only the upper chain region (CSS `mask-image` linear gradient cutting off below the chain). Wrapped in a single `<div>` that runs three CSS keyframe animations simultaneously on one transform/filter stack:
    - `chain-spin` 8s linear infinite — `rotateY(360deg)`
    - `chain-tilt` 6s ease-in-out infinite alternate — `rotateX(-15deg ↔ 15deg)`
    - `chain-float` 4s ease-in-out infinite alternate — `translateY(-8px ↔ 8px)`
    - `chain-glow` 3s ease-in-out infinite — `drop-shadow` 0.4 → 0.9 → 0.4
  - Combined via a single wrapper with `transform-style: preserve-3d` and nested elements so all three transforms compose without conflicting (outermost: float; middle: tilt; inner: spin; image: glow filter).

`prefers-reduced-motion`: keep only float at 50% speed; remove spin + tilt.

## 7. Scroll entrance animations

Reuse existing `.reveal-on-scroll` utility (already opacity 0 → 1 + translateY 28→0, 0.65s cubic-bezier, stagger via `--reveal-index`). Audit homepage sections + grid items to ensure the class + stagger index are applied; bump duration to 0.6s to match spec. Honors `prefers-reduced-motion` already.

## 8. Performance + a11y

- Particle canvas: `requestAnimationFrame`, pauses when tab hidden, disabled under reduced motion
- Chain: pure CSS transforms (GPU)
- No width/height/padding animations introduced
- All effects skipped under `prefers-reduced-motion` as specified

## Files touched

- `src/styles.css` — palette, gradients, glass/card utilities, section glow utilities, chain keyframes
- `src/routes/__root.tsx` — swap `GlobalStarfield` for new `GlobalBackground`
- `src/components/background/GlobalBackground.tsx` — NEW (gradient + glow blobs + particle canvas)
- `src/components/sections/HeroOverlay.tsx` — new framed 3D canvas panel with animated chain
- `src/components/sections/ServicesSection.tsx`, `WorldSection.tsx`, `ProofSection.tsx`, `CTASection.tsx` — add per-section glow class + transparent backgrounds; CTA passes `extraParticles` prop
- `src/components/ui/GlassCard.tsx` — updated card styling/hover
- `src/components/layout/Navbar.tsx` — nav bg/scroll state colors

## Out of scope (untouched)

All copy, buttons, icons, fonts, routes, forms, navigation structure, page layouts, mega menu items, and every image except the hero right-side panel.
