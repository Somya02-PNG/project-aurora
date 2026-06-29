import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { PolyHand } from "@/components/3d/objects/PolyHand";
import { ChainConnector } from "@/components/3d/objects/ChainConnector";
import { ParticleField } from "@/components/3d/objects/ParticleField";
import { EnergyWaves } from "@/components/3d/objects/EnergyWaves";
import { VolumetricHaze } from "@/components/3d/objects/VolumetricHaze";

interface Props {
  quality: "low" | "mid" | "high";
  progress: { value: number };
}

/**
 * Hero scene featuring the iconic low-poly wireframe hand with rotating chain connector.
 * Electric blue particles and energy waves create a premium tech aesthetic.
 */
export function HeroPolygonScene({ quality, progress }: Props) {
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

  const particleCount = quality === "low" ? 2000 : quality === "mid" ? 4000 : 6500;
  const accentCount = quality === "low" ? 800 : 1600;
  const useAberration = quality === "high";

  useFrame(({ camera }, dt) => {
    if (root.current) {
      root.current.rotation.y += dt * 0.02;
    }
    // Smooth camera movement based on mouse
    const p = progress.value;
    const dolly = 5 + Math.sin(p * Math.PI) * -0.8;
    const targetX = mouse.x * 0.4;
    const targetY = mouse.y * 0.3 - p * 0.5;
    camera.position.lerp(new THREE.Vector3(targetX, targetY, dolly), 0.04);
    camera.lookAt(0, 0.5, 0);
  });

  return (
    <>
      <VolumetricHaze />
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3, 3]} intensity={1.5} color="#00D4FF" />
      <pointLight position={[-4, -2, -2]} intensity={1.2} color="#0050A0" />
      <pointLight position={[0, 4, -3]} intensity={0.9} color="#0088FF" />

      <group ref={root}>
        {/* Main hero elements */}
        <PolyHand />
        <ChainConnector />

        {/* Electric blue particle cloud */}
        <ParticleField
          count={particleCount}
          radius={12}
          color="#00D4FF"
          speed={0.02}
          size={0.035}
        />
        {/* Silver accent particles */}
        <ParticleField
          count={accentCount}
          radius={8}
          color="#8AC4FF"
          speed={0.03}
          size={0.025}
        />
        {/* Deep blue inner glow */}
        <ParticleField
          count={quality === "low" ? 400 : 800}
          radius={5}
          color="#003366"
          speed={0.015}
          size={0.05}
        />

        {/* Energy waves at base */}
        <EnergyWaves />
      </group>

      <EffectComposer multisampling={0}>
        {useAberration ? (
          <>
            <Bloom intensity={0.85} luminanceThreshold={0.5} luminanceSmoothing={0.65} mipmapBlur />
            <ChromaticAberration
              offset={new THREE.Vector2(0.0006, 0.001)}
              blendFunction={BlendFunction.NORMAL}
              radialModulation={false}
              modulationOffset={0}
            />
            <Vignette eskil={false} offset={0.2} darkness={0.8} />
          </>
        ) : (
          <>
            <Bloom intensity={0.85} luminanceThreshold={0.5} luminanceSmoothing={0.65} mipmapBlur />
            <Vignette eskil={false} offset={0.2} darkness={0.8} />
          </>
        )}
      </EffectComposer>
    </>
  );
}
