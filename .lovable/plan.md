# Visual Cohesion Pass — Background, Hero Color, Motion Polish

Scope is strictly visual styling. No layout, content, typography, structure, navigation, or functionality changes.

## 1. Unified, Seamless Background

Today the page has two stacked fixed layers (`GlobalBackground` + `GlobalStarfield`) plus per-section tints inside `HeroOverlay` (top vignette, 30vh bottom-to-`#020408` fade). That bottom fade is what creates the visible "seam" between the hero and the next section.

Changes (visual only):
- Keep a single fixed background system behind everything (`GlobalBackground` + `GlobalStarfield` stay where they are, z-index unchanged).
- Retune `GlobalBackground` to a continuous deep-navy field tuned to the site's existing blue palette:
  - Base: large soft radial from `#071326` → `#040a18` → `#020610` covering the full viewport, no hard stops.
  - Two very soft, low-opacity blue glows (top-left + bottom-right) using the existing accent blue family (`#0d2644` / cyan-blue tint already used on the site) at ~10–14% opacity, heavy blur (~180px) so they read as ambient depth, not blobs.
  - Grain overlay kept at 3–4%.
- Remove the hard `→ #020408` bottom fade inside `HeroOverlay` and the opaque top vignette. Replace with a much softer, low-opacity navy gradient (top + bottom) that only protects text legibility and does NOT terminate in a solid color — so the global background shows through continuously between hero and the next section.
- Audit every homepage section (`HeroOverlay`, `AboutSection`, `ServicesSection`, `StatsSection`, `ProofSection`, `TestimonialsSection`, `CTASection`, `WorldSection`, `NebulaDivider`) and remove/neutralize any opaque `background-color` on the section wrapper so the unified background is visible end-to-end. Card surfaces (`GlassCard`) keep their existing translucent styling untouched.

Result: one continuous canvas from top of hero through footer, no visible section seams, no patchwork.

## 2. Hero Object — Purple → Premium Blue

File: `src/components/3d/DomeField.tsx`. Shape, size, position, instance count, ripple behavior, camera, and post-processing structure are unchanged.

Color-only edits:
- Replace the three color constants:
  - `PURPLE` (`#8B5CF6`) → primary blue `#3B82F6`
  - `PURPLE_DEEP` (`#5B21B6`) → deep blue `#1E3A8A`
  - `MAGENTA` (`#A855F7`) → cyan-blue accent `#22D3EE`
- `MeshPhysicalMaterial.sheenColor` → primary blue.
- Inner emissive sphere `meshBasicMaterial.color` → primary blue (opacity unchanged).
- Three point lights keep their positions/intensities/decays; only their `color` props swap to the new blue trio.
- Ambient light tint → very dark navy (`#0a1428`) instead of purple-tinged.

`HeroOverlay.tsx` color tokens that reference purple are swapped to the same blue family:
- Eyebrow text color → `#3B82F6`.
- Primary CTA `background` + `boxShadow` → blue.
- Secondary CTA border/background tints → blue with matching alpha.
- Hover styles in the `<style>` block updated to blue shadows.

No geometry, no positions, no sizes, no animations touched.

## 3. Animation Polish

Goal: smoother, more organic motion without changing what moves or where.

- `DomeField` ripple loop: replace the hard `Math.min(1, dt * 7)` easing with a frame-rate-independent critically-damped lerp (lower stiffness → softer settle), and reduce auto-rotate speed slightly (`0.05 → 0.035`) for a more cinematic drift. Bob amplitude unchanged.
- Bloom: keep `intensity 1.4` but raise `luminanceSmoothing` slightly for softer highlights; no new passes.
- `GlobalStarfield` twinkle: keep parameters but clamp opacity changes with a smoother sine so faint stars don't pop.
- CTA buttons + `GlassCard` hover: extend transition from `0.2s ease` to `0.35s cubic-bezier(0.22, 1, 0.36, 1)` for a more premium feel. No new transforms.
- Respect `useReducedMotion` everywhere it's already wired — no new motion added for users who opted out.

## 4. Responsive Consistency

- Background layers are already `position: fixed` full-viewport — verified to cover desktop, tablet, mobile.
- Hero soft top/bottom gradients use `vh` units so they scale with viewport without producing a hard line on short mobile screens.
- `DomeField` instance counts per breakpoint (`320 / 560 / 900`) and DPR caps stay as-is to preserve current mobile performance.
- No layout/spacing edits, so existing responsive behavior is preserved by construction.

## Files Touched (visual only)

- `src/components/background/GlobalBackground.tsx` — recolor base + glows to navy/blue, no structure change.
- `src/components/sections/HeroOverlay.tsx` — swap purple tokens to blue, soften top/bottom gradients so they don't end in opaque color, smoother button transitions.
- `src/components/3d/DomeField.tsx` — swap three color constants + light colors, smoother ripple easing, slower auto-rotate.
- Homepage section components listed above — remove any opaque section background so the unified canvas shows through. No layout/content edits.
- `src/components/background/GlobalStarfield.tsx` — minor twinkle smoothing only.

## Out of Scope (explicitly unchanged)

Layout, copy, typography, spacing, nav, mega menu, buttons' position/size/labels, cards, routes, 3D geometry/positions, scroll behavior, preloader, data, functionality.
