import { lazy, Suspense, useEffect, useRef } from "react";
import { SceneCanvas } from "@/components/3d/SceneCanvas";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGL } from "@/hooks/useWebGL";
import { useScrollProgress } from "@/hooks/useScrollProgress";

const ScrollWorld = lazy(() =>
  import("@/components/3d/scenes/ScrollWorld").then((m) => ({ default: m.ScrollWorld })),
);

/** Fixed full-viewport canvas behind page content. Drives all 3D from scroll. */
export function HomeCanvas() {
  const reduced = useReducedMotion();
  const webgl = useWebGL();
  const p = useScrollProgress();
  // pass a ref-like obj to avoid re-rendering R3F tree
  const progressRef = useRef({ value: 0 });
  useEffect(() => {
    progressRef.current.value = p;
  }, [p]);

  if (!webgl || reduced) {
    return (
      <div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(59,130,246,0.35), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(124,58,237,0.3), transparent 50%), #050B18",
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Suspense fallback={null}>
        <SceneCanvas camera={{ position: [0, 0, 6], fov: 60 }}>
          <ScrollWorld progress={progressRef.current} />
        </SceneCanvas>
      </Suspense>
      {/* nebula overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 10% 10%, rgba(124,58,237,0.18), transparent 50%), radial-gradient(ellipse at 90% 90%, rgba(6,182,212,0.18), transparent 55%)",
        }}
      />
    </div>
  );
}
