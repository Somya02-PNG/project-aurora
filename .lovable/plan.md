# Background Visual Redesign + Logo Swap

Scope is strictly visual/background. No buttons, text, icons, nav structure, layout, routes, or features change.

## 1. Hero — Particle Globe WebGL Canvas
New file `src/components/hero/ParticleGlobe.tsx` mounted inside `VideoHero` as an absolute, `pointer-events:none`, `z-index:-1` canvas covering the viewport. Replaces the current video as the primary hero background (video element removed from `VideoHero` only; component, overlay text, buttons unchanged).

- 400 particles, sizes 1–3px, colors sampled from `#4A6CF7 / #7B5EA7 / #C0C0FF`.
- Arranged on a sphere (fibonacci distribution) projected to 2D with depth → back particles dimmer + smaller.
- Sine-wave opacity pulse (0.4→1.0), perlin-ish drift ±2px/frame.
- Y-axis rotation 0.002 rad/frame.
- Webbing: connect to 3 nearest neighbors when screen distance < 120px, stroke `rgba(100,120,255,0.15)`.
- Grid-network underlay layer (revealed phase 2): faint nodes + paths drawn beneath globe.

### Camera choreography (8s, runs once on mount)
- 0–3s: scale 0.6→1.4, easing cubic-bezier(0.16,1,0.3,1).
- 3–5.5s: translateY 0→80px; grid nodes light up top→bottom with 12px glow `#4A6CF7`.
- 5.5–8s: scale 1.4→1.0 ease-in-out.
- After: ambient rotation continues; mouse parallax ±25px X / ±15px Y with 0.06 lerp; scroll parallax drift up at 0.3× scroll.

### Scroll-out
Canvas opacity 1→0 across first 200px of scroll past hero.

## 2. Section Backgrounds (CSS only, in `src/styles.css` via section className hooks)
Apply via existing section root elements — no markup changes other than a class name:
- Services: radial `rgba(74,108,247,0.04)` @ 20% 50% on `#0A0A0B`.
- Technologies/World: radial `rgba(123,94,167,0.05)` @ 80% 30%.
- Case Studies / Proof: radial `rgba(74,108,247,0.03)` @ 50% 80% on `#060608`.
- CTA: radial `#0F0F2A → #0A0A0B → #060608` + 60 ambient drifting particles (lightweight canvas in `CTASection`, no formation).
- Footer: `#060608`, top border `rgba(100,120,255,0.08)`.

## 3. Cards & Surfaces
Update `GlassCard` (and matching shared card styles) base + hover tokens:
- bg `#0E0E14`, border `rgba(100,120,255,0.12)`.
- Hover: border `rgba(100,120,255,0.40)`, shadow stack as specified, `translateY(-4px)`, 0.3s cubic-bezier(0.16,1,0.3,1).
- `::before` top-right L-corner accent 40px → 64px on hover.

## 4. Sticky Header
Update `Navbar` background tokens only:
- Default: `rgba(6,6,8,0.80)` + `blur(24px) saturate(1.3)`, border `rgba(100,120,255,0.06)`.
- Scrolled past 80px (add scroll listener): `rgba(6,6,8,0.96)`, border `rgba(100,120,255,0.12)`, shadow `0 4px 40px rgba(0,0,0,0.7)`.

## 5. Logo Swap (Navbar + MobileDrawer + Preloader)
Upload `Dimisi_logo_trans_1.png` via `lovable-assets` → `src/assets/dimisi-logo.png.asset.json`. Replace the current inline SVG D-monogram in `Navbar` and `MobileDrawer` with `<img>` of the uploaded silver logo (height ~36px in navbar). Wordmark text removed (logo already includes "DIMISI").

## 6. Scroll Entrance Animations
Reusable `.reveal-on-scroll` utility in `styles.css` + a tiny `useReveal` hook using IntersectionObserver. Apply to section roots and card grids (75ms stagger via `--reveal-index` CSS var). Initial `opacity:0; translateY(28px)` → final, 0.65s cubic-bezier(0.16,1,0.3,1).

## 7. Preloader
New `src/components/Preloader.tsx` mounted in `__root.tsx`:
- Full-screen `#060608` overlay, DIMISI logo 72px center.
- 3 orbiting 4px dots `#4A6CF7`, radius 32px, 1.4s linear infinite, 0.47s stagger.
- 160×1px gradient progress bar (1.8s fill).
- "INITIALIZING" label, mono 11px, `#4A4A6A`, 0.18em tracking.
- Exits at 2s: opacity→0, scale(1.02), 0.5s ease, then unmount.

## 8. Accessibility / Perf
- `requestAnimationFrame` only; transform/opacity only.
- `will-change:transform` on hover-animated cards, removed via `transitionend`.
- `prefers-reduced-motion`: kill canvas anims (render single static frame or solid `#060608`), disable scroll reveals, keep only border-color hover.

## Files touched
- New: `src/components/hero/ParticleGlobe.tsx`, `src/components/Preloader.tsx`, `src/hooks/useReveal.ts`, `src/assets/dimisi-logo.png.asset.json`.
- Edited: `src/components/hero/VideoHero.tsx` (swap video→ParticleGlobe, keep overlay), `src/components/layout/Navbar.tsx` (logo + scrolled state), `src/components/layout/MobileDrawer.tsx` (logo), `src/components/ui/GlassCard.tsx`, `src/components/sections/*.tsx` (add bg class + reveal class only), `src/components/sections/CTASection.tsx` (ambient particles), `src/routes/__root.tsx` (mount Preloader), `src/styles.css` (tokens, section bg utilities, reveal, card corner accent, reduced-motion).

## Explicitly NOT changed
Buttons, text, icons, fonts, nav links, page order, sections, forms, routing, images in content, feature behavior.
