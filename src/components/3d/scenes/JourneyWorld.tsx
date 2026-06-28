import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { ParticleField } from "@/components/3d/objects/ParticleField";
import { HoloDevice } from "@/components/3d/objects/HoloDevice";
import { HumanSilhouettes } from "@/components/3d/objects/HumanSilhouette";
import { ServiceNodes } from "@/components/3d/objects/ServiceNodes";
import { HoloPanels } from "@/components/3d/objects/HoloPanels";
import { DataRibbons } from "@/components/3d/objects/DataRibbons";
import { AmbientRings } from "@/components/3d/objects/AmbientRings";
import { ConvergenceCore } from "@/components/3d/objects/ConvergenceCore";
import { GlassCubes } from "@/components/3d/objects/GlassCubes";
import type { Perf } from "@/hooks/useDevicePerformance";

/** 7-stage scroll-driven cinematic journey. */
type Stage = { center: number; pos: [number, number, number]; look: [number, number, number] };
const STAGES: Stage[] = [
  { center: 0.06, pos: [0, 0, 6], look: [0, 0, 0] },
  { center: 0.21, pos: [0, -0.5, 5.2], look: [0, -0.3, 0] },
  { center: 0.36, pos: [2.2, 0.6, 6.5], look: [0, 0.2, 0] },
  { center: 0.52, pos: [-2.4, 0.4, 6.2], look: [0, 0, 0] },
  { center: 0.67, pos: [0, 1.4, 7.5], look: [0, 0.3, 0] },
  { center: 0.82, pos: [0, -0.2, 5.8], look: [0, 0, 0] },
  { center: 0.96, pos: [0, 0, 4.5], look: [0, 0, 0] },
];

function bell(p: number, c: number, w = 0.12) {
  const x = (p - c) / w;
  return Math.max(0, 1 - x * x);
}

const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const tmpLookA = new THREE.Vector3();
const tmpLookB = new THREE.Vector3();
const lookTarget = new THREE.Vector3();

export function JourneyWorld({
  progress,
  quality,
}: {
  progress: { value: number };
  quality: Perf;
}) {
  const mouse = useRef({ x: 0, y: 0 });
  if (typeof window !== "undefined") {
    window.onmousemove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
  }

  useFrame(({ camera }) => {
    const p = progress.value;
    // pick segment
    const seg = Math.min(STAGES.length - 2, Math.floor(p * (STAGES.length - 1)));
    const localT = p * (STAGES.length - 1) - seg;
    const e = localT < 0.5 ? 2 * localT * localT : 1 - Math.pow(-2 * localT + 2, 2) / 2;
    const a = STAGES[seg];
    const b = STAGES[seg + 1];
    tmpA.set(...a.pos);
    tmpB.set(...b.pos);
    tmpA.lerp(tmpB, e);
    // mouse parallax
    tmpA.x += mouse.current.x * 0.25;
    tmpA.y += mouse.current.y * 0.18;
    camera.position.lerp(tmpA, 0.08);

    tmpLookA.set(...a.look);
    tmpLookB.set(...b.look);
    tmpLookA.lerp(tmpLookB, e);
    lookTarget.lerp(tmpLookA, 0.08);
    camera.lookAt(lookTarget);
  });

  const p = progress; // ref
  // Per-frame visibility wrappers — children read progress via prop closures
  // but we update once per frame via a tiny stage controller using refs:
  return (
    <>
      <color attach="background" args={["#040013"]} />
      <fog attach="fog" args={["#0a0420", 8, 28]} />

      <ambientLight intensity={0.35} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#a855f7" />
      <pointLight position={[-6, -3, -2]} intensity={0.9} color="#22d3ee" />
      <pointLight position={[0, 6, -4]} intensity={0.6} color="#e879f9" />

      {/* Ambient particle universe */}
      <ParticleField
        count={quality === "low" ? 1200 : 2400}
        radius={22}
        color="#c4a5ff"
        speed={0.012}
        size={0.03}
      />
      <ParticleField count={600} radius={9} color="#7dd3fc" speed={0.03} size={0.022} />

      {/* Stage controller: re-renders objects with computed visibility every frame
          via a tiny wrapper component that reads ref each frame. */}
      <StageController progress={p} quality={quality} />

      <EffectComposer>
        <Bloom intensity={0.95} luminanceThreshold={0.2} luminanceSmoothing={0.6} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.9} />
      </EffectComposer>
    </>
  );
}

function StageController({ progress, quality }: { progress: { value: number }; quality: Perf }) {
  // Internal stateless refs that mutate child visibility via re-rendered prop
  // Cheaper: keep a single useFrame here that writes group ref opacities.
  // For simplicity we re-render via React state at ~30Hz throttle would cause
  // jank; instead, pass progress ref directly to each child and have them read.
  return (
    <>
      <StageGroup center={0.06}>
        {(v) => <HoloDevice visibility={v} />}
      </StageGroup>
      <StageGroup center={0.21}>
        {(v) => <HumanSilhouettes visibility={v} count={quality === "low" ? 800 : 1400} />}
      </StageGroup>
      <StageGroup center={0.36}>
        {(v) => (
          <>
            <ServiceNodes visibility={v} />
            <GlassCubes />
          </>
        )}
      </StageGroup>
      <StageGroup center={0.52}>
        {(v) => (
          <group scale={v} visible={v > 0.02}>
            <HoloPanels />
          </group>
        )}
      </StageGroup>
      <StageGroup center={0.67}>
        {(v) => <DataRibbons visibility={v} count={quality === "low" ? 1000 : 1800} />}
      </StageGroup>
      <StageGroup center={0.82}>
        {(v) => <AmbientRings visibility={v} />}
      </StageGroup>
      <StageGroup center={0.96}>
        {(v) => <ConvergenceCore visibility={v} count={quality === "low" ? 800 : 1500} />}
      </StageGroup>
      <ProgressTicker progress={progress} />
    </>
  );
}

// Drives a CustomEvent each frame so StageGroup can update its visibility
function ProgressTicker({ progress }: { progress: { value: number } }) {
  useFrame(() => {
    (window as any).__journeyP = progress.value;
  });
  return null;
}



function StageGroup({
  center,
  children,
}: {
  center: number;
  children: (visibility: number) => React.ReactNode;
}) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = (window as any).__journeyP ?? 0;
      const nv = bell(p, center, 0.14);
      setV((prev) => (Math.abs(prev - nv) > 0.02 ? nv : prev));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [center]);
  return <>{children(v)}</>;
}
