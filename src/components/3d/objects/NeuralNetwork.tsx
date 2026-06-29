import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Random 3D nodes connected by faint glowing edges — neural-net feel. */
export function NeuralNetwork({ nodes = 60, radius = 8 }: { nodes?: number; radius?: number }) {
  const ref = useRef<THREE.Group>(null);

  const { points, lineGeom } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < nodes; i++) {
      pts.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * radius * 2,
          (Math.random() - 0.5) * radius,
          (Math.random() - 0.5) * radius * 2,
        ),
      );
    }
    const positions: number[] = [];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = pts[i].distanceTo(pts[j]);
        if (d < 2.2) {
          positions.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
        }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const flat = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => {
      flat[i * 3] = p.x;
      flat[i * 3 + 1] = p.y;
      flat[i * 3 + 2] = p.z;
    });
    return { points: flat, lineGeom: geo };
  }, [nodes, radius]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.03;
  });

  return (
    <group ref={ref}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[points, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.09}
          color="#00D4FF"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial
          color="#0088FF"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
