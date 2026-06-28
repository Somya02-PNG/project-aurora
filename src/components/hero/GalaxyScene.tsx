import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDevicePerformance } from "@/hooks/useDevicePerformance";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const SCENE_CONFIG = {
  bg: "#020008",
  starCount: 10000,
  starCountLow: 5000,
  starShellRadius: 80,
  driftFraction: 0.15,
  driftSpeed: 0.0003,
  twinkleFraction: 0.05,
  nebulaRotSpeed: 0.00008,
  centralRadius: 2.2,
  centralColor: "#0a0020",
  centralEmissive: "#2d0060",
  centralEmissiveIntensity: 0.08,
  ringRadius: 3.5,
  ringTube: 0.018,
  ringColor: "#b0b0c0",
  ringTilt: -0.4,
  ringSpeed: 0.0004,
  moons: [
    { r: 3.2, size: 0.22, color: "#1a1a24", speed: 0.0012, incl: 0.15 },
    { r: 4.5, size: 0.28, color: "#141420", speed: 0.0008, incl: -0.25 },
    { r: 5.8, size: 0.18, color: "#1a1a24", speed: 0.0006, incl: 0.4 },
  ],
  dustCount: 3000,
  dustInner: 4.2,
  dustOuter: 9,
  cameraIdleSpeed: 0.00015,
} as const;

/** Builds a radial soft-disk RGBA texture used by nebula sprites. */
function makeRadialTexture(color: string, inner = 0.0, outer = 0.55): THREE.Texture {
  const size = 256;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, size * inner, size / 2, size / 2, size * outer);
  g.addColorStop(0, color);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.needsUpdate = true;
  return t;
}

/** Procedural greyscale bump texture giving the central body subtle relief. */
function makeBumpTexture(): THREE.Texture {
  const size = 512;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 90 + Math.floor(Math.random() * 70);
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2, 2);
  return t;
}

/** Instanced star field; majority static, a fraction drifts, a fraction twinkles. */
function StarField({ count }: { count: number }) {
  const staticRef = useRef<THREE.InstancedMesh>(null);
  const driftRef = useRef<THREE.InstancedMesh>(null);

  const { staticData, driftData, twinkleIdx } = useMemo(() => {
    const driftN = Math.floor(count * SCENE_CONFIG.driftFraction);
    const staticN = count - driftN;
    const mkBatch = (n: number) => {
      const matrices: THREE.Matrix4[] = [];
      const colors: THREE.Color[] = [];
      const m = new THREE.Matrix4();
      const q = new THREE.Quaternion();
      const s = new THREE.Vector3();
      const p = new THREE.Vector3();
      for (let i = 0; i < n; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = SCENE_CONFIG.starShellRadius * (0.55 + Math.random() * 0.45);
        p.set(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
        const roll = Math.random();
        const size = roll < 0.8 ? 0.04 + Math.random() * 0.03 : roll < 0.95 ? 0.07 + Math.random() * 0.04 : 0.12 + Math.random() * 0.08;
        s.set(size, size, size);
        m.compose(p, q, s);
        matrices.push(m.clone());
        const tint = 0.85 + Math.random() * 0.15;
        const blue = 0.95 + Math.random() * 0.05;
        colors.push(new THREE.Color(tint, tint, blue));
      }
      return { matrices, colors };
    };
    const s = mkBatch(staticN);
    const d = mkBatch(driftN);
    const tw = new Set<number>();
    const twN = Math.floor(staticN * SCENE_CONFIG.twinkleFraction);
    while (tw.size < twN) tw.add(Math.floor(Math.random() * staticN));
    return { staticData: s, driftData: d, twinkleIdx: Array.from(tw) };
  }, [count]);

  useEffect(() => {
    const apply = (mesh: THREE.InstancedMesh | null, data: { matrices: THREE.Matrix4[]; colors: THREE.Color[] }) => {
      if (!mesh) return;
      data.matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
      data.colors.forEach((c, i) => mesh.setColorAt(i, c));
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    };
    apply(staticRef.current, staticData);
    apply(driftRef.current, driftData);
  }, [staticData, driftData]);

  const tmpColor = useMemo(() => new THREE.Color(), []);
  useFrame((_, dt) => {
    if (driftRef.current) driftRef.current.rotation.y += SCENE_CONFIG.driftSpeed * (dt * 60);
    const sm = staticRef.current;
    if (sm && sm.instanceColor) {
      const t = performance.now() * 0.002;
      for (const i of twinkleIdx) {
        const base = staticData.colors[i];
        const f = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t + i));
        tmpColor.setRGB(base.r * f, base.g * f, base.b * f);
        sm.setColorAt(i, tmpColor);
      }
      sm.instanceColor.needsUpdate = true;
    }
  });

  const geom = useMemo(() => new THREE.SphereGeometry(1, 6, 6), []);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ffffff", toneMapped: false }), []);
  useEffect(() => () => {
    geom.dispose();
    mat.dispose();
  }, [geom, mat]);

  return (
    <>
      <instancedMesh ref={staticRef} args={[geom, mat, staticData.matrices.length]} frustumCulled={false} />
      <instancedMesh ref={driftRef} args={[geom, mat, driftData.matrices.length]} frustumCulled={false} />
    </>
  );
}

