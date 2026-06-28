import { useEffect, useRef } from "react";

/** Slow-drifting Canvas 2D starfield fixed behind the entire page. */

const STARFIELD_CONFIG = {
  count: 280,
  minRadius: 0.2,
  maxRadius: 1.1,
  minOpacity: 0.08,
  maxOpacity: 0.45,
  minSpeed: 0.02,
  maxSpeed: 0.08,
  twinkleAmount: 0.06,
} as const;

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
  direction: number;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export function GlobalStarfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const prevW = canvas.width / dpr;
      const prevH = canvas.height / dpr;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // On first resize (prevW === 0), generate stars fresh.
      // Otherwise, scale existing star positions proportionally.
      if (prevW > 0 && prevH > 0) {
        const scaleX = w / prevW;
        const scaleY = h / prevH;
        for (const s of starsRef.current) {
          s.x *= scaleX;
          s.y *= scaleY;
        }
      }
    };

    const generateStars = (w: number, h: number) => {
      const arr: Star[] = [];
      for (let i = 0; i < STARFIELD_CONFIG.count; i++) {
        const radius =
          STARFIELD_CONFIG.minRadius +
          Math.random() * (STARFIELD_CONFIG.maxRadius - STARFIELD_CONFIG.minRadius);
        const opacity =
          STARFIELD_CONFIG.minOpacity +
          Math.random() * (STARFIELD_CONFIG.maxOpacity - STARFIELD_CONFIG.minOpacity);
        arr.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius,
          opacity,
          speed:
            STARFIELD_CONFIG.minSpeed +
            Math.random() * (STARFIELD_CONFIG.maxSpeed - STARFIELD_CONFIG.minSpeed),
          direction: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.003 + Math.random() * 0.005,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
      return arr;
    };

    resize();

    // If stars array is empty, generate fresh stars.
    if (starsRef.current.length === 0) {
      starsRef.current = generateStars(
        window.innerWidth,
        window.innerHeight,
      );
    }

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const now = Date.now();
      for (const s of starsRef.current) {
        s.x += Math.cos(s.direction) * s.speed;
        s.y += Math.sin(s.direction) * s.speed;

        if (s.x < 0) s.x = w;
        if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h;
        if (s.y > h) s.y = 0;

        let currentOpacity =
          s.opacity + Math.sin(now * s.twinkleSpeed + s.twinkleOffset) * STARFIELD_CONFIG.twinkleAmount;
        if (currentOpacity < 0.04) currentOpacity = 0.04;
        if (currentOpacity > 0.5) currentOpacity = 0.5;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        background: "transparent",
      }}
      aria-hidden="true"
    />
  );
}
