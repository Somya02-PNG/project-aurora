# Hero Visual Upgrade — Interactive 3D Dome

## Scope (strict)
Only the **visual layer** inside `src/components/sections/HeroOverlay.tsx` changes. Text, eyebrow, headline words, subcopy, "Book Consultation" + "View Our Work" buttons, GSAP reveal timeline, vignette, layout, spacing, typography, colors, navbar, and every other section stay untouched. No CSS variables changed.

## What replaces what
Current hero background stack: `DarkVeil` (z-0) + `DotField` (z-1) + `Orb` (z-2).

New stack:
- Keep `DarkVeil` at z-0 (unchanged) as the ambient backdrop — it already matches the site palette.
- Remove `DotField` and `Orb` from the hero only (files stay in the repo, just not imported here).
- Add a new `DomeField` R3F canvas at z-[2], same centered placement and responsive sizing the `Orb` used (`min(900px,92vw)` desktop, tablet/mobile scale-down via existing `useMediaQuery` logic).
- Vignette layer and text content stay exactly as-is on top.

## New component: `src/components/3d/DomeField.tsx`
Self-contained React Three Fiber canvas. Lazy-loaded with `React.lazy` + Suspense so it doesn't block first paint; falls back to an empty div for `useReducedMotion` and `useWebGL` failures (pattern already used in `HomeCanvas.tsx`).

Structure:
- `<Canvas>` with `dpr={[1, 1.75]}`, `alpha: true`, `antialias: true`, `powerPreference: "high-performance"`.
- Camera: perspective, slight tilt, looking at origin.
- Lighting: low ambient + 2 point lights tinted with site accent (`#3b82f6`) and a cooler rim (`#7C3AED`-ish already used elsewhere). Soft bloom via `@react-three/postprocessing` `EffectComposer` + `Bloom` (already-installed three ecosystem; will add `@react-three/postprocessing` if missing).
- Geometry: a single `InstancedMesh` of ~600–900 rounded modules (rounded-box geometry, ~12 segments) laid out on a **Fibonacci hemisphere** so they form the curved dome from the reference. Each instance stores its base position, normal, and a per-instance phase offset.
- Material: `MeshPhysicalMaterial` (or a lightweight custom `ShaderMaterial` if perf needs it) with emissive tinted from site accent; subtle clearcoat for the premium sheen. Colors are read from CSS variables at mount via `getComputedStyle(document.documentElement)` so the dome auto-adapts to the existing theme — no hard-coded palette.

## Interaction + animation (the core of the request)
A custom `useFrame` loop updates the InstancedMesh matrices every frame:

1. **Ambient motion (always on):**
   - Whole group: slow Y-axis rotation (~0.04 rad/s) + gentle sine "breathing" scale (±1.5%).
   - Per-instance: small outward bob using `sin(time * 0.6 + phase)` for organic float.

2. **Cursor ripple (desktop):**
   - Track pointer via R3F `onPointerMove` on an invisible plane in front of the dome; raycast to get a 3D point on the hemisphere surface.
   - Maintain a CPU-side `Float32Array` of per-instance `displacement` values. Each frame:
     - Compute distance from instance base position to cursor point.
     - Target displacement = `gauss(distance, radius) * strength` along the instance normal, plus a small rotation tilt toward the cursor.
     - Lerp current → target with easing (~0.12) to get inertia.
     - Add a propagating wave term: `sin(distance * k - time * speed) * decay(distance)` so a ripple visibly spreads outward across neighbors.
   - Write updated matrix (position + quaternion) per instance, call `instancedMesh.instanceMatrix.needsUpdate = true`.

3. **Mobile:**
   - Pointer events already cover touch (`onPointerMove` fires for touch in R3F).
   - Add optional `deviceorientation` listener (with permission prompt on iOS) that maps `beta`/`gamma` to a virtual cursor offset, so tilting the phone drives the same ripple. Falls back gracefully if permission denied or sensor missing.

4. **Light sweep:** a single point light slowly orbits the dome to give the "dynamic light moving across the surface" feel.

## Performance
- One `InstancedMesh` = one draw call for all modules.
- Rounded-box geometry kept lightweight (~12-segment bevel).
- Module count auto-scales: ~900 desktop, ~500 tablet, ~280 mobile via the existing `useMediaQuery` hook.
- Bloom kept at low intensity to stay 60 FPS; disabled on mobile.
- Honors `useReducedMotion` (renders a static dome, no ripple, no rotation).
- Honors `useWebGL` (renders nothing, hero still works with just `DarkVeil` + text).

## Files
- **New:** `src/components/3d/DomeField.tsx`
- **Edit:** `src/components/sections/HeroOverlay.tsx` — remove `DotField` and `Orb` imports/JSX; add lazy `DomeField` in the same centered wrapper with the same responsive sizing. No other changes.
- **Maybe install:** `@react-three/postprocessing` (only if not already present) for Bloom. `three` and `@react-three/fiber` are already in the project.

## Out of scope
- No changes to `styles.css`, navbar, other sections, fonts, copy, routes, or any other component.
- `DotField.tsx`, `Orb.tsx`, `DarkVeil.tsx` files remain in the repo untouched.

## Acceptance check
1. Hero text, buttons, eyebrow, GSAP reveal identical to current.
2. Centered dome of rounded modules visible behind/around the text area, sized like the previous Orb.
3. Moving the cursor across the dome produces a visible propagating ripple with inertia; idle state still gently breathes and rotates.
4. Works on mobile via touch; no console errors; build passes; reduced-motion users get a static dome.
