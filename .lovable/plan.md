# Premium Scroll Continuity with GradualBlur

Goal: keep every existing section, color, layout, and animation untouched, and add a single seamless "one environment" feel using the React Bits `GradualBlur` component plus light scroll polish.

## 1. Add the GradualBlur component

Create `src/components/ui/GradualBlur.tsx` (and `GradualBlur.css`) — the standard React Bits implementation (stacked layered divs with progressively stronger `backdrop-filter: blur(...)`, exponential curve, bezier easing, scroll-driven strength). Pure presentation, `pointer-events: none`, `aria-hidden`. No new colors, no new deps.

Default props locked to the spec:
`curve="bezier"`, `exponential`, `animated="scroll"`, `responsive`, `opacity={1}`, `divCount={10}`, `strength={1.5}`, `preset="smooth"`.

Responsive: on `<768px` halve `strength` and reduce `divCount` to 6 for perf. Respect `prefers-reduced-motion` (static low-strength blur, no scroll animation).

## 2. Use it as section-edge transitions, not as overlays

Insert `GradualBlur` as a thin band at the bottom of each homepage section (and top of the next where needed) — about 96–128px tall, absolutely positioned, behind content (`z-index: 1`), above background (which is `z-index: -1`). Because it only blurs what's behind it (the global starfield + adjacent section edges), section content stays crisp.

Touch points on the homepage (`src/routes/index.tsx`):
- After Hero → between Hero and Services
- Between every existing `NebulaDivider` pairing (replace the hard divider feel; keep `NebulaDivider` itself, just soften its edges with GradualBlur underneath)
- Before Footer

Inner route pages: add one GradualBlur band right above the Footer so every page closes the same way. No per-section bands on inner pages (they're simpler layouts already).

## 3. Unify the background surface (no new colors)

Currently sections sometimes paint their own background tints. Audit and neutralize:
- `src/routes/index.tsx`: ensure every `<section>` is `background: transparent`.
- `src/components/sections/*`: remove any leftover solid section backgrounds; keep only the global `GlobalBackground` (already deep-navy radial).
- `HeroOverlay.tsx`: keep the existing soft bottom fade but reduce it to ~40% strength so the GradualBlur band does the heavy lifting.

No edits to typography, copy, cards, buttons, navbar, footer markup, or 3D dome.

## 4. Scroll quality polish (no structural change)

- `src/lib/lenis.ts`: bump `duration` to ~1.25, keep current easing — slightly softer momentum.
- `src/hooks/useReveal.ts` (existing fade+scale reveal): extend duration to 0.9s with `cubic-bezier(0.22, 1, 0.36, 1)`, stagger 60ms. Same animation, just calmer.
- Honor `prefers-reduced-motion` — skip Lenis smoothing and reveal animations.

## 5. Glass / depth (subtle only)

No changes to `GlassCard` styling. The added depth comes entirely from the GradualBlur bands blurring the starfield behind transition zones — no new transparency on content surfaces.

## 6. Mobile

- GradualBlur band height: 64px on mobile, 96px tablet, 128px desktop.
- `divCount` and `strength` scaled down on mobile (see §1).
- `will-change: backdrop-filter` only while in viewport (IntersectionObserver toggle) to keep paint cheap on low-end devices.

## Files touched

New:
- `src/components/ui/GradualBlur.tsx`
- `src/components/ui/GradualBlur.css`

Edited (minimal, presentation-only):
- `src/routes/index.tsx` — insert GradualBlur bands at section seams; ensure transparent section backgrounds.
- `src/routes/about.tsx`, `services.*.tsx`, `case-studies.*.tsx`, `contact.tsx`, `industries.tsx`, `technologies.tsx` — one GradualBlur band above Footer.
- `src/components/sections/HeroOverlay.tsx` — soften existing bottom fade only.
- `src/lib/lenis.ts` — duration tweak.
- `src/hooks/useReveal.ts` — easing/duration tweak.

## Out of scope (explicitly not touched)

Layout, section order, content, typography, navbar, footer, buttons, cards, spacing, branding, the 3D `DomeField`, `GlobalBackground` colors, route logic, data.

## Notes

- The "attached GradualBlur component" wasn't included in the message. I'll implement the canonical React Bits `GradualBlur` per the prop spec you listed. If you have a specific source file, paste it and I'll drop it in verbatim instead.
- Chrome-safe `backdrop-filter` (no hand-written `-webkit-` prefix — Lightning CSS handles it).
