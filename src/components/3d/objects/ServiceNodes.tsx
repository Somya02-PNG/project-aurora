import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Rotating network of nodes and connecting lines — services stage. */
export function ServiceNodes({ visibility = 1, count = 22 }: { visibility?: number; count?: number }) {
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * (i / count) - 1);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.2;
      arr.push(
        new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ),
      );
    }
    return arr;
  }, [count]);

  const lineGeo = useMemo(() => {
    const pos: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 2.4) {
          pos.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    return g;
  }, [nodes]);

  useFrame((s) => {
    if (!group.current) return;
    const t = s.clock.elapsedTime;
    group.current.rotation.y = t * 0.15;
    group.current.rotation.x = Math.sin(t * 0.1) * 0.2;
    group.current.scale.setScalar(visibility);
    group.current.visible = visibility > 0.02;
  });

  return (
    <group ref={group}>
      {nodes.map((n, i) => (
        <mesh key={i} position={n}>
          <icosahedronGeometry args={[0.09, 0]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#a855f7" : "#22d3ee"} />
        </mesh>
      ))}
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#a855f7" transparent opacity={0.35 * visibility} />
      </lineSegments>
    </group>
  );
}
