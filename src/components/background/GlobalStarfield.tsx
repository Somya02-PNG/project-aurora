import { useEffect, useRef } from "react";

/**
 * Premium dual-layer particle starfield with energy wave lines.
 * Features silver and blue particles that don't overlap content,
 * plus flowing energy wave lines for a cosmic tech aesthetic.
 */

const CONFIG = {
  // Silver particles (background layer)
  silverCount: 200,
  silverMinRadius: 0.3,
  silverMaxRadius: 1.2,
  silverMinOpacity: 0.06,
  silverMaxOpacity: 0.35,

  // Electric blue particles (accent layer)
  blueCount: 80,
  blueMinRadius: 0.5,
  blueMaxRadius: 1.8,
  blueMinOpacity: 0.1,
  blueMaxOpacity: 0.5,

  // Energy wave lines
  waveCount: 5,
  waveAmplitude: 40,
  waveFrequency: 0.008,
  waveSpeed: 0.3,
  waveOpacity: 0.12,

  // Animation
  driftSpeed: 0.015,
  twinkleAmount: 0.08,
} as const;

interface Particle {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  color: string;
  twinkleSpeed: number;
  twinkleOffset: number;
  driftX: number;
  driftY: number;
  pulsePhase: number;
  pulseSpeed: number;
}

interface EnergyWave {
  y: number;
  amplitude: number;
  frequency: number;
  phase: number;
  speed: number;
  opacity: number;
  color: string;
}

export function GlobalStarfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const wavesRef = useRef<EnergyWave[]>([]);

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

      if (prevW > 0 && prevH > 0) {
        const scaleX = w / prevW;
        const scaleY = h / prevH;
        for (const p of particlesRef.current) {
          p.x *= scaleX;
          p.y *= scaleY;
        }
      }
    };

    const generateParticles = (w: number, h: number) => {
      const particles: Particle[] = [];

      // Silver particles (subtle background layer)
      for (let i = 0; i < CONFIG.silverCount; i++) {
        const radius =
          CONFIG.silverMinRadius +
          Math.random() * (CONFIG.silverMaxRadius - CONFIG.silverMinRadius);
        const opacity =
          CONFIG.silverMinOpacity +
          Math.random() * (CONFIG.silverMaxOpacity - CONFIG.silverMinOpacity);

        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius,
          baseOpacity: opacity,
          color: `rgba(180, 200, 220, `,
          twinkleSpeed: 0.002 + Math.random() * 0.004,
          twinkleOffset: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * CONFIG.driftSpeed,
          driftY: (Math.random() - 0.5) * CONFIG.driftSpeed,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.001 + Math.random() * 0.002,
        });
      }

      // Electric blue particles (accent layer, larger and brighter)
      for (let i = 0; i < CONFIG.blueCount; i++) {
        const radius =
          CONFIG.blueMinRadius +
          Math.random() * (CONFIG.blueMaxRadius - CONFIG.blueMinRadius);
        const opacity =
          CONFIG.blueMinOpacity +
          Math.random() * (CONFIG.blueMaxOpacity - CONFIG.blueMinOpacity);

        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius,
          baseOpacity: opacity,
          color: `rgba(0, 212, 255, `,
          twinkleSpeed: 0.003 + Math.random() * 0.006,
          twinkleOffset: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * CONFIG.driftSpeed * 0.8,
          driftY: (Math.random() - 0.5) * CONFIG.driftSpeed * 0.8,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.002 + Math.random() * 0.003,
        });
      }

      return particles;
    };

    const generateWaves = (h: number) => {
      const waves: EnergyWave[] = [];
      for (let i = 0; i < CONFIG.waveCount; i++) {
        waves.push({
          y: (h / (CONFIG.waveCount + 1)) * (i + 1) + (Math.random() - 0.5) * 100,
          amplitude: CONFIG.waveAmplitude * (0.6 + Math.random() * 0.8),
          frequency: CONFIG.waveFrequency * (0.7 + Math.random() * 0.6),
          phase: Math.random() * Math.PI * 2,
          speed: CONFIG.waveSpeed * (0.8 + Math.random() * 0.4),
          opacity: CONFIG.waveOpacity * (0.7 + Math.random() * 0.6),
          color: i % 2 === 0 ? "rgba(0, 212, 255, " : "rgba(0, 136, 255, ",
        });
      }
      return waves;
    };

    resize();

    if (particlesRef.current.length === 0) {
      particlesRef.current = generateParticles(window.innerWidth, window.innerHeight);
    }
    if (wavesRef.current.length === 0) {
      wavesRef.current = generateWaves(window.innerHeight);
    }

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const now = Date.now();

      // Draw energy wave lines (behind particles)
      for (const wave of wavesRef.current) {
        wave.phase += wave.speed * 0.01;

        ctx.beginPath();
        ctx.moveTo(0, wave.y + Math.sin(wave.phase) * wave.amplitude);

        for (let x = 0; x <= w; x += 4) {
          const y = wave.y + Math.sin(x * wave.frequency + wave.phase) * wave.amplitude;
          ctx.lineTo(x, y);
        }

        const gradient = ctx.createLinearGradient(0, wave.y - wave.amplitude, 0, wave.y + wave.amplitude);
        gradient.addColorStop(0, wave.color + "0)");
        gradient.addColorStop(0.5, wave.color + wave.opacity + ")");
        gradient.addColorStop(1, wave.color + "0)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw particles
      for (const p of particlesRef.current) {
        // Drift movement
        p.x += p.driftX;
        p.y += p.driftY;

        // Wrap around edges
        if (p.x < -p.radius) p.x = w + p.radius;
        if (p.x > w + p.radius) p.x = -p.radius;
        if (p.y < -p.radius) p.y = h + p.radius;
        if (p.y > h + p.radius) p.y = -p.radius;

        // Twinkle effect
        let opacity =
          p.baseOpacity +
          Math.sin(now * p.twinkleSpeed + p.twinkleOffset) * CONFIG.twinkleAmount;

        // Pulse effect for blue particles
        if (p.color.includes("212")) {
          const pulse = Math.sin(now * p.pulseSpeed + p.pulsePhase) * 0.5 + 0.5;
          opacity += pulse * 0.15;

          // Glow effect for blue particles
          const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
          glowGradient.addColorStop(0, `rgba(0, 212, 255, ${opacity * 0.4})`);
          glowGradient.addColorStop(1, "rgba(0, 212, 255, 0)");
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = glowGradient;
          ctx.fill();
        }

        if (opacity < 0.03) opacity = 0.03;
        if (opacity > 0.7) opacity = 0.7;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + opacity + ")";
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
