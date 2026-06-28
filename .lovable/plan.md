## Goal
Replace the homepage hero with a **fullscreen, photoreal video-background hero** using the uploaded clip `Make_it_more_realistic_as_show.mp4`. Kill the galaxy/3D scene from the hero. Make the hero blend seamlessly into the next section (no visible cut line). Refresh the DIMISI logo. Ensure all hero text is fully readable (no overlap with side panels or feature cards).

Nothing else on the site changes — same Navbar nav items, same `WorldSection` / `ServicesSection` / `ProofSection` / `CTASection`, same routes, same global background on inner pages.

## What changes

**New / replaced**
- `src/components/hero/VideoHero.tsx` — new hero. Fullscreen `<video>` (autoplay, muted, loop, playsInline, `preload="auto"`, `poster` fallback) covering the full viewport. Over it:
  - Centered, single-column copy block (eyebrow + H1 + subline + 2 buttons). No side "Real-time insights" panel, no bottom 3 feature cards in the hero — those were the source of the overlap/readability complaints. They can live further down the page if desired in a later pass, but they leave the hero.
  - Strong-but-tasteful legibility veil: bottom-weighted linear gradient `rgba(5,0,16,0)` → `rgba(5,0,16,0.85)` plus a soft radial darken behind the text only. No purple wash on top of the video so it stays cinematic and real.
  - Seamless handoff: the hero ends with a **tall gradient fade** (~30vh) from transparent to the site background `#050010`, and the next section (`WorldSection`) sits flush with `mt-0`. No hard horizontal line, no border, no rounded card edge between sections.
- Upload the video via `lovable-assets` from `/mnt/user-uploads/Make_it_more_realistic_as_show.mp4` → `src/assets/hero-real.mp4.asset.json`. Import the pointer in `VideoHero.tsx`. No binary committed to the repo.

**Edited**
- `src/routes/index.tsx` — swap `<SpaceHero />` for `<VideoHero />`. Nothing else in this file changes.
- `src/components/layout/Navbar.tsx` — replace the current "stacked-square" logo with a cleaner mark: a single rounded-square glyph with a sharp **D** monogram in a violet→magenta gradient, sitting next to the wordmark `DIMISI` and tagline `.tech`. Same size footprint, no layout shift. Pure CSS/SVG so we don't need an image asset.

**Untouched**
- `SpaceHero.tsx` and `GalaxyScene.tsx` stay on disk (unused) so nothing else breaks, but they're no longer imported.
- The global `CosmosCanvas` in `__root.tsx` still renders on inner pages — only the home hero stops using it (hero sits above it with an opaque video).
- All other routes, sections, services pages, and styles.

## Visual / interaction spec

- Video: `object-cover`, `w-full h-screen`, slight `scale(1.02)` to hide compression edges, opacity 1 (no `mixBlendMode: screen` — that's what made the previous video look washed out and ghostly). A 1-frame `poster` (first frame) prevents the black flash before autoplay.
- Veil: two stacked layers inside the hero, behind the text, above the video:
  1. `background: linear-gradient(180deg, rgba(5,0,16,0.35) 0%, rgba(5,0,16,0) 30%, rgba(5,0,16,0) 55%, rgba(5,0,16,0.92) 100%)` — keeps the middle of the frame clean and darkens only top (for navbar contrast) and bottom (for text + section blend).
  2. `background: radial-gradient(ellipse 60% 45% at 50% 65%, rgba(5,0,16,0.55), transparent 70%)` — local pool of contrast behind the H1/subline only.
- Copy block: centered horizontally, vertically anchored ~58% down the viewport so it sits inside the radial pool. Max-width 720px. No side panel, no feature cards in this section.
- Buttons: keep existing primary `#7c3aed` / secondary outline styles; centered, gap-4.
- Bottom seam: a separate `<div>` at the bottom of the hero, `h-[28vh] -mb-[28vh]`, gradient `linear-gradient(180deg, transparent 0%, #050010 100%)`, pointer-events none. `WorldSection` follows immediately with `bg-transparent` so the fade resolves into the site background without a visible cut.
- Scroll cue ("Scroll to explore") sits above the bottom fade and dims out as the user scrolls past 10vh.

## Logo

New mark in `Navbar.tsx`:
- 32×32 rounded-[10px] container, gradient border `linear-gradient(135deg,#A855F7,#E879F9)` via padded inner mask.
- Inside: an SVG **D** glyph (custom path, bold geometric, slightly squared) filled with the same gradient on a near-black inner fill `#0B0418`. Soft outer glow `0 0 24px rgba(168,85,247,0.35)`.
- Wordmark unchanged: `DIMISI` bold + `.tech` mono caps tagline beneath.
- Same flex layout so no other Navbar code shifts.

## Readability rules (per user complaint)
- Nothing else floats over the H1/subline. The right-side "Real-time insights" panel and the three "AI Orchestration / Secure Infrastructure / Scalable Ecosystem" cards are removed from the hero.
- Subline color bumped from `#9ca3af` to `#d6d3e8` and weight 400 with `text-shadow: 0 1px 12px rgba(0,0,0,0.6)` so it never blends into a bright frame of the video.
- H1 gets `text-shadow: 0 2px 24px rgba(0,0,0,0.55)` to stay crisp on light video frames.

## Performance
- Video file uploaded once to the CDN, served from `/__l5e/assets-v1/...` (HTTP range, cached). `preload="auto"` only on desktop; on `(max-width: 640px)` use `preload="metadata"` and a static poster to keep mobile data sane.
- Respect `prefers-reduced-motion`: if reduced, render the poster image only and skip `<video>` autoplay.

## Verification
- `tsgo` clean.
- Playwright at 1280×1800: load `/`, screenshot the hero — confirm video frame is visible, H1 fully readable, no side panel, no feature cards in the hero, no horizontal line between hero and the next section. Screenshot the navbar — confirm the new D-monogram logo renders.
