import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Icosahedron, MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

export function Planet({ position = [0, 0, 0] as [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.08;
  });
  return (
    <group ref={ref} position={position}>
      <Sphere args={[1.6, 96, 96]}>
        {/* @ts-expect-error drei material */}
        <MeshDistortMaterial
          color="#1E3A8A"
          emissive="#3B82F6"
          emissiveIntensity={0.4}
          roughness={0.35}
          metalness={0.6}
          distort={0.28}
          speed={1.2}
        />
      </Sphere>
      {/* energy ring */}
      <mesh rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[2.5, 0.015, 16, 200]} />
        <meshBasicMaterial color="#06B6D4" transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 2.9, 0.5, 0]}>
        <torusGeometry args={[2.95, 0.008, 16, 200]} />
        <meshBasicMaterial color="#7C3AED" transparent opacity={0.55} />
      </mesh>
      {/* halo */}
      <Icosahedron args={[1.62, 2]}>
        <meshBasicMaterial color="#3B82F6" wireframe transparent opacity={0.18} />
      </Icosahedron>
    </group>
  );
}

export function Globe({ position = [0, 0, 0] as [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.12;
  });
  return (
    <group ref={ref} position={position}>
      <Sphere args={[1.4, 64, 64]}>
        <meshStandardMaterial
          color="#0B1E3F"
          emissive="#3B82F6"
          emissiveIntensity={0.15}
          roughness={0.6}
          metalness={0.4}
          wireframe
        />
      </Sphere>
      <Sphere args={[1.4, 32, 32]}>
        <meshBasicMaterial color="#3B82F6" transparent opacity={0.06} />
      </Sphere>
      {/* nodes */}
      {Array.from({ length: 18 }).map((_, i) => {
        const t = (i / 18) * Math.PI * 2;
        const p = ((i * 7) % 13) / 13 * Math.PI - Math.PI / 2;
        const r = 1.42;
        const x = r * Math.cos(p) * Math.cos(t);
        const y = r * Math.sin(p);
        const z = r * Math.cos(p) * Math.sin(t);
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshBasicMaterial color={i % 2 ? "#06B6D4" : "#7C3AED"} />
          </mesh>
        );
      })}
    </group>
  );
}
