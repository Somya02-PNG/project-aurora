import { lazy, Suspense, useEffect } from "react";
import { SceneCanvas } from "@/components/3d/SceneCanvas";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGL } from "@/hooks/useWebGL";
import { useDevicePerformance } from "@/hooks/useDevicePerformance";
import { useJourneyProgress } from "@/hooks/useJourneyProgress";
import { markReady } from "@/lib/appReady";

const HeroPolygonScene = lazy(() =>
  import("@/components/3d/scenes/HeroPolygonScene").then((m) => ({ default: m.HeroPolygonScene })),
);

/** Persistent full-viewport canvas behind the homepage hero. */
export function HomeJourneyCanvas() {
  const reduced = useReducedMotion();
  const webgl = useWebGL();
  const quality = useDevicePerformance();
  const progress = useJourneyProgress();

  // No-WebGL / reduced motion: mark scene ready immediately so the gate resolves.
  useEffect(() => {
    if (!webgl || reduced) markReady("scene");
  }, [webgl, reduced]);

  if (!webgl || reduced) {
    return (
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(0,212,255,0.25), transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(0,136,255,0.20), transparent 55%), #020810",
        }}
      />
    );
  }

  return (
    <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none">
      <Suspense fallback={null}>
        <SceneCanvas
          camera={{ position: [0, 0, 5], fov: 55 }}
          dpr={[1, quality === "low" ? 1.2 : 1.6]}
          onCreated={({ gl, scene, camera }) => {
            // Wait one frame so the first paint has actually been committed.
            requestAnimationFrame(() => {
              try {
                gl.render(scene, camera);
              } catch {}
              markReady("scene");
            });
          }}
        >
          <HeroPolygonScene progress={progress.current} quality={quality} />
        </SceneCanvas>
      </Suspense>
      {/* subtle vignette + grain for cinematic feel */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(2,8,16,0.55) 100%)",
        }}
      />
      <div className="noise-overlay" style={{ mixBlendMode: "overlay" }} />
    </div>
  );
}
