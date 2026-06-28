import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Two particle humanoid silhouettes (about stage). */
export function HumanSilhouettes({ visibility = 1, count = 1400 }: { visibility?: number; count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const positions = new Float32Array(count * 2 * 3);
    const colors = new Float32Array(count * 2 * 3);
    const buildBody = (offsetX: number, hue: THREE.Color, base: number) => {
      for (let i = 0; i < count; i++) {
        // Sample silhouette: head sphere, torso ellipsoid, legs cylinders
        const r = Math.random();
        let x = 0, y = 0, z = 0;
        if (r < 0.18) {
          // head
          const t = Math.random() * Math.PI * 2;
          const p = Math.acos(2 * Math.random() - 1);
          const rad = 0.35;
          x = Math.sin(p) * Math.cos(t) * rad;
          y = 1.55 + Math.cos(p) * rad;
          z = Math.sin(p) * Math.sin(t) * rad * 0.6;
        } else if (r < 0.6) {
          // torso
          y = 0.4 + Math.random() * 1.0;
          const a = Math.random() * Math.PI * 2;
          const rad = 0.55 * (1 - Math.abs((y - 0.9) / 1.4));
          x = Math.cos(a) * rad;
          z = Math.sin(a) * rad * 0.5;
        } else if (r < 0.82) {
          // arms
          const side = Math.random() < 0.5 ? -1 : 1;
          const t = Math.random();
          x = side * (0.55 + t * 0.65);
          y = 1.25 - t * 1.2;
          z = (Math.random() - 0.5) * 0.18;
        } else {
          // legs
          const side = Math.random() < 0.5 ? -1 : 1;
          const t = Math.random();
          x = side * 0.18;
          y = 0.4 - t * 1.4;
          z = (Math.random() - 0.5) * 0.18;
        }
        const idx = (base + i) * 3;
        positions[idx] = x + offsetX;
        positions[idx + 1] = y;
        positions[idx + 2] = z;
        colors[idx] = hue.r;
        colors[idx + 1] = hue.g;
        colors[idx + 2] = hue.b;
      }
    };
    buildBody(-1.4, new THREE.Color("#a855f7"), 0);
    buildBody(1.4, new THREE.Color("#22d3ee"), count);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return g;
  }, [count]);

  useFrame((s) => {
    if (!ref.current) return;
    const t = s.clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.2) * 0.3;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = visibility;
    ref.current.visible = visibility > 0.02;
  });

  return (
    <points ref={ref} geometry={geo} position={[0, -0.2, 0]}>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={visibility}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
