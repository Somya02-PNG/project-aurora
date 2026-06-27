import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Twin-strand DNA helix of glowing particles wrapping the quantum core. */
export function DnaHelix({
  turns = 6,
  height = 6,
  radius = 1.9,
  perTurn = 60,
}: {
  turns?: number;
  height?: number;
  radius?: number;
  perTurn?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const { posA, posB } = useMemo(() => {
    const n = turns * perTurn;
    const a = new Float32Array(n * 3);
    const b = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const y = (t - 0.5) * height;
      const ang = t * turns * Math.PI * 2;
      a[i * 3] = Math.cos(ang) * radius;
      a[i * 3 + 1] = y;
      a[i * 3 + 2] = Math.sin(ang) * radius;
      b[i * 3] = Math.cos(ang + Math.PI) * radius;
      b[i * 3 + 1] = y;
      b[i * 3 + 2] = Math.sin(ang + Math.PI) * radius;
    }
    return { posA: a, posB: b };
  }, [turns, height, radius, perTurn]);

  useFrame((_, dt) => {
    if (group.current) {
      group.current.rotation.y += dt * 0.25;
    }
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[posA, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#60A5FA"
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[posB, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#E879F9"
          transparent
          opacity={0.95}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
