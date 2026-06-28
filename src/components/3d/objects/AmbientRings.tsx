import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Calm light rings — testimonials stage. */
export function AmbientRings({ visibility = 1 }: { visibility?: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!group.current) return;
    const t = s.clock.elapsedTime;
    group.current.children.forEach((c, i) => {
      c.rotation.x = t * 0.05 * (i + 1);
      c.rotation.y = t * 0.07 * (i + 1);
    });
    group.current.scale.setScalar(visibility);
    group.current.visible = visibility > 0.02;
  });
  const rings = [1.6, 2.2, 2.9, 3.7];
  return (
    <group ref={group}>
      {rings.map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, 0, i * 0.5]}>
          <torusGeometry args={[r, 0.012, 16, 200]} />
          <meshBasicMaterial color={i % 2 ? "#c084fc" : "#a78bfa"} transparent opacity={0.55 * visibility} />
        </mesh>
      ))}
    </group>
  );
}
