import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Final convergence — bright energy core with inrushing particles. */
export function ConvergenceCore({ visibility = 1, count = 1500 }: { visibility?: number; count?: number }) {
  const group = useRef<THREE.Group>(null);
  const points = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 4;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(p) * Math.cos(t);
      positions[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      positions[i * 3 + 2] = r * Math.cos(p);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count]);

  useFrame((s, dt) => {
    if (!group.current || !points.current) return;
    const t = s.clock.elapsedTime;
    group.current.rotation.y = t * 0.2;
    const pos = points.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] *= 1 - dt * 0.25;
      arr[i * 3 + 1] *= 1 - dt * 0.25;
      arr[i * 3 + 2] *= 1 - dt * 0.25;
      const r2 = arr[i * 3] ** 2 + arr[i * 3 + 1] ** 2 + arr[i * 3 + 2] ** 2;
      if (r2 < 1.2) {
        const r = 5 + Math.random() * 3;
        const a = Math.random() * Math.PI * 2;
        const p = Math.acos(2 * Math.random() - 1);
        arr[i * 3] = r * Math.sin(p) * Math.cos(a);
        arr[i * 3 + 1] = r * Math.sin(p) * Math.sin(a);
        arr[i * 3 + 2] = r * Math.cos(p);
      }
    }
    pos.needsUpdate = true;
    group.current.scale.setScalar(visibility);
    group.current.visible = visibility > 0.02;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[0.9, 2]} />
        <meshBasicMaterial color="#e879f9" transparent opacity={0.85 * visibility} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.18 * visibility} />
      </mesh>
      <points ref={points} geometry={geo}>
        <pointsMaterial color="#c084fc" size={0.045} transparent opacity={visibility} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
      <pointLight intensity={3 * visibility} color="#e879f9" distance={20} />
    </group>
  );
}
