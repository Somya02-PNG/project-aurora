## Plan: Tighten Homepage Section Spacing

### Goal
Eliminate large dead gaps between homepage sections so the page feels like one continuous, flowing experience instead of separate islands.

### Scope
Only the homepage (`src/routes/index.tsx`) and its five section components. Hero and footer are untouched.

### Changes

#### 1. Wrapper — `src/routes/index.tsx`
The container `<div className="relative">` will become:
```jsx
<div className="relative flex flex-col" style={{ gap: 0 }}>
```
This removes any implicit spacing between children and enforces a continuous vertical stack.

#### 2. WorldSection — `src/components/sections/WorldSection.tsx`
- Remove `min-h-screen` from `<section>`
- Remove `py-24` from `<section>`
- Set inline padding: `style={{ paddingTop: "clamp(48px, 6vw, 80px)", paddingBottom: "clamp(48px, 6vw, 80px)" }}`
- Internal content, cards, and animations remain untouched.

#### 3. ServicesSection — `src/components/sections/ServicesSection.tsx`
- Remove `min-h-screen` from `<section>`
- Remove `py-24` from `<section>`
- Set the same `clamp(...)` inline padding on `<section>`
- Internal layout and animations remain untouched.

#### 4. ProofSection — `src/components/sections/ProofSection.tsx`
- Remove `py-24` from `<section>`
- Set the same `clamp(...)` inline padding on `<section>`
- Internal layout and animations remain untouched.

#### 5. CTASection — `src/components/sections/CTASection.tsx`
- Remove `min-h-screen` from `<section>`
- Remove `py-32` from `<section>`
- Set the same `clamp(...)` inline padding on `<section>`
- Internal layout and animations remain untouched.

### Rationale
- `min-h-screen` on multiple sections forces each to consume at least one full viewport height, creating the "island" feel.
- `py-24` / `py-32` adds 96px–128px of vertical padding, leaving large empty bands.
- Replacing those with `clamp(48px, 6vw, 80px)` keeps consistent internal breathing room while collapsing the dead space between sections.
- The `flex` wrapper with `gap: 0` ensures no extra margin or spacing utility bleeds between components.

### What is NOT changed
- Hero section (`VideoHero`)
- Footer
- Any section's internal layout, colors, typography, animations, or content
- Internal `mb-16`, `mb-20`, `gap-*` inside section content blocks