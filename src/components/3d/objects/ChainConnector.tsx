import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Rotating chain-link connector that floats above the hand.
 * Features interlocking rings that rotate on its own axis.
 */
export function ChainConnector() {
  const groupRef = useRef<THREE.Group>(null);
  const innerGroupRef = useRef<THREE.Group>(null);

  const ringMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColorA: { value: new THREE.Color("#00D4FF") },
          uColorB: { value: new THREE.Color("#0050A0") },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 1.5);
            float wave = sin(vPosition.x * 10.0 + uTime * 3.0) * 0.5 + 0.5;
            vec3 col = mix(uColorB, uColorA, fresnel * wave + fresnel * 0.5);
            float pulse = 0.8 + 0.2 * sin(uTime * 2.0);
            gl_FragColor = vec4(col * pulse, 0.95);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  const glowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#00D4FF"),
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  useFrame((_, dt) => {
    // Rotate the entire chain connector on its own axis
    if (groupRef.current) {
      groupRef.current.rotation.z += dt * 0.5; // Main axis rotation
      groupRef.current.rotation.y += dt * 0.15;
    }
    // Counter-rotate inner rings for dynamic effect
    if (innerGroupRef.current) {
      innerGroupRef.current.rotation.z -= dt * 0.3;
    }
    ringMaterial.uniforms.uTime.value += dt;
  });

  return (
    <group ref={groupRef} position={[0, 2.3, 0]}>
      {/* Main chain link - horizontal oval */}
      <mesh>
        <torusGeometry args={[0.5, 0.06, 16, 64, Math.PI * 2]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Inner rotating ring */}
      <group ref={innerGroupRef}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.35, 0.04, 16, 48]} />
          <meshBasicMaterial color="#0088FF" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>

      {/* Cross-chain links */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.04, 12, 48, Math.PI]} />
        <meshBasicMaterial color="#0094CC" transparent opacity={0.7} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, Math.PI]}>
        <torusGeometry args={[0.4, 0.04, 12, 48, Math.PI]} />
        <meshBasicMaterial color="#0094CC" transparent opacity={0.7} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Outer glow rings */}
      <mesh>
        <torusGeometry args={[0.6, 0.02, 8, 64]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.55, 0.015, 8, 48]} />
        <meshBasicMaterial color="#0050A0" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Energy nodes at intersections */}
      <mesh position={[0.5, 0, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[-0.5, 0, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color="#0088FF" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color="#0088FF" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Central core glow */}
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}
