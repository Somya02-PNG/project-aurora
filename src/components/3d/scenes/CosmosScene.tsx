import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { ParticleField } from "@/components/3d/objects/ParticleField";
import { GravityWell } from "@/components/3d/objects/GravityWell";
import { LightStreaks } from "@/components/3d/objects/LightStreaks";
import { VolumetricHaze } from "@/components/3d/objects/VolumetricHaze";
import { GlassCubes } from "@/components/3d/objects/GlassCubes";
import { QuantumCore } from "@/components/3d/objects/QuantumCore";
import { DnaHelix } from "@/components/3d/objects/DnaHelix";
import { HoloPortals } from "@/components/3d/objects/HoloPortals";
import { NeuralNetwork } from "@/components/3d/objects/NeuralNetwork";
import { EnergyWaves } from "@/components/3d/objects/EnergyWaves";
import { HoloPanels } from "@/components/3d/objects/HoloPanels";

export type CosmosMode = "hero" | "ambient";

interface Props {
  mode: CosmosMode;
  quality: "low" | "mid" | "high";
  progress: { value: number };
}

/**
 * Single ambient deep-space scene. Runs in two intensities so it can sit
 * behind the homepage hero or quietly behind inner-page content.
 */
export function CosmosScene({ mode, quality, progress }: Props) {
  const root = useRef<THREE.Group>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const speed = mode === "hero" ? 1 : 0.3;
  const showStreaks = quality !== "low" && mode === "hero";
  const useAberration = quality === "high" && mode === "hero";
  const particleCount = quality === "low" ? 1400 : quality === "mid" ? 3000 : 5200;
  const accentCount = quality === "low" ? 600 : 1200;

  useFrame(({ camera }, dt) => {
    if (root.current) {
      root.current.rotation.y += dt * 0.04 * speed;
      root.current.rotation.x += dt * 0.012 * speed;
    }
    // gentle dolly + parallax
    const p = progress.value;
    const dolly = mode === "hero" ? 6 + Math.sin(p * Math.PI) * -1.2 : 9;
    const targetX = mouse.x * (mode === "hero" ? 0.6 : 0.25);
    const targetY = mouse.y * (mode === "hero" ? 0.4 : 0.18) - p * (mode === "hero" ? 0.8 : 0);
    camera.position.lerp(new THREE.Vector3(targetX, targetY, dolly), 0.05);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <VolumetricHaze />
      <ambientLight intensity={0.4} />
      <pointLight position={[6, 4, 4]} intensity={1.3} color="#A855F7" />
      <pointLight position={[-6, -3, -2]} intensity={1.1} color="#6D28D9" />
      <pointLight position={[0, 5, -5]} intensity={0.8} color="#E879F9" />

      <group ref={root}>
        <GravityWell />
        <ParticleField
          count={particleCount}
          radius={mode === "hero" ? 18 : 22}
          color="#C4B5FD"

          speed={0.015 * speed}
          size={0.04}
        />
        <ParticleField
          count={accentCount}
          radius={9}
          color="#C4B5FD"
          speed={0.05 * speed}
          size={0.028}
        />
        {showStreaks && <LightStreaks count={28} />}
        {mode === "hero" && quality !== "low" && <GlassCubes />}
      </group>

      {mode === "hero" && (
        <EffectComposer multisampling={0}>
          {useAberration ? (
            <>
              <Bloom intensity={0.75} luminanceThreshold={0.55} luminanceSmoothing={0.7} mipmapBlur />
              <ChromaticAberration
                offset={new THREE.Vector2(0.0008, 0.0012)}
                blendFunction={BlendFunction.NORMAL}
                radialModulation={false}
                modulationOffset={0}
              />
              <Vignette eskil={false} offset={0.25} darkness={0.85} />
            </>
          ) : (
            <>
              <Bloom intensity={0.75} luminanceThreshold={0.55} luminanceSmoothing={0.7} mipmapBlur />
              <Vignette eskil={false} offset={0.25} darkness={0.85} />
            </>
          )}
        </EffectComposer>
      )}
    </>
  );
}
