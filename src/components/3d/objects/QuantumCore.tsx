import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Dense particle sphere with bright fresnel halo — central quantum core. */
export function QuantumCore({ count = 4500, radius = 1.05 }: { count?: number; radius?: number }) {
  const pts = useRef<THREE.Points>(null);
  const halo = useRef<THREE.Mesh>(null);

  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.6 + Math.random() * 0.4);
      a[i * 3] = r * Math.sin(p) * Math.cos(t);
      a[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      a[i * 3 + 2] = r * Math.cos(p);
    }
    return a;
  }, [count, radius]);

  const haloMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uA: { value: new THREE.Color("#60A5FA") },
          uB: { value: new THREE.Color("#E879F9") },
        },
        vertexShader: `
          varying vec3 vN; varying vec3 vV;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vN = normalize(normalMatrix * normal);
            vV = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform float uTime; uniform vec3 uA; uniform vec3 uB;
          varying vec3 vN; varying vec3 vV;
          void main() {
            float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.2);
            float pulse = 0.8 + 0.2 * sin(uTime * 1.4);
            vec3 c = mix(uA, uB, f) * f * pulse * 1.4;
            gl_FragColor = vec4(c, f);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  useFrame((_, dt) => {
    haloMat.uniforms.uTime.value += dt;
    if (pts.current) {
      pts.current.rotation.y += dt * 0.25;
      pts.current.rotation.x += dt * 0.08;
    }
    if (halo.current) halo.current.rotation.y -= dt * 0.1;
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius * 0.55, 32, 32]} />
        <meshBasicMaterial color="#0B0220" />
      </mesh>
      <points ref={pts}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.028}
          color="#C4B5FD"
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
      <mesh ref={halo} material={haloMat}>
        <sphereGeometry args={[radius * 1.35, 48, 48]} />
      </mesh>
    </group>
  );
}
