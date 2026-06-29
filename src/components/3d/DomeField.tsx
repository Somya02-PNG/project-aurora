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
  const waveOrigin = useRef(new THREE.Vector2(0, 0));
  const pointer = useRef(new THREE.Vector2(0, 0));
  const pointerTarget = useRef(new THREE.Vector2(0, 0));
  const lastImpulse = useRef(0);

  // Ordered spherical-cap rows — closer to the provided video than a random Fibonacci field.
  const layout = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const normals: THREE.Vector3[] = [];
    const phases: number[] = [];
    const radius = 2.85;
    const rows = Math.max(10, Math.round(Math.sqrt(count) * 0.58));
    const targetCount = count;

    for (let row = 0; row < rows && positions.length < targetCount; row++) {
      const v = row / Math.max(1, rows - 1);
      const theta = THREE.MathUtils.lerp(0.16, 1.55, v); // from crown to front lip
      const ringRadius = Math.sin(theta);
      const y = Math.cos(theta) * 0.78;
      const modulesInRing = Math.max(8, Math.round(10 + ringRadius * rows * 6.6));
      const stagger = row % 2 ? Math.PI / modulesInRing : 0;

      for (let j = 0; j < modulesInRing && positions.length < targetCount; j++) {
        const angle = (j / modulesInRing) * Math.PI * 2 + stagger;
        const x = Math.cos(angle) * ringRadius;
        const z = Math.sin(angle) * ringRadius;
        const n = new THREE.Vector3(x, y, z).normalize();
        const rowCompression = 1 - v * 0.12;
        positions.push(new THREE.Vector3(n.x * radius * rowCompression, n.y * radius * 0.9, n.z * radius * 0.88));
        normals.push(n);
        phases.push(row * 0.37 + j * 0.13);
      }
    }

    // Fill any remaining slots around the lower visible cap so the silhouette stays dense.
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = positions.length; i < targetCount; i++) {
      const p = (i - positions.length) / Math.max(1, targetCount - positions.length);
      const y = THREE.MathUtils.lerp(0.72, 0.04, p);
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const a = i * phi;
      const n = new THREE.Vector3(Math.cos(a) * r, y * 0.82, Math.sin(a) * r).normalize();
      positions.push(new THREE.Vector3(n.x * radius, n.y * radius * 0.9, n.z * radius * 0.88));
      normals.push(n);
      phases.push(i * 0.17);
    }
    return { positions, normals, phases, radius };
  }, [count]);

  // Per-instance displacement state (CPU side)
  const disp = useMemo(() => new Float32Array(count), [count]);

  // Cursor target in normalized viewport space.
  const cursorActive = useRef(false);

  // Geometry — glossy rounded modules like the reference video.
  const geometry = useMemo(() => new THREE.SphereGeometry(0.17, 32, 24), []);

  // Material — almost black, slight purple sheen so rims pick up the light
  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#020106"),
      metalness: 0.32,
      roughness: 0.26,
      clearcoat: 0.9,
      clearcoatRoughness: 0.13,
      sheen: 1,
      sheenColor: PURPLE,
      sheenRoughness: 0.38,
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
    const nx = e.uv ? e.uv.x * 2 - 1 : 0;
    const ny = e.uv ? e.uv.y * 2 - 1 : 0;
    pointerTarget.current.set(nx, ny);
    waveOrigin.current.set(nx * 2.9, ny * 1.65);
    cursorActive.current = true;
    lastImpulse.current = performance.now() / 1000;
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
      pointer.current.lerp(pointerTarget.current, Math.min(1, dt * 4.5));
      groupRef.current.rotation.y = Math.sin(t * 0.16) * 0.13 + pointer.current.x * 0.055;
      groupRef.current.rotation.x = -0.22 + Math.sin(t * 0.2) * 0.025 - pointer.current.y * 0.035;
      groupRef.current.position.y = -2.24 + Math.sin(t * 0.42) * 0.045;
    }

    const influence = 1.38;
    const strength = 0.62;
    const waveK = 6.7;
    const waveSpeed = 5.25;
    const easing = Math.min(1, dt * 7);
    const secondsNow = performance.now() / 1000;
    const activeFade = cursorActive.current ? 1 : Math.max(0, 1 - (secondsNow - lastImpulse.current) * 1.35);

    for (let i = 0; i < count; i++) {
      const basePos = layout.positions[i];
      const normal = layout.normals[i];
      const phase = layout.phases[i];

      const bob = reduced ? 0 : Math.sin(t * 0.65 + phase) * 0.018;

      let target = 0;
      if (activeFade > 0 && !reduced) {
        const dx = basePos.x - waveOrigin.current.x;
        const dy = basePos.y - waveOrigin.current.y;
        const dz = basePos.z * 0.42;
        const distSq = dx * dx + dy * dy + dz * dz;
        const dist = Math.sqrt(distSq);
        if (dist < influence * 4.2) {
          const gauss = Math.exp(-distSq / (influence * influence * 1.2));
          const wave =
            Math.sin(dist * waveK - t * waveSpeed) * Math.exp(-dist * 0.42) * 0.28;
          target = (gauss * strength + wave) * activeFade;
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
      const s = 1 + Math.max(-0.15, offset) * 0.34;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  const planeZ = layout.radius * 0.78;

  return (
    <>
      {/* Soft ambient so spheres aren't pitch black on the dark side */}
      <ambientLight intensity={0.08} color={"#130824"} />

      {/* Core glow — purple radiating from the dome interior */}
      <pointLight position={[-1.7, -1.6, 1.4]} intensity={24} color={PURPLE} distance={4.5} decay={1.35} />
      <pointLight position={[1.8, -1.5, 1.35]} intensity={24} color={MAGENTA} distance={4.5} decay={1.35} />
      <pointLight position={[0, -2.2, 0.8]} intensity={38} color={PURPLE_DEEP} distance={5.8} decay={1.45} />
      <spotLight position={[0, 0.8, 4.8]} angle={0.42} penumbra={0.85} intensity={9} color="#6d5bff" distance={8} />

      <group ref={groupRef} position={[0, -2.24, 0]} rotation={[-0.22, 0, 0]}>
        {/* Inner emissive sphere — provides the visible purple glow through the gaps */}
        <mesh position={[0, -0.3, 0.05]} scale={[1.08, 0.62, 0.9]}>
          <sphereGeometry args={[2.75, 64, 32]} />
          <meshBasicMaterial color={PURPLE} transparent opacity={0.72} depthWrite={false} />
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
        position={[0, -1.1, planeZ]}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[9.5, 5.8]} />
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

  const count = isMobile ? 420 : isTablet ? 720 : 1180;

  return (
    <Canvas
      dpr={[1, isMobile ? 1.35 : 1.7]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.72, 7.45], fov: 32 }}
      onCreated={({ camera }) => {
        camera.lookAt(0, -0.9, 0);
      }}
    >
      <Suspense fallback={null}>
        <Dome count={count} reduced={reduced} />
        <EffectComposer>
          <Bloom intensity={1.9} luminanceThreshold={0.08} luminanceSmoothing={0.9} mipmapBlur />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
