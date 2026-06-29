import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Icosahedron, Torus, Box, Octahedron } from "@react-three/drei";
import * as THREE from "three";

export function FloatingGeometry() {
  const group = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (group.current) group.current.rotation.y += d * 0.05;
  });
  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        <Icosahedron args={[0.55, 0]} position={[-3.4, 1.6, -1.5]}>
          <meshStandardMaterial color="#00D4FF" emissive="#00D4FF" emissiveIntensity={0.6} wireframe />
        </Icosahedron>
      </Float>
      <Float speed={1.4} rotationIntensity={0.8} floatIntensity={1.2}>
        <Torus args={[0.5, 0.15, 24, 64]} position={[3.5, -1.2, -2]}>
          <meshStandardMaterial color="#0088FF" emissive="#0088FF" emissiveIntensity={0.5} metalness={0.7} roughness={0.2} />
        </Torus>
      </Float>
      <Float speed={1.8} rotationIntensity={1.5} floatIntensity={1.1}>
        <Octahedron args={[0.45, 0]} position={[2.8, 2.1, -1]}>
          <meshStandardMaterial color="#0094CC" emissive="#0094CC" emissiveIntensity={0.7} />
        </Octahedron>
      </Float>
      <Float speed={1.1} rotationIntensity={0.6} floatIntensity={0.8}>
        <Box args={[0.5, 0.5, 0.5]} position={[-3.2, -1.6, -2]}>
          <meshPhysicalMaterial
            color="#00D4FF"
            transmission={0.6}
            thickness={0.8}
            roughness={0.05}
            metalness={0.2}
            emissive="#00D4FF"
            emissiveIntensity={0.3}
          />
        </Box>
      </Float>
    </group>
  );
}

export function TechSphere() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, d) => {
    if (ref.current) {
      ref.current.rotation.y += d * 0.15;
      ref.current.rotation.x += d * 0.06;
    }
  });
  const nodes = 60;
  return (
    <group ref={ref}>
      {Array.from({ length: nodes }).map((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / nodes);
        const theta = Math.sqrt(nodes * Math.PI) * phi;
        const r = 1.6;
        const x = r * Math.cos(theta) * Math.sin(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(phi);
        const color = i % 3 === 0 ? "#00D4FF" : i % 3 === 1 ? "#0088FF" : "#0094CC";
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.04, 10, 10]} />
            <meshBasicMaterial color={color} />
          </mesh>
        );
      })}
      <Icosahedron args={[1.6, 1]}>
        <meshBasicMaterial color="#00D4FF" wireframe transparent opacity={0.15} />
      </Icosahedron>
    </group>
  );
}