/** 3 huge translucent nebula sprites placed far back, rotating imperceptibly. */
function Nebula() {
  const group = useRef<THREE.Group>(null);
  const textures = useMemo(
    () => [
      makeRadialTexture("rgba(45, 0, 90, 0.7)"),
      makeRadialTexture("rgba(26, 0, 64, 0.6)"),
      makeRadialTexture("rgba(0, 35, 70, 0.6)"),
    ],
    [],
  );
  useEffect(() => () => textures.forEach((t) => t.dispose()), [textures]);
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.z += SCENE_CONFIG.nebulaRotSpeed * (dt * 60);
  });
  return (
    <group ref={group}>
      <sprite position={[-12, 4, -30]} scale={[40, 40, 1]}>
        <spriteMaterial map={textures[0]} color="#3d0070" opacity={0.07} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <sprite position={[10, -6, -35]} scale={[48, 48, 1]}>
        <spriteMaterial map={textures[1]} color="#1a0040" opacity={0.05} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <sprite position={[2, 8, -40]} scale={[55, 55, 1]}>
        <spriteMaterial map={textures[2]} color="#001830" opacity={0.04} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  );
}

/** Central rocky body, ring, and orbiting moons. */
function CentralSystem() {
  const ring = useRef<THREE.Mesh>(null);
  const moonRefs = useRef<THREE.Mesh[]>([]);
  const angles = useRef<number[]>(SCENE_CONFIG.moons.map(() => Math.random() * Math.PI * 2));
  const bump = useMemo(makeBumpTexture, []);

  useEffect(() => () => bump.dispose(), [bump]);

  useFrame((_, dt) => {
    const f = dt * 60;
    if (ring.current) ring.current.rotation.y += SCENE_CONFIG.ringSpeed * f;
    SCENE_CONFIG.moons.forEach((m, i) => {
      angles.current[i] += m.speed * f;
      const mesh = moonRefs.current[i];
      if (!mesh) return;
      const a = angles.current[i];
      mesh.position.set(Math.cos(a) * m.r, Math.sin(a) * m.r * Math.sin(m.incl), Math.sin(a) * m.r * Math.cos(m.incl));
    });
  });

  return (
    <group>
      <mesh>
        <sphereGeometry args={[SCENE_CONFIG.centralRadius, 64, 64]} />
        <meshStandardMaterial
          color={SCENE_CONFIG.centralColor}
          roughness={0.85}
          metalness={0.1}
          emissive={SCENE_CONFIG.centralEmissive}
          emissiveIntensity={SCENE_CONFIG.centralEmissiveIntensity}
          bumpMap={bump}
          bumpScale={0.04}
        />
      </mesh>
      <mesh ref={ring} rotation={[SCENE_CONFIG.ringTilt, 0, 0]}>
        <torusGeometry args={[SCENE_CONFIG.ringRadius, SCENE_CONFIG.ringTube, 16, 220]} />
        <meshBasicMaterial color={SCENE_CONFIG.ringColor} transparent opacity={0.25} />
      </mesh>
      {SCENE_CONFIG.moons.map((m, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) moonRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[m.size, 24, 24]} />
          <meshStandardMaterial color={m.color} roughness={0.9} metalness={0.05} />
        </mesh>
      ))}
    </group>
  );
}

