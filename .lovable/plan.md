## Goal
Make the load → landing handoff feel intentional and smooth instead of a jarring pop.

## Changes (scoped to preloader + hero intro only)

### 1. `src/components/Preloader.tsx`
- Extend the visible phase from 2s → ~2.6s so the progress bar actually completes before fade.
- Lengthen the exit transition from 0.5s → 1.0s with `cubic-bezier(0.65, 0, 0.35, 1)` and add a gentle blur(0 → 12px) + scale(1 → 1.04) on exit so it dissolves rather than cuts.
- Lock body scroll (`overflow:hidden`) while the preloader is mounted, release it on exit.
- Dispatch a `window` event `dimisi:preloader-done` the moment the exit starts, so the hero can begin its reveal in parallel (overlap by ~400ms for a seamless crossfade).
- Keep the silver logo, orbit dots, and progress bar; only timing/easing/blur change.

### 2. `src/routes/__root.tsx`
- Add a thin top-level fade-in wrapper around `<main>` (opacity 0 → 1, 700ms ease) that triggers on the `dimisi:preloader-done` event. Falls back to visible after 3s if the event never fires (safety).
- No structural changes to providers or routes.

### 3. `src/components/sections/HeroOverlay.tsx` (intro timing only)
- Delay the existing GSAP stagger by ~250ms and ease the first reveal from `power3.out` so headline words rise as the preloader is still dissolving — producing a true crossfade instead of back-to-back animations.
- No copy, layout, video, or 3D changes.

### 4. `src/styles.css`
- Add a small utility `.app-fade-in` (opacity/transform/filter transition) used by the root wrapper. No token or palette changes.

## Out of scope
Navbar, 3D journey scene, sections below the hero, video asset, and routing all stay exactly as they are.

## Result
Preloader completes its progress bar, then softly blurs + fades over ~1s while the hero copy and main content fade up underneath — one continuous motion from load to landing.
