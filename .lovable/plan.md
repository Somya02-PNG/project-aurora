### Scope
Create a new `GlobalStarfield` fixed background component and wire it into the root layout. No existing sections, heroes, or components will be touched.

### Files to create
1. **src/components/background/GlobalStarfield.tsx**
   - Plain Canvas 2D, fixed position, `z-index: -1`, `pointer-events: none`
   - 280 stars with random drift, wrap-around edges, subtle twinkle
   - All config in `STARFIELD_CONFIG` const at top
   - Resize handler rescales star positions proportionally
   - Strict cleanup: cancelAnimationFrame + removeEventListener on unmount
   - No state updates in RAF loop, only ref mutation

### Files to modify
2. **src/routes/__root.tsx**
   - Import and render `<GlobalStarfield />` as the very first child inside `<body>` (before `<QueryClientProvider>` / `<ScrollProvider>` / `<CosmosCanvas>` / `<Navbar>` / `<main>`)
   - Add `style={{ backgroundColor: "#05000f" }}` to `<body>` so the deep dark base shows through

### What will NOT change
- `VideoHero`, `WorldSection`, `ServicesSection`, `ProofSection`, `CTASection`, `CosmosCanvas`, `Navbar`, `Footer`, or any other existing component
- No Three.js, WebGL, extra libraries, or package installs needed
