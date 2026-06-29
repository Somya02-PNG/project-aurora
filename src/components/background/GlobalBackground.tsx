import { useEffect, useRef } from "react";

/**
 * Site-wide fixed canvas: deep space gradient base (with slow breathe),
 * 600 static stars, 3 nebula glow clouds, 200 drifting cyan particles.
 * Pure visuals — pointer-events: none. Stays fixed behind the whole site.
 */

const STAR_COUNT = 600;
const PARTICLE_COUNT = 200;

interface Star {
  x: number;
  y: number;
  r: number;
  a: number;
  c: string;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
}

function reducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function GlobalBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);
  const partsRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = reducedMotion();

    const dpr = window.devicePixelRatio || 1;
    const STAR_COLORS = ["#FFFFFF", "#B0C8FF", "#80AAFF"];

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
      const stars: Star[] = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.5 + Math.random(),
          a: 0.3 + Math.random() * 0.6,
          c: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        });
      }
      starsRef.current = stars;

      const parts: Particle[] = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.08 + Math.random() * 0.12;
        parts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 1 + Math.random(),
          a: 0.15 + Math.random() * 0.3,
        });
      }
      partsRef.current = parts;
    };

    resize();
    seed();

    const drawStatic = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      // stars
      for (const s of starsRef.current) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.c;
        ctx.globalAlpha = s.a;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    if (reduced) {
      drawStatic();
      const onResize = () => {
        resize();
        seed();
        drawStatic();
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    let running = true;
    const tick = () => {
      if (!running) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      // Static stars
      for (const s of starsRef.current) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.c;
        ctx.globalAlpha = s.a;
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Drifting cyan particles
      for (const p of partsRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        else if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        else if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,180,255,${p.a})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const onResize = () => {
      resize();
      seed();
    };
    window.addEventListener("resize", onResize);
    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafRef.current);
      } else if (!running) {
        running = true;
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
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
      {/* Layer 1 — deep space gradient with slow breathe */}
      <div
        className="bg-breathe"
        style={{
          position: "absolute",
          inset: "-6%",
          background:
            "radial-gradient(ellipse at 40% 30%, #0D1B35 0%, #061020 35%, #030810 65%, #010508 100%)",
          transformOrigin: "center center",
          willChange: "transform",
        }}
      />
      {/* Layer 3 — nebula glow clouds (static) */}
      <div
        style={{
          position: "absolute",
          left: "20%",
          top: "30%",
          width: 700,
          height: 700,
          marginLeft: -350,
          marginTop: -350,
          borderRadius: "50%",
          background: "rgba(0,80,200,0.12)",
          filter: "blur(150px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "75%",
          top: "60%",
          width: 900,
          height: 900,
          marginLeft: -450,
          marginTop: -450,
          borderRadius: "50%",
          background: "rgba(0,40,150,0.08)",
          filter: "blur(200px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "85%",
          width: 600,
          height: 600,
          marginLeft: -300,
          marginTop: -300,
          borderRadius: "50%",
          background: "rgba(0,60,180,0.06)",
          filter: "blur(120px)",
        }}
      />
      {/* Layers 2 + 4 — stars and drifting particles on canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100vw",
          height: "100vh",
        }}
      />
    </div>
  );
}
