import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Flowing data ribbons / particle rivers — stats stage. */
export function DataRibbons({ visibility = 1, count = 1800 }: { visibility?: number; count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const { geo, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const speedsArr = new Float32Array(count);
    const palette = [new THREE.Color("#a855f7"), new THREE.Color("#22d3ee"), new THREE.Color("#e879f9")];
    for (let i = 0; i < count; i++) {
      const ribbon = i % 5;
      const u = Math.random();
      const x = (u - 0.5) * 16;
      const y = Math.sin(u * Math.PI * 4 + ribbon) * 1.6 + (ribbon - 2) * 0.6;
      const z = Math.cos(u * Math.PI * 3 + ribbon * 1.3) * 1.4;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      const c = palette[ribbon % palette.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      speedsArr[i] = 0.6 + Math.random() * 1.4;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return { geo: g, speeds: speedsArr };
  }, [count]);

  useFrame((s, dt) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += speeds[i] * dt * 0.8;
      if (arr[i * 3] > 8) arr[i * 3] = -8;
    }
    pos.needsUpdate = true;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = visibility * 0.95;
    ref.current.visible = visibility > 0.02;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={visibility}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
