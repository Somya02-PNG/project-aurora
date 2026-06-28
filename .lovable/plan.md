## Goal
Replace **only** the homepage hero section with a new photoreal deep-space scene built fresh in `src/components/hero/SpaceHero.tsx` + `src/components/hero/GalaxyScene.tsx`. Nothing else on the site changes — same Navbar, same `WorldSection` / `ServicesSection` / `ProofSection` / `CTASection`, same routes, same global `CosmosCanvas` background.

## Files

**New**
- `src/components/hero/GalaxyScene.tsx` — R3F scene only (stars, nebula, central body, ring, moons, dust, lights, camera rig). All tunables in a top-of-file `SCENE_CONFIG` const. Strict TS, no `any`. `useMemo` for geometries/materials, cleanup in `useEffect`, `InstancedMesh` for stars.
- `src/components/hero/SpaceHero.tsx` — layout wrapper: full-bleed `<Canvas>` mounting `<GalaxyScene/>` + absolutely-positioned overlay UI (label, H1, subline, two buttons) with GSAP staggered reveal.

**Edited (one line area only)**
- `src/routes/index.tsx` — swap `<HeroSection />` for `<SpaceHero />`. No other section touched.

**Untouched**
- All other routes, the global `CosmosCanvas` in `__root.tsx`, every other component. The existing `HeroSection.tsx` file is left in place (unused) so nothing else breaks.

## Scene spec (locked to the brief)

- Background: solid `#020008` set via `gl.setClearColor`, no CSS gradient behind canvas.
- Stars: `InstancedMesh` of 10,000 tiny spheres on a large sphere shell, size buckets 80/15/5%, ~5% twinkle via per-instance opacity in a custom shader-lite (multiply color in instance color attribute), ~15% drift by slowly rotating a sub-group at 0.0003 rad/frame.
- Nebula: 3 `Sprite`s with radial-gradient canvas textures (violet + blue-teal), opacity 0.03–0.08, far back in Z, rotating 0.00008 rad/frame.
- Central body: sphere r=2.2, `MeshStandardMaterial` `#0a0020`, roughness 0.85, metalness 0.1, emissive `#2d0060` @ 0.08, subtle procedural normal map generated from a canvas noise texture.
- Ring: `TorusGeometry(3.5, 0.018, …)`, tilted -0.4 on X, white-grey `#b0b0c0` @ 0.25, rotating 0.0004 rad/frame on Y.
- Moons: 3 dark rocky spheres at radii 3.2 / 4.5 / 5.8, inclinations vary, speeds 0.0006–0.0012, no emission.
- Dust: 3,000 `Points`, size 0.04, white @ 0.15, distributed in a flat belt, slow outward spiral drift in `useFrame`.
- Lighting: `DirectionalLight` `#ffffff` @ 0.6 at (5,3,5) + `AmbientLight` `#0a0020` @ 0.2. Optional `EffectComposer` + `Bloom` intensity 0.3 / threshold 0.85 / radius 0.4 only.
- Camera: `PerspectiveCamera` fov 55, start (0,0,8). GSAP intro tween to (0,0,12) over 3s `power2.out`. Idle Y-orbit at 0.00015 rad/frame via ref-tracked angle. `ScrollTrigger` tween to (2,1.5,16) + slight tilt + scene group scale 0.7 + opacity 0.6 as the hero scrolls out. Lenis already initialized globally — reuse it.
- Performance: `frameloop="always"` (animations require it), DPR clamped `[1, 1.75]`, auto-fallback to 5,000 stars when `useDevicePerformance()` returns `low`.

## Overlay UI

Absolutely positioned bottom-left container above the canvas, pointer-events scoped to interactive children:

1. Eyebrow `DIMISI Technologies` — 13px, tracking 0.2em, color `#6d28d9`.
2. H1 `From Ideas to\nIntelligent Software` — `clamp(36px, 6vw, 72px)`, weight 700, white, line-height 1.1, per-word span wrapping with GSAP stagger 0.15s.
3. Subline `We build scalable AI-powered digital products for modern businesses` — 16px, `#9ca3af`, max-w 480px.
4. Buttons: primary `#7c3aed` → hover `#6d28d9` w/ translateY + violet shadow; secondary transparent w/ `rgba(255,255,255,0.2)` border → hover brighter. Both real `<Link>`s (Book Consultation → `/contact`, Explore Services → `/services`).

GSAP timeline starts at 0.8s delay; reduced-motion users get an instant fade-in (reuse existing `useReducedMotion`).

## Forbidden (per brief)
No background gradient div, no neon halos around the sphere, no visible orbit paths, no burst on load, no typewriter, no 3D emoji/icons, no audio, no heavy bloom.

## Verification
- `tsgo` clean (strict, no `any`).
- Browser check via Playwright: load `/`, screenshot hero at 1280×1800, confirm dark void + central body + ring + readable headline + both buttons; check console has no R3F warnings.
