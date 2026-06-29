import { Canvas } from "@react-three/fiber";
import { Suspense, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  camera?: { position?: [number, number, number]; fov?: number };
  dpr?: [number, number];
  onCreated?: Parameters<typeof Canvas>[0]["onCreated"];
}

export function SceneCanvas({ children, className, camera, dpr = [1, 1.75], onCreated }: Props) {
  return (
    <Canvas
      className={className}
      dpr={dpr}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: camera?.position ?? [0, 0, 6], fov: camera?.fov ?? 55 }}
      onCreated={onCreated}
    >
      <Suspense fallback={null}>{children}</Suspense>
    </Canvas>
  );
}

