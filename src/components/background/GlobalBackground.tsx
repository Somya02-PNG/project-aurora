import { useEffect, useRef } from "react";

/**
 * Minimal site-wide background:
 *  - solid #020408 base with a subtle radial toward #060d1a
 *  - ~180 tiny static star pinpoints (no animation)
 *  - 2 faint corner radial glows (#0d2644, 8-12% opacity)
 *  - grain overlay (3-5% opacity)
 * Pointer-events none, fixed, sits behind all content (z-index -1).
 */

const STAR_COUNT = 180;

interface Star {
  x: number;
  y: number;
  r: number;
  a: number;
  c: string;
}

export function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const COLORS = ["#FFFFFF", "#B0C8FF"];
    let stars: Star[] = [];

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.4 + Math.random() * 0.8,
          a: 0.15 + Math.random() * 0.1,
          c: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    };

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        ctx.globalAlpha = s.a;
        ctx.fillStyle = s.c;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    resize();
    seed();
    draw();

    const onResize = () => {
      resize();
      seed();
      draw();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Base — continuous deep navy radial, no hard stops */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 35%, #071326 0%, #040a18 55%, #020610 100%)",
        }}
      />
      {/* Top-left ambient blue glow */}
      <div
        style={{
          position: "absolute",
          left: -280,
          top: -280,
          width: 880,
          height: 880,
          borderRadius: "50%",
          background: "rgba(59,130,246,0.18)",
          opacity: 0.55,
          filter: "blur(180px)",
        }}
      />
      {/* Bottom-right ambient cyan-blue glow */}
      <div
        style={{
          position: "absolute",
          right: -300,
          bottom: -300,
          width: 920,
          height: 920,
          borderRadius: "50%",
          background: "rgba(34,211,238,0.10)",
          opacity: 0.5,
          filter: "blur(200px)",
        }}
      />
      {/* Stars */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100vw",
          height: "100vh",
        }}
      />
      {/* Grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          mixBlendMode: "overlay",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  );
}
