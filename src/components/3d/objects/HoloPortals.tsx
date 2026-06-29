import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Multiple translucent rings orbiting at different angles. */
export function HoloPortals() {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!g.current) return;
    g.current.rotation.y += dt * 0.08;
    g.current.children.forEach((c, i) => {
      c.rotation.z += dt * (0.15 + i * 0.05);
    });
  });
  const rings = [
    { r: 3.2, color: "#00D4FF", tilt: [Math.PI / 2.2, 0, 0.3] as [number, number, number] },
    { r: 3.8, color: "#0088FF", tilt: [Math.PI / 1.9, 0.4, 0] as [number, number, number] },
    { r: 4.6, color: "#00D4FF", tilt: [Math.PI / 2.5, -0.4, 0.6] as [number, number, number] },
    { r: 5.4, color: "#0050A0", tilt: [Math.PI / 2.1, 0.2, -0.4] as [number, number, number] },
  ];
  return (
    <group ref={g}>
      {rings.map((r, i) => (
        <mesh key={i} rotation={r.tilt}>
          <torusGeometry args={[r.r, 0.012, 16, 220]} />
          <meshBasicMaterial
            color={r.color}
            transparent
            opacity={0.55}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
