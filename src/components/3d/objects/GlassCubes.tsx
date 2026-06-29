import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * Two large translucent glass cubes that flank the gravity well — directly
 * inspired by the reference hero composition.
 */
export function GlassCubes() {
  const left = useRef<THREE.Mesh>(null);
  const right = useRef<THREE.Mesh>(null);

  useFrame((_, dt) => {
    if (left.current) {
      left.current.rotation.x += dt * 0.18;
      left.current.rotation.y += dt * 0.12;
    }
    if (right.current) {
      right.current.rotation.x -= dt * 0.14;
      right.current.rotation.y -= dt * 0.16;
    }
  });

  return (
    <group>
      <Float speed={1.1} rotationIntensity={0.4} floatIntensity={0.9}>
        <mesh ref={left} position={[-4.2, -1.6, 1.2]}>
          <boxGeometry args={[1.4, 1.4, 1.4]} />
          <meshPhysicalMaterial
            color="#0B1228"
            transmission={0.9}
            thickness={1.2}
            roughness={0.05}
            metalness={0.1}
            ior={1.4}
            clearcoat={1}
            clearcoatRoughness={0.05}
            emissive="#00D4FF"
            emissiveIntensity={0.25}
            transparent
            opacity={0.85}
          />
        </mesh>
      </Float>
      <Float speed={0.9} rotationIntensity={0.5} floatIntensity={1.1}>
        <mesh ref={right} position={[4.4, -1.4, 1.0]}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshPhysicalMaterial
            color="#0B0820"
            transmission={0.9}
            thickness={1.2}
            roughness={0.05}
            metalness={0.1}
            ior={1.45}
            clearcoat={1}
            clearcoatRoughness={0.05}
            emissive="#00D4FF"
            emissiveIntensity={0.3}
            transparent
            opacity={0.85}
          />
        </mesh>
      </Float>
      {/* small accent cube */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={1.4}>
        <mesh position={[-3.2, 1.8, -0.5]} rotation={[0.4, 0.6, 0]}>
          <boxGeometry args={[0.45, 0.45, 0.45]} />
          <meshPhysicalMaterial
            color="#0E1B3A"
            transmission={0.85}
            thickness={0.6}
            roughness={0.08}
            ior={1.4}
            emissive="#0094CC"
            emissiveIntensity={0.4}
            transparent
            opacity={0.8}
          />
        </mesh>
      </Float>
    </group>
  );
}
