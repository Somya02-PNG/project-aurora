import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Low-poly wireframe hand with glowing edges.
 * Uses custom geometry to create a stylized hand shape.
 */
export function PolyHand() {
  const groupRef = useRef<THREE.Group>(null);
  const lineRef = useRef<THREE.LineSegments>(null);

  const { geometry, lineGeometry } = useMemo(() => {
    // Hand vertices - stylized low-poly hand shape
    const vertices = new Float32Array([
      // Palm base
      -0.4, -0.8, 0,
       0.4, -0.8, 0,
       0.5, -0.3, 0,
      -0.5, -0.3, 0,
      // Palm top
      -0.45, 0, 0,
       0.45, 0, 0,
       0.5, -0.3, 0.1,
      -0.5, -0.3, 0.1,
      // Thumb
      -0.55, -0.2, 0,
      -0.75, 0.1, 0.15,
      -0.85, 0.4, 0.1,
      -0.7, 0.6, 0.05,
      -0.5, 0.5, 0,
      // Index finger
      -0.3, 0.1, 0,
      -0.3, 0.6, 0.05,
      -0.28, 1.1, 0.08,
      -0.25, 1.5, 0.05,
      -0.3, 1.8, 0,
      // Middle finger
       0, 0.1, 0.02,
       0, 0.65, 0.06,
       0.02, 1.2, 0.1,
       0, 1.55, 0.06,
       0, 1.9, 0,
      // Ring finger
       0.28, 0.08, 0,
       0.28, 0.55, 0.04,
       0.3, 1.0, 0.06,
       0.28, 1.35, 0.04,
       0.28, 1.65, 0,
      // Pinky
       0.5, 0, 0,
       0.52, 0.35, 0.03,
       0.55, 0.7, 0.05,
       0.52, 0.95, 0.03,
       0.5, 1.15, 0,
    ]);

    // Edges connecting vertices to form wireframe hand
    const indices = [
      // Palm outline
      0, 1, 1, 2, 2, 3, 3, 0,
      0, 7, 1, 6, 2, 5, 3, 4,
      4, 5, 5, 6, 6, 7, 7, 4,
      // Thumb
      4, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 4,
      // Index
      4, 13, 13, 14, 14, 15, 15, 16, 16, 17,
      // Middle
      5, 18, 18, 19, 19, 20, 20, 21, 21, 22,
      // Ring
      5, 23, 23, 24, 24, 25, 25, 26, 26, 27,
      // Pinky
      5, 28, 28, 29, 29, 30, 30, 31, 31, 32,
      // Cross connections for 3D effect
      13, 14, 14, 15, 15, 16,
      18, 19, 19, 20, 20, 21,
      23, 24, 24, 25, 25, 26,
      28, 29, 29, 30, 30, 31,
    ];

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

    const lineGeo = new THREE.BufferGeometry();
    const lineVertices: number[] = [];
    for (const idx of indices) {
      lineVertices.push(vertices[idx * 3], vertices[idx * 3 + 1], vertices[idx * 3 + 2]);
    }
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(lineVertices, 3));

    return { geometry: geo, lineGeometry: lineGeo };
  }, []);

  const lineMaterial = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: new THREE.Color("#00D4FF"),
        transparent: true,
        opacity: 0.9,
        linewidth: 1,
      }),
    []
  );

  const glowMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#00D4FF") },
          uGlowColor: { value: new THREE.Color("#0088FF") },
        },
        vertexShader: `
          varying vec3 vPosition;
          void main() {
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec3 uColor;
          uniform vec3 uGlowColor;
          varying vec3 vPosition;
          void main() {
            float pulse = 0.7 + 0.3 * sin(uTime * 2.0 + vPosition.y * 3.0);
            vec3 col = mix(uColor, uGlowColor, sin(uTime + vPosition.y) * 0.5 + 0.5);
            gl_FragColor = vec4(col * pulse, 1.0);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  useFrame((_, dt) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += dt * 0.08;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
    }
    glowMaterial.uniforms.uTime.value += dt;
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <lineSegments ref={lineRef} geometry={lineGeometry} material={glowMaterial} />
      {/* Inner glow points at fingertips */}
      <mesh position={[-0.3, 1.8, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, 1.9, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0.28, 1.65, 0]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0.5, 1.15, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[-0.7, 0.6, 0.05]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#00D4FF" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}
