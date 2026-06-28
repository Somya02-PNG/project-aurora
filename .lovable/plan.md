## DIMISI — Continuous 3D Cinematic Homepage

Rebuild the homepage as one persistent WebGL world that morphs as the user scrolls. The current site already has a `CosmosCanvas` + `ScrollWorld` skeleton, so we extend that instead of starting over. The uploaded video is used **only as visual reference** (mood, palette, camera language) — never embedded.

### Architecture

- One persistent R3F canvas (`HomeJourneyCanvas`) mounted fixed full-viewport behind the homepage only (root keeps the lightweight `GlobalStarfield` for inner pages).
- A single normalized scroll progress value (0 → 1) drives camera position, focus target, fog density, bloom, and per-stage object visibility. Use GSAP ScrollTrigger + a shared `progressRef` (no React re-renders inside the canvas).
- 7 narrative stages mapped to scroll ranges:
  1. **Hero (0–0.14)** — floating holographic device, energy core, particle universe, slow orbit + cursor parallax. On scroll, camera dollies *into* the device screen.
  2. **About (0.14–0.28)** — particles reform into two humanoid silhouettes built from glowing point clouds + flowing data streams.
  3. **Services (0.28–0.45)** — silhouettes dissolve into rotating glass cubes + connected service nodes (reuse `GlassCubes`, add `ServiceNodes`).
  4. **Products (0.45–0.6)** — holographic dashboards / floating UI panels (extend `HoloPanels` with chart geometry).
  5. **Stats (0.6–0.75)** — flowing data ribbons + animated metric particles.
  6. **Testimonials (0.75–0.88)** — calm ambient ring lights, soft bokeh particles.
  7. **Contact (0.88–1)** — all streams converge into one bright energy core with distant city-light bokeh.

Each stage is a `<group>` that fades opacity + scale via `useFrame` based on progress windows; stages cross-fade so there are no hard cuts.

### Camera & post-processing

- `CameraRig` interpolates position/lookAt along a Catmull-Rom curve keyed to progress; cursor adds ±0.3 parallax via lerp.
- `EffectComposer` (already installed): Bloom, DOF (`DepthOfField`), Vignette, subtle ChromaticAberration. Fog color shifts from deep blue → violet → cyan across stages.
- Lighting rig: 1 key violet point light, 1 cyan rim, 1 soft ambient. Intensities animate with progress.

### New / modified files

```text
src/components/3d/HomeJourneyCanvas.tsx          new — fixed canvas, mounts on "/"
src/components/3d/scenes/JourneyWorld.tsx        new — stage orchestration + camera rig
src/components/3d/objects/HumanSilhouette.tsx    new — particle humanoid (about)
src/components/3d/objects/ServiceNodes.tsx       new — node-link network
src/components/3d/objects/DataRibbons.tsx        new — flowing stat streams
src/components/3d/objects/AmbientRings.tsx       new — testimonial calm rings
src/components/3d/objects/ConvergenceCore.tsx    new — contact finale
src/components/3d/objects/HoloDevice.tsx         new — hero floating laptop/slab
src/hooks/useJourneyProgress.ts                  new — GSAP ScrollTrigger → ref
src/routes/index.tsx                             edit — swap VideoHero for new <HeroOverlay/>, add About/Stats/Testimonials sections, mount HomeJourneyCanvas, remove NebulaDividers (continuous flow)
src/components/sections/AboutSection.tsx         new
src/components/sections/StatsSection.tsx         new
src/components/sections/TestimonialsSection.tsx  new
src/components/sections/HeroOverlay.tsx          new — transparent text/CTA layer over 3D
src/routes/__root.tsx                            edit — hide CosmosCanvas on "/" (keep for inner pages); GlobalStarfield stays
src/styles.css                                   edit — section content uses translucent dark surfaces so 3D shows through but text stays readable (WCAG AA)
```

Existing inner pages, navbar, footer, mega-menu, preloader, service routes — **untouched**.

### Readability rules

- All section text wrapped in cards with `background: rgba(8,4,20,0.55); backdrop-filter: blur(18px)` and 1px violet border.
- Body copy min contrast 7:1 on the darkest 3D moments.
- `prefers-reduced-motion`: kill camera animation, freeze scene at hero pose, hide particles; `useWebGL` fallback keeps the current radial-gradient bg.

### Performance

- `InstancedMesh` for all particle stages (target ≤ 8k instances total).
- DPR clamp `[1, 1.6]`, `powerPreference: high-performance`.
- Stages outside their progress window skip `useFrame` work (early return).
- Lazy-load `HomeJourneyCanvas` with `lazy()` + `Suspense`; preloader stays until first frame ready.
- Mobile: detect via `useDevicePerformance`, drop particle counts 50%, disable DOF + chromatic aberration.

### What you'll see

Scrolling the homepage feels like flying through one continuous violet/cyan universe — device → humans → service network → dashboards → data rivers → calm ring sanctuary → convergence core — with content cards floating cleanly on top. No section cuts, no embedded video, 60fps target.
