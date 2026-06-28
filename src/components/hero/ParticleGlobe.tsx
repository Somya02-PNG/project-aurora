import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Particle globe + grid network hero background.
 * Canvas2D, runs an 8s camera choreography once on mount, then ambient.
 */
export function ParticleGlobe() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COLORS = ["#4A6CF7", "#7B5EA7", "#C0C0FF"];
    const PARTICLE_COUNT = 400;
    const start = performance.now();

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Fibonacci sphere
    type P = {
      x: number;
      y: number;
      z: number;
      size: number;
      color: string;
      pulse: number;
      dx: number;
      dy: number;
    };
    const parts: P[] = [];
    const phi = Math.PI * (Math.sqrt(5) - 1);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = phi * i;
      parts.push({
        x: Math.cos(t) * r,
        y,
        z: Math.sin(t) * r,
        size: 1 + Math.random() * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        pulse: Math.random() * Math.PI * 2,
        dx: 0,
        dy: 0,
      });
    }

    // Grid nodes (revealed in phase 2)
    type N = { x: number; y: number; lit: number };
    const NODE_COLS = 9;
    const NODE_ROWS = 4;
    const nodes: N[] = [];
    for (let r = 0; r < NODE_ROWS; r++) {
      for (let c = 0; c < NODE_COLS; c++) {
        nodes.push({
          x: (c + 0.5) / NODE_COLS,
          y: 0.55 + (r / (NODE_ROWS - 1)) * 0.4,
          lit: 0,
        });
      }
    }

    let rotY = 0;
    let mx = 0;
    let my = 0;
    let tx = 0;
    let ty = 0;
    let scrollY = 0;

    const onMouse = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 50; // ±25
      ty = (e.clientY / window.innerHeight - 0.5) * 30; // ±15
    };
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    const easeOutExpo = (t: number) =>
      t === 0 ? 0 : t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    const easeInOut = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    let raf = 0;
    const tick = (now: number) => {
      const elapsed = (now - start) / 1000;

      // Camera scale + translateY per phase
      let scale: number;
      let trY: number;
      if (elapsed < 3) {
        scale = 0.6 + (1.4 - 0.6) * easeOutExpo(elapsed / 3);
        trY = 0;
      } else if (elapsed < 5.5) {
        scale = 1.4;
        trY = 80 * easeOutExpo((elapsed - 3) / 2.5);
      } else if (elapsed < 8) {
        scale = 1.4 + (1.0 - 1.4) * easeInOut((elapsed - 5.5) / 2.5);
        trY = 80;
      } else {
        scale = 1.0;
        trY = 80;
      }

      // Light up grid nodes top→bottom during phase 2
      const gridReveal =
        elapsed < 3 ? 0 : Math.min(1, (elapsed - 3) / 2.5);
      nodes.forEach((n, i) => {
        const target = n.y < 0.55 + gridReveal * 0.4 ? 1 : 0;
        n.lit += (target - n.lit) * 0.08;
        // unused index var
        void i;
      });

      // Mouse parallax lerp
      mx += (tx - mx) * 0.06;
      my += (ty - my) * 0.06;

      ctx.clearRect(0, 0, w, h);

      // Scroll fade-out for hero canvas itself
      const fade = Math.max(0, 1 - scrollY / 200);
      if (fade <= 0.01) {
        raf = requestAnimationFrame(tick);
        return;
      }
      ctx.globalAlpha = fade;

      const cx = w / 2 + mx;
      const cy = h / 2 + my - scrollY * 0.3 + trY;
      const radius = Math.min(w, h) * 0.34 * scale;

      // Halo glow
      const halo = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 2.2);
      halo.addColorStop(0, "rgba(74,108,247,0.08)");
      halo.addColorStop(1, "rgba(74,108,247,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      // Grid layer (under globe)
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const ax = a.x * w;
        const ay = a.y * h;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          if (Math.abs(a.y - b.y) < 0.001 && Math.abs(a.x - b.x) < 1 / NODE_COLS + 0.001) {
            const bx = b.x * w;
            const by = b.y * h;
            const lit = Math.min(a.lit, b.lit);
            ctx.strokeStyle = `rgba(74,108,247,${0.05 + lit * 0.12})`;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          } else if (
            Math.abs(a.x - b.x) < 0.001 &&
            Math.abs(a.y - b.y) < 1 / NODE_ROWS + 0.001
          ) {
            const bx = b.x * w;
            const by = b.y * h;
            const lit = Math.min(a.lit, b.lit);
            ctx.strokeStyle = `rgba(74,108,247,${0.05 + lit * 0.12})`;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        const nx = n.x * w;
        const ny = n.y * h;
        if (n.lit > 0.02) {
          ctx.shadowColor = "#4A6CF7";
          ctx.shadowBlur = 12 * n.lit;
          ctx.fillStyle = `rgba(74,108,247,${0.4 + n.lit * 0.6})`;
          ctx.beginPath();
          ctx.arc(nx, ny, 2 + n.lit * 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Rotate + project particles
      rotY += 0.002;
      const sinR = Math.sin(rotY);
      const cosR = Math.cos(rotY);

      const projected: { sx: number; sy: number; depth: number; p: P }[] = [];
      for (const p of parts) {
        p.dx += (Math.random() - 0.5) * 0.4;
        p.dy += (Math.random() - 0.5) * 0.4;
        p.dx *= 0.92;
        p.dy *= 0.92;
        const rx = p.x * cosR + p.z * sinR;
        const rz = -p.x * sinR + p.z * cosR;
        const depth = (rz + 1) / 2; // 0 back, 1 front
        const sx = cx + rx * radius + p.dx;
        const sy = cy + p.y * radius + p.dy;
        projected.push({ sx, sy, depth, p });
      }

      // Webbing — connect each to 3 nearest within 120px
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(100,120,255,0.15)";
      for (let i = 0; i < projected.length; i += 2) {
        const a = projected[i];
        const dists: { j: number; d: number }[] = [];
        for (let j = 0; j < projected.length; j++) {
          if (i === j) continue;
          const dx = projected[j].sx - a.sx;
          const dy = projected[j].sy - a.sy;
          const d = Math.hypot(dx, dy);
          if (d < 120) dists.push({ j, d });
        }
        dists.sort((x, y) => x.d - y.d);
        for (let k = 0; k < Math.min(3, dists.length); k++) {
          const b = projected[dists[k].j];
          ctx.globalAlpha = fade * (1 - dists[k].d / 120) * 0.6;
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(b.sx, b.sy);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = fade;

      // Draw particles
      const tNow = elapsed;
      for (const { sx, sy, depth, p } of projected) {
        p.pulse += 0.04;
        const pulseO = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(p.pulse + tNow));
        const size = p.size * (0.55 + depth * 0.85);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = fade * pulseO * (0.35 + depth * 0.65);
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(tick);
    };

    if (!reduced) raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        background: "#060608",
      }}
    />
  );
}
