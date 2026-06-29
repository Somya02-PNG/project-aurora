import { useMemo } from "react";
import * as THREE from "three";

/** Back-facing sphere shader that paints the deep navy/blue ambient glow. */
export function VolumetricHaze() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTop: { value: new THREE.Color("#020810") },
          uMid: { value: new THREE.Color("#061030") },
          uHot: { value: new THREE.Color("#0A2050") },
        },
        vertexShader: `
          varying vec3 vPos;
          void main() {
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uTop;
          uniform vec3 uMid;
          uniform vec3 uHot;
          varying vec3 vPos;
          void main() {
            vec3 n = normalize(vPos);
            float y = n.y * 0.5 + 0.5;
            float hot = smoothstep(0.35, 0.0, length(n.xy));
            vec3 col = mix(uTop, uMid, y);
            col = mix(col, uHot, hot * 0.55);
            gl_FragColor = vec4(col, 1.0);
          }
        `,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    [],
  );

  return (
    <mesh material={material}>
      <sphereGeometry args={[60, 32, 32]} />
    </mesh>
  );
}
