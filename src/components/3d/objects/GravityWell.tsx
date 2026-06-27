import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Dark spherical "gravity well" with a Fresnel rim light and a faint
 * accretion ring — visual centerpiece of the cosmos scene.
 */
export function GravityWell() {
  const core = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);

  const rimMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColorA: { value: new THREE.Color("#A855F7") },
          uColorB: { value: new THREE.Color("#E879F9") },

          uTime: { value: 0 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.6);
            float pulse = 0.85 + 0.15 * sin(uTime * 0.6);
            vec3 col = mix(uColorA, uColorB, fres) * fres * pulse;
            gl_FragColor = vec4(col, fres);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  useFrame((_, dt) => {
    rimMaterial.uniforms.uTime.value += dt;
    if (core.current) core.current.rotation.y += dt * 0.05;
    if (ring.current) {
      ring.current.rotation.z += dt * 0.04;
      ring.current.rotation.x = Math.PI * 0.42;
    }
  });

  return (
    <group>
      {/* dark lens core */}
      <mesh>
        <sphereGeometry args={[1.05, 64, 64]} />
        <meshBasicMaterial color="#02030A" />
      </mesh>
      {/* fresnel halo */}
      <mesh ref={core} material={rimMaterial}>
        <sphereGeometry args={[1.18, 64, 64]} />
      </mesh>
      {/* accretion ring */}
      <mesh ref={ring}>
        <torusGeometry args={[2.4, 0.018, 16, 220]} />
        <meshBasicMaterial color="#7CA9FF" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh rotation={[Math.PI * 0.42, 0, Math.PI * 0.2]}>
        <torusGeometry args={[3.05, 0.008, 16, 220]} />
        <meshBasicMaterial color="#A855F7" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}
