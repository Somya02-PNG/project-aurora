## Plan: NebulaDivider component between homepage sections

### New file
`src/components/ui/NebulaDivider.tsx` — Canvas 2D divider, 48px tall, full width, `pointer-events: none`.

- `DIVIDER_CONFIG` constant at top holds: height (48), line gradient stops, glow gradient stops (opacity ÷ 3), star count (12), star radius/opacity ranges, scan duration (900ms, easeOutCubic), fade duration (600ms).
- Refs: `canvasRef`, `containerRef`, `rafRef`, `progressRef`, `starsRef` (generated once per resize so the scan stays stable).
- `drawStatic(progress = 1)`:
  1. Clear with `clearRect`.
  2. Build glow linearGradient (lineWidth 18), stroke center line from x=0 → x=progress*width.
  3. Build main linearGradient (lineWidth 1), stroke same segment.
  4. Draw cached stars whose x ≤ progress*width as filled circles `rgba(220,200,255, opacity)`.
- `init()` sets canvas width to container clientWidth, height = 48, regenerates stars array, then draws.
- IntersectionObserver (threshold 0.3):
  - On enter: kick off rAF scan 0→1 over 900ms with easeOutCubic, simultaneously fade canvas opacity 0→1 over 600ms via inline style on the canvas element (tracked through a second rAF-driven value or same loop).
  - On exit: reset progress to 0, opacity to 0, clear canvas so it re-animates next entry.
- Resize listener: re-init width + redraw at current progress.
- Cleanup: cancel rAF, remove resize listener, disconnect observer.
- Strict TS, no `any`. JSDoc block at top describing purpose and visual intent.

JSX:
```tsx
<div ref={containerRef} aria-hidden className="w-full" style={{ height: 48 }}>
  <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block", pointerEvents: "none", opacity: 0 }} />
</div>
```

### Homepage placement
Edit `src/routes/index.tsx` only. Import `NebulaDivider` and insert one instance between each adjacent pair of existing sections inside the flex-col wrapper:

```
<VideoHero />
<NebulaDivider />
<WorldSection />
<NebulaDivider />
<ServicesSection />
<NebulaDivider />
<ProofSection />
<NebulaDivider />
<CTASection />
```

No divider before the hero, no divider after the last section (footer lives in `__root.tsx` and is untouched). No other files modified — sections, hero, navbar, footer, global styles all stay as-is.

### Verification
- Typecheck.
- Quick Playwright screenshot of `/` scrolling to confirm dividers appear as faint violet glows between sections and don't exceed 48px.
