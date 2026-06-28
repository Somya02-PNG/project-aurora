/**
 * NebulaDivider
 * --------------
 * Full-width decorative divider drawn with Canvas 2D. Renders a faint
 * horizontal nebula line with a soft bloom and a sparse scatter of stars.
 * On entering the viewport it performs a left→right "scan" reveal while
 * fading the whole canvas in. Lightweight: no Three.js, no DOM nodes per
 * star, no continuous animation loop once revealed.
 */

import { useEffect, useRef } from "react";

type GradientStop = readonly [number, string];

interface Star {
  x: number; // normalized 0..1
  yOffset: number; // px from center line
  radius: number;
  opacity: number;
}

const DIVIDER_CONFIG = {
  height: 48,
  lineStops: [
    [0.0, "rgba(124, 58, 237, 0)"],
    [0.15, "rgba(124, 58, 237, 0.06)"],
    [0.35, "rgba(168, 85, 247, 0.18)"],
    [0.5, "rgba(196, 130, 255, 0.32)"],
    [0.65, "rgba(168, 85, 247, 0.18)"],
    [0.85, "rgba(124, 58, 237, 0.06)"],
    [1.0, "rgba(124, 58, 237, 0)"],
  ] as readonly GradientStop[],
  glowStops: [
    [0.0, "rgba(124, 58, 237, 0)"],
    [0.15, "rgba(124, 58, 237, 0.02)"],
    [0.35, "rgba(168, 85, 247, 0.06)"],
    [0.5, "rgba(196, 130, 255, 0.107)"],
    [0.65, "rgba(168, 85, 247, 0.06)"],
    [0.85, "rgba(124, 58, 237, 0.02)"],
    [1.0, "rgba(124, 58, 237, 0)"],
  ] as readonly GradientStop[],
  starCount: 12,
  starRadiusMin: 0.4,
  starRadiusMax: 1.0,
  starOpacityMin: 0.2,
  starOpacityMax: 0.5,
  starYJitter: 6,
  scanDurationMs: 900,
  fadeDurationMs: 600,
  observerThreshold: 0.3,
} as const;

const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

const rand = (min: number, max: number): number =>
  min + Math.random() * (max - min);

const makeStars = (count: number): Star[] =>
  Array.from({ length: count }, () => ({
    x: Math.random(),
    yOffset: rand(-DIVIDER_CONFIG.starYJitter, DIVIDER_CONFIG.starYJitter),
    radius: rand(DIVIDER_CONFIG.starRadiusMin, DIVIDER_CONFIG.starRadiusMax),
    opacity: rand(DIVIDER_CONFIG.starOpacityMin, DIVIDER_CONFIG.starOpacityMax),
  }));

const applyStops = (
  grad: CanvasGradient,
  stops: readonly GradientStop[],
): void => {
  for (const [offset, color] of stops) grad.addColorStop(offset, color);
};

export function NebulaDivider() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const dprRef = useRef<number>(1);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (progress: number): void => {
      const w = canvas.width / dprRef.current;
      const h = canvas.height / dprRef.current;
      ctx.save();
      ctx.scale(dprRef.current, dprRef.current);
      ctx.clearRect(0, 0, w, h);
      const y = h / 2;
      const endX = Math.max(0, Math.min(1, progress)) * w;

      if (endX > 0) {
        // Glow underlay
        const glow = ctx.createLinearGradient(0, y, w, y);
        applyStops(glow, DIVIDER_CONFIG.glowStops);
        ctx.strokeStyle = glow;
        ctx.lineWidth = 18;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(endX, y);
        ctx.stroke();

        // Crisp center line
        const line = ctx.createLinearGradient(0, y, w, y);
        applyStops(line, DIVIDER_CONFIG.lineStops);
        ctx.strokeStyle = line;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(endX, y);
        ctx.stroke();

        // Stars within revealed range
        for (const s of starsRef.current) {
          const sx = s.x * w;
          if (sx > endX) continue;
          ctx.beginPath();
          ctx.arc(sx, y + s.yOffset, s.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220, 200, 255, ${s.opacity})`;
          ctx.fill();
        }
      }
      ctx.restore();
    };

    const resize = (): void => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      dprRef.current = dpr;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(DIVIDER_CONFIG.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${DIVIDER_CONFIG.height}px`;
      starsRef.current = makeStars(DIVIDER_CONFIG.starCount);
    };

    const animate = (now: number): void => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const scanT = Math.min(1, elapsed / DIVIDER_CONFIG.scanDurationMs);
      const fadeT = Math.min(1, elapsed / DIVIDER_CONFIG.fadeDurationMs);
      canvas.style.opacity = String(fadeT);
      draw(easeOutCubic(scanT));
      if (scanT < 1 || fadeT < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        rafRef.current = null;
      }
    };

    const reset = (): void => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      startRef.current = null;
      canvas.style.opacity = "0";
      const ctx2 = canvas.getContext("2d");
      if (ctx2) ctx2.clearRect(0, 0, canvas.width, canvas.height);
    };

    const onResize = (): void => {
      resize();
      // Redraw fully if currently visible (opacity > 0); otherwise stay hidden
      if (parseFloat(canvas.style.opacity || "0") > 0) draw(1);
    };

    resize();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (rafRef.current === null && startRef.current === null) {
              rafRef.current = requestAnimationFrame(animate);
            }
          } else {
            reset();
          }
        }
      },
      { threshold: DIVIDER_CONFIG.observerThreshold },
    );
    observer.observe(container);
    window.addEventListener("resize", onResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="w-full"
      style={{ height: DIVIDER_CONFIG.height }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: 0,
        }}
      />
    </div>
  );
}

export default NebulaDivider;
