import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Panel {
  pos: [number, number, number];
  rot: [number, number, number];
  size: [number, number];
  color: string;
}

const panels: Panel[] = [
  { pos: [-4.6, 1.6, -1.5], rot: [0, 0.55, 0], size: [2.0, 1.2], color: "#60A5FA" },
  { pos: [4.4, 1.2, -1.8], rot: [0, -0.5, 0], size: [1.8, 1.0], color: "#A855F7" },
  { pos: [-3.6, -1.8, -0.6], rot: [0, 0.35, 0.08], size: [1.4, 0.9], color: "#E879F9" },
  { pos: [3.8, -2.0, -0.4], rot: [0, -0.4, -0.06], size: [1.6, 1.0], color: "#F43F5E" },
];

/** Suspended glassmorphism HUD panels. */
export function HoloPanels() {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!g.current) return;
    const t = clock.elapsedTime;
    g.current.children.forEach((c, i) => {
      c.position.y += Math.sin(t * 0.6 + i) * 0.0015;
    });
  });
  return (
    <group ref={g}>
      {panels.map((p, i) => (
        <group key={i} position={p.pos} rotation={p.rot}>
          <mesh>
            <planeGeometry args={p.size} />
            <meshBasicMaterial
              color={p.color}
              transparent
              opacity={0.08}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* border */}
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(p.size[0], p.size[1])]} />
            <lineBasicMaterial
              color={p.color}
              transparent
              opacity={0.85}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </lineSegments>
          {/* bar chart hint */}
          {[0, 1, 2, 3, 4].map((b) => (
            <mesh
              key={b}
              position={[
                -p.size[0] / 2 + 0.18 + b * 0.18,
                -p.size[1] / 2 + 0.12 + (b % 3) * 0.08,
                0.001,
              ]}
            >
              <planeGeometry args={[0.06, 0.18 + (b % 3) * 0.12]} />
              <meshBasicMaterial
                color={p.color}
                transparent
                opacity={0.9}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
