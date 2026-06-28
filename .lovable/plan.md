## Goal
Swap the hero background video to the newly uploaded `The_video_you_are_creating_it.mp4` and replace the existing bottom-right watermark cover in `VideoHero.tsx` with a seamless frosted-blur corner fade. Nothing else changes.

## Steps

1. **Upload the new video as a CDN asset**
   - Run: `lovable-assets create --file /mnt/user-uploads/The_video_you_are_creating_it.mp4 --filename hero-real.mp4 > src/assets/hero-real.mp4.asset.json` (overwrites the existing pointer JSON so every importer picks up the new clip automatically — no code change needed elsewhere).
   - No binary committed to the repo.

2. **Replace the watermark cover in `src/components/hero/VideoHero.tsx`**
   - Locate the current bottom-right solid cover div (the opaque patch that hides the source watermark).
   - Replace it with a frosted-glass corner fade:
     ```tsx
     {/* Seamless watermark cover — frosted fade into corner */}
     <div
       aria-hidden
       style={{
         position: "absolute",
         right: 0,
         bottom: 0,
         width: 200,
         height: 80,
         pointerEvents: "none",
         zIndex: 5,
         backdropFilter: "blur(14px)",
         background:
           "linear-gradient(135deg, rgba(5,0,16,0) 0%, rgba(5,0,16,0.55) 55%, rgba(5,0,16,0.92) 100%)",
         maskImage:
           "radial-gradient(ellipse 100% 100% at 100% 100%, #000 35%, transparent 75%)",
         WebkitMaskImage:
           "radial-gradient(ellipse 100% 100% at 100% 100%, #000 35%, transparent 75%)",
       }}
     />
     ```
   - If the watermark still peeks through after first render, bump `width` to `240` and `height` to `96` per the spec.

3. **Leave everything else untouched**
   - No changes to copy, veils, buttons, scroll cue, bottom section fade, navbar, or any other route/component.

## Verification
- `tsgo` clean.
- Playwright at 1280×1800: load `/`, screenshot the hero. Confirm the new video plays, the bottom-right corner darkens smoothly with no visible rectangle edge, and the source watermark is no longer readable.
