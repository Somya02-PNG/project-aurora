import { lazy, Suspense, useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { SceneCanvas } from "@/components/3d/SceneCanvas";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGL } from "@/hooks/useWebGL";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useDevicePerformance } from "@/hooks/useDevicePerformance";

const CosmosScene = lazy(() =>
  import("@/components/3d/scenes/CosmosScene").then((m) => ({ default: m.CosmosScene })),
);

/**
 * Persistent full-viewport cosmic background. Runs in "hero" mode on the
 * homepage and a softer "ambient" mode (dimmed + blurred via CSS) everywhere
 * else, so a single canvas survives client-side navigation.
 */
export function CosmosCanvas() {
  const reduced = useReducedMotion();
  const webgl = useWebGL();
  const quality = useDevicePerformance();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const mode = isHome ? "hero" : "ambient";

  const p = useScrollProgress();
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
            "radial-gradient(ellipse at 50% 30%, rgba(59,130,246,0.32), transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(168,85,247,0.28), transparent 50%), #050B18",
        }}
      />
    );
  }

  return (
    <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none">
      <Suspense fallback={null}>
        <SceneCanvas
          camera={{ position: [0, 0, 6], fov: 60 }}
          dpr={[1, quality === "low" ? 1.2 : 1.5]}
        >
          <CosmosScene mode={mode} quality={quality} progress={progressRef.current} />
        </SceneCanvas>
      </Suspense>

      {/* Ambient mode dim + blur veil so inner-page content stays legible */}
      {!isHome && (
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            backdropFilter: "blur(14px)",
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(5,11,24,0.45), rgba(5,11,24,0.78) 70%)",
          }}
        />
      )}

      {/* Subtle hero nebula overlay (only on home) */}
      {isHome && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 10% 10%, rgba(124,58,237,0.18), transparent 55%), radial-gradient(ellipse at 90% 90%, rgba(6,182,212,0.16), transparent 55%)",
          }}
        />
      )}
    </div>
  );
}