/** Belt of fine dust slowly spiralling outward in the central plane. */
function DustBelt() {
  const ref = useRef<THREE.Points>(null);
  const { positions, radii, angles } = useMemo(() => {
    const n = SCENE_CONFIG.dustCount;
    const p = new Float32Array(n * 3);
    const r = new Float32Array(n);
    const a = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const radius = SCENE_CONFIG.dustInner + Math.random() * (SCENE_CONFIG.dustOuter - SCENE_CONFIG.dustInner);
      const ang = Math.random() * Math.PI * 2;
      r[i] = radius;
      a[i] = ang;
      p[i * 3] = Math.cos(ang) * radius;
      p[i * 3 + 1] = (Math.random() - 0.5) * 0.25;
      p[i * 3 + 2] = Math.sin(ang) * radius;
    }
    return { positions: p, radii: r, angles: a };
  }, []);

  useFrame((_, dt) => {
    const pts = ref.current;
    if (!pts) return;
    const attr = pts.geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const f = dt * 60;
    for (let i = 0; i < radii.length; i++) {
      angles[i] += 0.0005 * f;
      radii[i] += 0.0008 * f;
      if (radii[i] > SCENE_CONFIG.dustOuter) radii[i] = SCENE_CONFIG.dustInner;
      arr[i * 3] = Math.cos(angles[i]) * radii[i];
      arr[i * 3 + 2] = Math.sin(angles[i]) * radii[i];
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#ffffff" transparent opacity={0.15} depthWrite={false} sizeAttenuation />
    </points>
  );
}

interface RigProps {
  worldRef: React.RefObject<THREE.Group | null>;
  rootEl: HTMLElement | null;
}

/** Camera rig: intro pull-back, idle Y orbit, scroll-driven push & tilt. */
function CameraRig({ worldRef, rootEl }: RigProps) {
  const { camera } = useThree();
  const angle = useRef(0);
  const orbit = useRef({ radius: 12, height: 0, tilt: 0 });
  const sceneState = useRef({ scale: 1, opacity: 1 });

  useEffect(() => {
    camera.position.set(0, 0, 8);
    const obj = { z: 8 };
    const intro = gsap.to(obj, {
      z: 12,
      duration: 3,
      ease: "power2.out",
      onUpdate: () => {
        orbit.current.radius = obj.z;
      },
    });
    let st: ScrollTrigger | undefined;
    if (rootEl) {
      const proxy = { radius: 12, height: 0, tilt: 0, scale: 1, opacity: 1 };
      const tween = gsap.to(proxy, {
        radius: 16,
        height: 1.5,
        tilt: 0.18,
        scale: 0.7,
        opacity: 0.6,
        ease: "none",
        scrollTrigger: {
          trigger: rootEl,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        onUpdate: () => {
          orbit.current.radius = proxy.radius;
          orbit.current.height = proxy.height;
          orbit.current.tilt = proxy.tilt;
          sceneState.current.scale = proxy.scale;
          sceneState.current.opacity = proxy.opacity;
        },
      });
      st = tween.scrollTrigger;
    }
    return () => {
      intro.kill();
      st?.kill();
    };
  }, [camera, rootEl]);

  useFrame((_, dt) => {
    angle.current += SCENE_CONFIG.cameraIdleSpeed * (dt * 60);
    const { radius, height, tilt } = orbit.current;
    camera.position.x = Math.sin(angle.current) * radius * 0.15 + radius * Math.sin(angle.current) * 0.0;
    camera.position.x = Math.sin(angle.current) * 0.6;
    camera.position.y = height;
    camera.position.z = radius;
    camera.lookAt(0, -tilt, 0);
    const w = worldRef.current;
    if (w) {
      const s = sceneState.current.scale;
      w.scale.setScalar(s);
      w.traverse((o) => {
        const mesh = o as THREE.Mesh;
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (!mat) return;
        const setOp = (m: THREE.Material) => {
          m.transparent = true;
          (m as THREE.Material & { opacity: number }).opacity =
            Math.min(1, sceneState.current.opacity) *
            ((m.userData.baseOpacity as number | undefined) ?? 1);
        };
        if (Array.isArray(mat)) mat.forEach(setOp);
        else setOp(mat);
      });
    }
  });
  return null;
}

interface GalaxySceneProps {
  rootEl: HTMLElement | null;
}

/** Full r3f deep-space scene composed of star field, nebula, central system, dust, and rig. */
export function GalaxyScene({ rootEl }: GalaxySceneProps) {
  const perf = useDevicePerformance();
  const worldRef = useRef<THREE.Group>(null);
  const stars = perf === "low" ? SCENE_CONFIG.starCountLow : SCENE_CONFIG.starCount;
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 55, near: 0.1, far: 200, position: [0, 0, 8] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => gl.setClearColor(SCENE_CONFIG.bg, 1)}
    >
      <ambientLight color="#0a0020" intensity={0.2} />
      <directionalLight color="#ffffff" intensity={0.6} position={[5, 3, 5]} />
      <group ref={worldRef}>
        <StarField count={stars} />
        <Nebula />
        <CentralSystem />
        <DustBelt />
      </group>
      <CameraRig worldRef={worldRef} rootEl={rootEl} />
      <EffectComposer>
        <Bloom intensity={0.3} luminanceThreshold={0.85} luminanceSmoothing={0.4} radius={0.4} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
