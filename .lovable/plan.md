## Goal
Make sure the hero is fully ready (video buffered, 3D scene compiled) before the preloader dissolves, so the first frame after the crossfade is smooth instead of janky.

## Strategy
Replace the preloader's fixed 2.6s timer with a real readiness signal: wait for the hero video to reach `canplaythrough` AND for the R3F journey canvas to render its first frame, with a 4.5s hard cap so nothing stalls forever. Keep a minimum visible time (~1.4s) so the brand moment still plays.

## Changes

### 1. `src/lib/appReady.ts` (new)
Tiny shared readiness bus:
- `markReady(key: 'video' | 'scene')` — components call this when their asset is usable.
- `onAllReady(keys, cb, timeoutMs)` — resolves when all keys are marked or timeout elapses.
- Idempotent; survives StrictMode double-effects.

### 2. `src/routes/__root.tsx` — preload `<link>` tags
Add to root `head().links`:
- `{ rel: "preload", as: "video", href: heroVideo.url, fetchpriority: "high" }`
- `{ rel: "preload", as: "image", href: logo.url }` (preloader logo)

So the browser starts the video transfer before React even mounts.

### 3. `src/components/sections/HeroOverlay.tsx`
- Add refs/handlers on the `<video>`: on `canplaythrough` (or `loadeddata` fallback) call `markReady('video')`.
- Keep `preload="auto"` and add `poster` if available; no layout/copy changes.

### 4. `src/components/3d/HomeJourneyCanvas.tsx`
- Pass an `onCreated` to `SceneCanvas` that calls `markReady('scene')` after the first `gl.render` (use `requestAnimationFrame` inside `onCreated` to ensure first frame committed).
- When WebGL is unavailable or reduced motion, mark `scene` ready immediately so the gate still resolves.

### 5. `src/components/Preloader.tsx`
- Replace the fixed 2.6s timer with `onAllReady(['video','scene'], start, 4500)`.
- Enforce a minimum on-screen duration of 1.4s (so brand intro doesn't flash) by combining `Promise.all([readyPromise, delay(1400)])`.
- When the gate resolves, run the existing exit (1s blur/fade) and dispatch `dimisi:preloader-done` exactly as today.
- Keep scroll-lock and fallback cleanup.

### 6. Smooth first paint guardrails
- Add `image-rendering: auto` and `transform: translateZ(0)` to the hero `<video>` to force GPU compositing.
- Pre-warm GSAP timeline creation by importing `gsap` at the top of `HeroOverlay` (already there) — no other changes.

## Out of scope
Inner pages, navbar, sections below the hero, palette, copy, and the 3D scene contents stay untouched.

## Result
Preloader stays on screen until: hero video is buffered enough to play through AND the WebGL canvas has painted at least one frame (capped at 4.5s, minimum 1.4s). Then it blur-fades out and the hero crossfades in with no first-frame stutter.
