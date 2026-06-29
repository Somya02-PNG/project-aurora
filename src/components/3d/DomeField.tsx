import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGL } from "@/hooks/useWebGL";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/* ------------------------------------------------------------------ */
/* Dome of instanced spheres with cursor ripple                       */
/* Reference: matte-black spheres in a hemisphere, intense purple     */
/* glow radiating from the gaps between them.                         */
/* ------------------------------------------------------------------ */

const PURPLE = new THREE.Color("#8B5CF6");
const PURPLE_DEEP = new THREE.Color("#5B21B6");
const MAGENTA = new THREE.Color("#A855F7");

interface DomeProps {
  count: number;
  reduced: boolean;
}

function Dome({ count, reduced }: DomeProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Fibonacci hemisphere positions + normals
  const layout = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const normals: THREE.Vector3[] = [];
    const phases: number[] = [];
    const radius = 2.8;
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      // hemisphere: y in [0, 1]
      const y = 1 - (i / (count - 1));
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = phi * i;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      const n = new THREE.Vector3(x, y, z).normalize();
      positions.push(n.clone().multiplyScalar(radius));
      normals.push(n);
      phases.push(Math.random() * Math.PI * 2);
    }
    return { positions, normals, phases, radius };
  }, [count]);

  // Per-instance displacement state (CPU side)
  const disp = useMemo(() => new Float32Array(count), [count]);

  // Cursor target on the dome surface
  const cursor = useRef(new THREE.Vector3(0, 999, 0));
  const cursorActive = useRef(false);

  // Geometry — small sphere
  const geometry = useMemo(() => new THREE.SphereGeometry(0.22, 24, 20), []);

  // Material — almost black, slight purple sheen so rims pick up the light
  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#05030a"),
      metalness: 0.4,
      roughness: 0.35,
      clearcoat: 0.9,
      clearcoatRoughness: 0.2,
      sheen: 1,
      sheenColor: PURPLE,
      sheenRoughness: 0.5,
    });
  }, []);

  // Initialize matrices once
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      dummy.position.copy(layout.positions[i]);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [count, layout]);

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    cursor.current.copy(e.point);
    cursorActive.current = true;
  };
  const handlePointerOut = () => {
    cursorActive.current = false;
  };

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const mesh = meshRef.current;
    if (!mesh) return;

    if (groupRef.current && !reduced) {
      groupRef.current.rotation.y += dt * 0.05;
    }

    const cur = cursor.current;
    const influence = 1.0;
    const strength = 0.55;
    const waveK = 5.0;
    const waveSpeed = 3.0;
    const easing = Math.min(1, dt * 7);

    for (let i = 0; i < count; i++) {
      const basePos = layout.positions[i];
      const normal = layout.normals[i];
      const phase = layout.phases[i];

      const bob = reduced ? 0 : Math.sin(t * 0.6 + phase) * 0.015;

      let target = 0;
      if (cursorActive.current && !reduced) {
        const dx = basePos.x - cur.x;
        const dy = basePos.y - cur.y;
        const dz = basePos.z - cur.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        const dist = Math.sqrt(distSq);
        if (dist < influence * 3) {
          const gauss = Math.exp(-distSq / (influence * influence));
          const wave =
            Math.sin(dist * waveK - t * waveSpeed) * Math.exp(-dist * 0.8) * 0.18;
          target = gauss * strength + wave;
        }
      }

      disp[i] += (target - disp[i]) * easing;
      const offset = disp[i] + bob;

      dummy.position.set(
        basePos.x + normal.x * offset,
        basePos.y + normal.y * offset,
        basePos.z + normal.z * offset,
      );
      dummy.quaternion.identity();
      const s = 1 + offset * 0.3;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  const planeZ = layout.radius + 0.3;

  return (
    <>
      {/* Soft ambient so spheres aren't pitch black on the dark side */}
      <ambientLight intensity={0.15} color={"#1a0f2e"} />

      {/* Core glow — purple radiating from the dome interior */}
      <pointLight position={[0, 0.4, 0]} intensity={45} color={PURPLE} distance={8} decay={1.6} />
      <pointLight position={[0, -0.6, 0]} intensity={30} color={MAGENTA} distance={6} decay={1.8} />
      <pointLight position={[0, 1.8, 0]} intensity={6} color={PURPLE_DEEP} distance={5} decay={1.5} />

      <group ref={groupRef} position={[0, -1.6, 0]}>
        {/* Inner emissive sphere — provides the visible purple glow through the gaps */}
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[2.4, 48, 32]} />
          <meshBasicMaterial color={PURPLE} transparent opacity={0.85} />
        </mesh>
        {/* Outer dome of spheres */}
        <instancedMesh
          ref={meshRef}
          args={[geometry, material, count]}
          frustumCulled={false}
          castShadow={false}
          receiveShadow={false}
        />
      </group>

      {/* Invisible interaction plane */}
      <mesh
        position={[0, -1.6, planeZ]}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        visible={false}
      >
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}

export default function DomeField() {
  const reduced = useReducedMotion();
  const webgl = useWebGL();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  if (!webgl) return null;

  const count = isMobile ? 320 : isTablet ? 560 : 900;

  return (
    <Canvas
      dpr={[1, isMobile ? 1.5 : 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 1.6, 5.4], fov: 42 }}
      onCreated={({ camera }) => {
        camera.lookAt(0, 0.2, 0);
      }}
    >
      <Suspense fallback={null}>
        <Dome count={count} reduced={reduced} />
        <EffectComposer>
          <Bloom intensity={1.4} luminanceThreshold={0.2} luminanceSmoothing={0.85} mipmapBlur />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
