import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Tangential light streaks orbiting the gravity well — the "comet trail"
 * highlights in the reference video.
 */
export function LightStreaks({ count = 24 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);

  const streaks = useMemo(() => {
    const arr: { r: number; y: number; speed: number; phase: number; len: number; tilt: number }[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        r: 2.6 + Math.random() * 5.5,
        y: (Math.random() - 0.5) * 4,
        speed: 0.05 + Math.random() * 0.15,
        phase: Math.random() * Math.PI * 2,
        len: 0.8 + Math.random() * 2.4,
        tilt: (Math.random() - 0.5) * 0.6,
      });
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const s = streaks[i];
      const a = s.phase + t * s.speed;
      child.position.set(Math.cos(a) * s.r, s.y + Math.sin(a * 0.4) * 0.2, Math.sin(a) * s.r);
      child.rotation.set(0, -a + Math.PI / 2, s.tilt);
    });
  });

  return (
    <group ref={group}>
      {streaks.map((s, i) => (
        <mesh key={i}>
          <planeGeometry args={[s.len, 0.02]} />
          <meshBasicMaterial
            color={i % 3 === 0 ? "#A855F7" : i % 3 === 1 ? "#06B6D4" : "#7CA9FF"}
            transparent
            opacity={0.55}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
