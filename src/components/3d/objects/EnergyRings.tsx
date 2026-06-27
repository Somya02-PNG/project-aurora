import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function EnergyRings() {
  const g = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (g.current) {
      g.current.rotation.z += d * 0.2;
      g.current.children.forEach((c, i) => {
        c.rotation.x += d * (0.1 + i * 0.05);
        c.rotation.y += d * (0.08 + i * 0.04);
      });
    }
  });
  const colors = ["#3B82F6", "#7C3AED", "#06B6D4", "#3B82F6"];
  return (
    <group ref={g}>
      {colors.map((c, i) => (
        <mesh key={i}>
          <torusGeometry args={[1.4 + i * 0.55, 0.012 + i * 0.004, 16, 200]} />
          <meshBasicMaterial color={c} transparent opacity={0.65 - i * 0.1} />
        </mesh>
      ))}
      {/* core orb */}
      <mesh>
        <sphereGeometry args={[0.55, 64, 64]} />
        <meshStandardMaterial
          color="#7C3AED"
          emissive="#3B82F6"
          emissiveIntensity={1.4}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </group>
  );
}
