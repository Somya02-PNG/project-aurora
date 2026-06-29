import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { ParticleField } from "@/components/3d/objects/ParticleField";
import { Planet, Globe } from "@/components/3d/objects/Planet";
import { FloatingGeometry, TechSphere } from "@/components/3d/objects/FloatingGeometry";
import { EnergyRings } from "@/components/3d/objects/EnergyRings";

/**
 * One continuous 3D world. We move the camera and swap the focused object
 * based on scroll progress (0..1) across the homepage.
 */
function ScrollWorld({ progress }: { progress: { value: number } }) {
  const group = useRef<THREE.Group>(null);
  const cameraTarget = useRef(new THREE.Vector3());
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const h = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      });
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  useFrame(({ camera }) => {
    const p = progress.value;
    // five scenes 0..0.2..0.4..0.6..0.8..1
    const camX = Math.sin(p * Math.PI * 2) * 1.2 + mouse.x * 0.4;
    const camY = -p * 2 + mouse.y * 0.3;
    const camZ = 6 + Math.sin(p * Math.PI) * -1.5;
    camera.position.lerp(new THREE.Vector3(camX, camY, camZ), 0.05);
    cameraTarget.current.set(0, -p * 1.6, 0);
    camera.lookAt(cameraTarget.current);

    if (group.current) {
      group.current.rotation.y = p * Math.PI * 1.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.4} color="#3B82F6" />
      <pointLight position={[-6, -4, -2]} intensity={1.1} color="#7C3AED" />
      <pointLight position={[0, 6, -4]} intensity={0.8} color="#06B6D4" />

      {/* full-world particles */}
      <ParticleField count={2400} radius={22} color="#7CA9FF" speed={0.015} size={0.035} />
      <ParticleField count={900} radius={10} color="#A78BFA" speed={0.04} size={0.025} />

      <group ref={group}>
        {/* Scene 1: Hero planet — front */}
        <group position={[0, 0, 0]}>
          <Planet />
        </group>

        {/* Scene 2: Globe — below */}
        <group position={[0, -6, -1]}>
          <Globe />
        </group>

        {/* Scene 3: Floating geometry / services */}
        <group position={[0, -12, 0]}>
          <FloatingGeometry />
          <TechSphere />
        </group>

        {/* Scene 4: Tech network */}
        <group position={[0, -18, -1]}>
          <TechSphere />
        </group>

        {/* Scene 5: Energy rings CTA */}
        <group position={[0, -24, 0]}>
          <EnergyRings />
        </group>
      </group>

      <EffectComposer>
        <Bloom intensity={0.9} luminanceThreshold={0.2} luminanceSmoothing={0.6} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>
    </>
  );
}

export { ScrollWorld };
