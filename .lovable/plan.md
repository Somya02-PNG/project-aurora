## Vertical-center the hero content block

Goal: move the headline, sub-paragraph, and CTA buttons to the vertical center of the hero viewport while keeping all existing text, styling, and links intact.

### Scope
- File: `src/components/sections/HeroOverlay.tsx`
- No content or link changes — only layout.

### Steps
1. Remove the top padding (`pt-28`) from the inner content wrapper.
2. Change `justify-start` to `justify-center` so the flex column centers itself within the `min-h-[100vh]` section.
3. Verify the bottom blend gradient and dome positioning remain untouched.
4. Quick build check to confirm no JSX/tag issues.

### Outcome
Both buttons (Book Consultation → /contact, View Our Work → /case-studies) will sit at the visual center of the hero section along with the headline and subtext.