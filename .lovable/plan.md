# Hero Section Typography Enhancement

Scope: `src/components/sections/HeroOverlay.tsx` only. No structural, layout, animation, or functionality changes. Same copy, same CTAs, same dome, same background.

## 1. "DIMISI TECHNOLOGIES" → Premium Badge

Replace the bare text label with a glassmorphism pill:

- Inline-flex pill with `padding: 8px 16px`, `border-radius: 999px`.
- Background: `rgba(59,130,246,0.06)` with `backdrop-filter: blur(12px)`.
- Border: `1px solid rgba(59,130,246,0.28)`.
- Subtle outer glow: `box-shadow: 0 0 24px rgba(59,130,246,0.18), inset 0 0 0 1px rgba(255,255,255,0.04)`.
- Small pulsing dot (6px) on the left in `#3B82F6` with a soft glow.
- Label: `font-size: 11px`, `letter-spacing: 0.32em`, `font-weight: 600`, color `#93C5FD` (lighter blue for contrast against the dark bg).
- Margin-bottom increased to `28px` to breathe.

## 2. Headline "From Ideas to Intelligent Software"

Promote to the strongest visual element:

- Font stack: keep current sans, but bump weight to **800** and tighten tracking to `-0.035em`.
- Responsive scale via `clamp(44px, 7.2vw, 88px)` (up from 40–72).
- Line-height `1.02`.
- Two-line balanced break: `text-wrap: balance` plus an explicit `<br />` after "to" so it reads:
  - Line 1: *From Ideas to*
  - Line 2: *Intelligent Software*
- Emphasis on key words **Intelligent Software** with a subtle gradient:
  - `background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 50%, #A78BFA 100%)`
  - `-webkit-background-clip: text; color: transparent`.
- Remaining words stay solid `#FFFFFF` with a faint text-shadow `0 1px 24px rgba(59,130,246,0.18)` for depth.
- Margin-bottom `28px`.

## 3. Subtitle

- Font-size `clamp(15px, 1.25vw, 18px)`.
- Color `#A8C0DC` (slightly brighter than current `#8aa8c8` for AA contrast).
- `line-height: 1.7`, `letter-spacing: 0.01em`.
- `max-width: 560px`, `margin: 0 auto 40px`, `text-wrap: pretty` to avoid orphans.
- Keep copy unchanged.

## 4. CTA Spacing

- Gap between buttons: `gap: 14px` (unchanged size, just tighter rhythm).
- Top margin from subtitle: `40px` (handled by subtitle's margin-bottom).
- No style/label/route changes to the buttons.

## 5. Responsive Alignment

- Container `max-w-3xl` (down from `4xl`) to keep an ideal measure on desktop.
- Mobile (`<640px`): badge font `10px`, headline `clamp(36px, 11vw, 52px)` via the existing clamp lower bound, subtitle `15px`, `px-5`.
- Tablet: clamp values handle it; verify no awkward break between "Intelligent" and "Software" — the explicit `<br />` only applies ≥640px; on mobile let it wrap naturally with `text-wrap: balance`.
- Everything stays center-aligned within the existing flex column. No layout repositioning.

## Technical Notes

- Single file edit: `src/components/sections/HeroOverlay.tsx`.
- Use a small scoped `<style>` block (already present) for the gradient text + badge pulse keyframe — no new CSS files, no new dependencies.
- Keep `opacity: 1` inline overrides intact (previous GSAP fix).
- No changes to `DomeField`, `GlobalBackground`, routes, or other sections.

## Out of Scope

- No font-family swap (would need a new web font load; current stack stays).
- No changes to dome, background, buttons' colors/links, or any other section.
