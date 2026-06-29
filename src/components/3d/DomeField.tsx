import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebGL } from "@/hooks/useWebGL";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/* ------------------------------------------------------------------ */
/* Read site accent colors from CSS variables — falls back to brand   */
/* ------------------------------------------------------------------ */
function useThemeColors() {
  const [colors, setColors] = useState({
    accent: new THREE.Color("#3b82f6"),
    rim: new THREE.Color("#7c3aed"),
    base: new THREE.Color("#0a1628"),
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const styles = getComputedStyle(document.documentElement);
      const tryVar = (name: string, fallback: string) => {
        const v = styles.getPropertyValue(name).trim();
        if (!v) return fallback;
        // hsl(...) or hex — try to parse
        try {
          return new THREE.Color(v.startsWith("hsl") || v.startsWith("#") ? v : `hsl(${v})`).getStyle();
        } catch {
          return fallback;
        }
      };
      const accent = tryVar("--primary", "#3b82f6");
      const rim = tryVar("--accent", "#7c3aed");
      setColors({
        accent: new THREE.Color(accent),
        rim: new THREE.Color(rim),
        base: new THREE.Color("#0a1628"),
      });
    } catch {
      /* keep defaults */
    }
  }, []);
  return colors;
}

/* ------------------------------------------------------------------ */
/* Dome of instanced rounded modules with cursor ripple               */
/* ------------------------------------------------------------------ */
interface DomeProps {
  count: number;
  reduced: boolean;
  enableBloom: boolean;
}

function Dome({ count, reduced }: DomeProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const colors = useThemeColors();
  const { camera } = useThree();

  // Fibonacci hemisphere positions + normals
  const layout = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const normals: THREE.Vector3[] = [];
    const phases: number[] = [];
    const radius = 2.4;
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      // hemisphere: y in [0, 1]
      const y = 1 - (i / (count - 1)) * 1;
      const r = Math.sqrt(1 - y * y);
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
  const tiltX = useMemo(() => new Float32Array(count), [count]);
  const tiltY = useMemo(() => new Float32Array(count), [count]);

  // Cursor target on the dome surface
  const cursor = useRef(new THREE.Vector3(0, 999, 0)); // far away initially
  const cursorActive = useRef(false);

  // Geometry — rounded box, shared for all instances
  const geometry = useMemo(() => {
    const g = new RoundedBoxGeometry(0.16, 0.16, 0.05, 4, 0.03);
    return g;
  }, []);

  // Material — emissive + slight clearcoat
  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#0c1830"),
      emissive: colors.accent.clone(),
      emissiveIntensity: 0.55,
      metalness: 0.55,
      roughness: 0.35,
      clearcoat: 0.8,
      clearcoatRoughness: 0.25,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors.accent.getHexString()]);

  // Initialize matrices once
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const up = new THREE.Vector3(0, 1, 0);
    const m = new THREE.Matrix4();
    for (let i = 0; i < count; i++) {
      dummy.position.copy(layout.positions[i]);
      // orient face outward
      m.lookAt(layout.positions[i].clone().multiplyScalar(2), new THREE.Vector3(0, 0, 0), up);
      dummy.quaternion.setFromRotationMatrix(m);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [count, layout]);

  // Pointer plane — invisible, fills front of camera
  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    cursor.current.copy(e.point);
    cursorActive.current = true;
  };
  const handlePointerOut = () => {
    cursorActive.current = false;
  };

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmpQ = useMemo(() => new THREE.Quaternion(), []);
  const tmpM = useMemo(() => new THREE.Matrix4(), []);
  const tmpUp = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const mesh = meshRef.current;
    if (!mesh) return;

    // Group ambient motion
    if (groupRef.current && !reduced) {
      groupRef.current.rotation.y += dt * 0.04;
      const breathe = 1 + Math.sin(t * 0.5) * 0.015;
      groupRef.current.scale.setScalar(breathe);
    }

    // Orbiting light
    if (lightRef.current) {
      const lr = 4;
      lightRef.current.position.set(
        Math.cos(t * 0.4) * lr,
        1.5 + Math.sin(t * 0.6) * 0.8,
        Math.sin(t * 0.4) * lr,
      );
    }

    // Update instances
    const cur = cursor.current;
    const radius = layout.radius;
    const influence = 1.2;
    const strength = 0.35;
    const waveK = 4.0;
    const waveSpeed = 2.5;
    const easing = Math.min(1, dt * 8);

    for (let i = 0; i < count; i++) {
      const basePos = layout.positions[i];
      const normal = layout.normals[i];
      const phase = layout.phases[i];

      // Ambient bob
      const bob = reduced ? 0 : Math.sin(t * 0.6 + phase) * 0.02;

      // Cursor influence
      let target = 0;
      let tx = 0;
      let ty = 0;
      if (cursorActive.current && !reduced) {
        const dx = basePos.x - cur.x;
        const dy = basePos.y - cur.y;
        const dz = basePos.z - cur.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        const dist = Math.sqrt(distSq);
        if (dist < influence * 2.5) {
          const gauss = Math.exp(-(distSq) / (influence * influence));
          const wave = Math.sin(dist * waveK - t * waveSpeed) * Math.exp(-dist * 0.8) * 0.15;
          target = gauss * strength + wave;
          // tilt toward cursor
          tx = -dy * gauss * 0.6;
          ty = dx * gauss * 0.6;
        }
      }

      // Easing (inertia)
      disp[i] += (target - disp[i]) * easing;
      tiltX[i] += (tx - tiltX[i]) * easing;
      tiltY[i] += (ty - tiltY[i]) * easing;

      const offset = disp[i] + bob;
      dummy.position.set(
        basePos.x + normal.x * offset,
        basePos.y + normal.y * offset,
        basePos.z + normal.z * offset,
      );
      // base orientation: face outward
      tmpM.lookAt(
        dummy.position.clone().add(normal),
        dummy.position,
        tmpUp,
      );
      dummy.quaternion.setFromRotationMatrix(tmpM);
      // apply tilt
      tmpQ.setFromEuler(new THREE.Euler(tiltX[i], tiltY[i], 0));
      dummy.quaternion.multiply(tmpQ);
      const s = 1 + offset * 0.4;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  // Invisible interaction plane in front of dome
  const planeZ = layout.radius + 0.2;

  return (
    <>
      <ambientLight intensity={0.35} color={colors.base} />
      <pointLight ref={lightRef} intensity={2.2} color={colors.accent} distance={14} decay={1.4} />
      <pointLight position={[-4, -2, 3]} intensity={0.9} color={colors.rim} distance={12} decay={1.6} />

      <group ref={groupRef}>
        <instancedMesh
          ref={meshRef}
          args={[geometry, material, count]}
          frustumCulled={false}
        />
      </group>

      {/* Interaction surface — facing camera, large */}
      <mesh
        position={[0, 0, planeZ]}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        visible={false}
      >
        <planeGeometry args={[8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Public component                                                    */
/* ------------------------------------------------------------------ */
export default function DomeField() {
  const reduced = useReducedMotion();
  const webgl = useWebGL();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  if (!webgl) return null;

  const count = isMobile ? 280 : isTablet ? 500 : 880;
  const enableBloom = !isMobile;

  return (
    <Canvas
      dpr={[1, isMobile ? 1.5 : 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.4, 5.6], fov: 45 }}
    >
      <Suspense fallback={null}>
        <Dome count={count} reduced={reduced} enableBloom={enableBloom} />
        {enableBloom && (
          <EffectComposer>
            <Bloom intensity={0.7} luminanceThreshold={0.25} luminanceSmoothing={0.9} mipmapBlur />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
