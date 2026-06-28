import { lazy, Suspense } from "react";
import { SceneCanvas } from "@/components/3d/SceneCanvas";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGL } from "@/hooks/useWebGL";
import { useDevicePerformance } from "@/hooks/useDevicePerformance";
import { useJourneyProgress } from "@/hooks/useJourneyProgress";

const JourneyWorld = lazy(() =>
  import("@/components/3d/scenes/JourneyWorld").then((m) => ({ default: m.JourneyWorld })),
);

/** Persistent full-viewport canvas behind the homepage journey. */
export function HomeJourneyCanvas() {
  const reduced = useReducedMotion();
  const webgl = useWebGL();
  const quality = useDevicePerformance();
  const progress = useJourneyProgress();

  if (!webgl || reduced) {
    return (
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(168,85,247,0.35), transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(124,58,237,0.30), transparent 55%), #050010",
        }}
      />
    );
  }

  return (
    <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none">
      <Suspense fallback={null}>
        <SceneCanvas
          camera={{ position: [0, 0, 6], fov: 55 }}
          dpr={[1, quality === "low" ? 1.2 : 1.6]}
        >
          <JourneyWorld progress={progress.current} quality={quality} />
        </SceneCanvas>
      </Suspense>
      {/* subtle vignette + grain for cinematic feel */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(5,0,16,0.55) 100%)",
        }}
      />
      <div className="noise-overlay" style={{ mixBlendMode: "overlay" }} />
    </div>
  );
}
