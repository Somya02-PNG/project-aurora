import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Flowing neon wave plane at the bottom of the scene. */
export function EnergyWaves() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uA: { value: new THREE.Color("#3B82F6") },
          uB: { value: new THREE.Color("#A855F7") },
          uC: { value: new THREE.Color("#F43F5E") },
        },
        vertexShader: `
          uniform float uTime;
          uniform vec2 uMouse;
          varying vec2 vUv;
          varying float vH;
          void main() {
            vUv = uv;
            vec3 p = position;
            float d = distance(uv, uMouse * 0.5 + 0.5);
            float h = sin(p.x * 1.4 + uTime * 0.9) * 0.35
                    + cos(p.y * 1.8 + uTime * 0.6) * 0.3
                    + sin((p.x + p.y) * 2.2 + uTime) * 0.18;
            h += smoothstep(0.5, 0.0, d) * 0.6;
            p.z += h;
            vH = h;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uA;
          uniform vec3 uB;
          uniform vec3 uC;
          varying vec2 vUv;
          varying float vH;
          void main() {
            vec3 col = mix(uA, uB, smoothstep(-0.2, 0.6, vH));
            col = mix(col, uC, smoothstep(0.4, 1.1, vH) * 0.6);
            float a = smoothstep(0.0, 0.4, vUv.y) * 0.85;
            gl_FragColor = vec4(col * (0.4 + vH * 0.6), a);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        wireframe: true,
      }),
    [],
  );

  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }, _dt) => {
    mat.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh
      ref={ref}
      material={mat}
      position={[0, -4.2, -1]}
      rotation={[-Math.PI / 2.4, 0, 0]}
    >
      <planeGeometry args={[28, 18, 80, 60]} />
    </mesh>
  );
}
