import { useEffect, useRef } from "react";

/**
 * Site-wide fixed background: deep navy gradient base + static blue glow blobs
 * + 280-particle cyan ambient field with proximity lines. Pure visuals.
 */

const COUNT = 280;
const LINK_DIST = 100;

interface P {
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
  const partsRef = useRef<P[]>([]);

  useEffect(() => {
    if (reducedMotion()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

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
      const arr: P[] = [];
      for (let i = 0; i < COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.1 + Math.random() * 0.2;
        arr.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 1 + Math.random(),
          a: 0.5 + Math.random() * 0.4,
        });
      }
      partsRef.current = arr;
    };

    resize();
    seed();

    let running = true;
    const tick = () => {
      if (!running) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const ps = partsRef.current;
      // particles
      for (const p of ps) {
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
      // links
      ctx.lineWidth = 1;
      for (let i = 0; i < ps.length; i++) {
        const a = ps[i];
        for (let j = i + 1; j < ps.length; j++) {
          const b = ps[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const alpha = 0.06 * (1 - Math.sqrt(d2) / LINK_DIST);
            ctx.strokeStyle = `rgba(0,180,255,${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
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
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div
      aria-hidden
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    >
      {/* Layer 1 — base gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 30% 20%, #0A1628 0%, #041020 40%, #020B18 70%, #010810 100%)",
        }}
      />
      {/* Layer 3 — static glow blobs */}
      <div
        style={{
          position: "absolute",
          top: "-200px",
          left: "-200px",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "rgba(0,80,200,0.06)",
          filter: "blur(120px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 800,
          height: 800,
          marginTop: -400,
          marginLeft: -400,
          borderRadius: "50%",
          background: "rgba(0,60,180,0.04)",
          filter: "blur(120px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-150px",
          right: "-150px",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(0,100,220,0.05)",
          filter: "blur(120px)",
        }}
      />
      {/* Layer 2 — particle canvas */}
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
