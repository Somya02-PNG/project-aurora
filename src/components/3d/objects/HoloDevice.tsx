import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Floating holographic slab device — hero stage focal point. */
export function HoloDevice({ visibility = 1 }: { visibility?: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!group.current) return;
    const t = s.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.3) * 0.35;
    group.current.rotation.x = -0.25 + Math.sin(t * 0.4) * 0.05;
    group.current.position.y = Math.sin(t * 0.6) * 0.12;
    group.current.scale.setScalar(visibility);
  });
  if (visibility <= 0.01) return null;
  return (
    <group ref={group}>
      {/* Screen */}
      <mesh>
        <boxGeometry args={[3.2, 2.0, 0.06]} />
        <meshPhysicalMaterial
          color="#1a0b2e"
          emissive="#7c3aed"
          emissiveIntensity={0.6}
          transmission={0.7}
          thickness={0.4}
          roughness={0.08}
          metalness={0.2}
          clearcoat={1}
          transparent
          opacity={0.85 * visibility}
        />
      </mesh>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[3.35, 2.15, 0.04]} />
        <meshStandardMaterial color="#0a0418" metalness={1} roughness={0.25} />
      </mesh>
      {/* Glowing rim */}
      <mesh position={[0, 0, 0.04]}>
        <ringGeometry args={[1.55, 1.62, 64]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.55 * visibility} />
      </mesh>
      {/* Floating energy core in front of screen */}
      <mesh position={[0, 0, 0.6]}>
        <icosahedronGeometry args={[0.35, 1]} />
        <meshBasicMaterial color="#c084fc" wireframe transparent opacity={0.65 * visibility} />
      </mesh>
      <pointLight position={[0, 0, 1]} intensity={2 * visibility} color="#a855f7" distance={6} />
    </group>
  );
}
