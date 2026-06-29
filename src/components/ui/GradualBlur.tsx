import { useEffect, useMemo, useRef, useState } from "react";

type Position = "bottom" | "top";

interface GradualBlurProps {
  position?: Position;
  height?: string;
  strength?: number;
  divCount?: number;
  opacity?: number;
  /** Reserved for parity with React Bits API. */
  curve?: "linear" | "bezier";
  exponential?: boolean;
  animated?: "scroll" | false;
  responsive?: boolean;
  preset?: "smooth" | "default";
  className?: string;
  zIndex?: number;
}

/**
 * GradualBlur — a stacked-layer progressive backdrop-blur band used as a soft
 * seam between sections. Content stays crisp; only the layers behind this
 * band (global background, adjacent section edges) get blurred.
 *
 * Pointer-events: none, aria-hidden. Honors prefers-reduced-motion.
 */
export function GradualBlur({
  position = "bottom",
  height,
  strength = 1.5,
  divCount = 10,
  opacity = 1,
  exponential = true,
  animated = "scroll",
  responsive = true,
  className,
  zIndex = 1,
}: GradualBlurProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [vw, setVw] = useState<number>(() =>
    typeof window === "undefined" ? 1280 : window.innerWidth,
  );
  const [visible, setVisible] = useState(false);
  const [scrollT, setScrollT] = useState(1);

  useEffect(() => {
    const onR = () => setVw(window.innerWidth);
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);

  const isMobile = responsive && vw < 768;
  const isTablet = responsive && vw >= 768 && vw < 1024;

  const count = isMobile ? Math.min(6, divCount) : divCount;
  const effStrength = isMobile ? strength * 0.5 : isTablet ? strength * 0.75 : strength;
  const bandHeight = height ?? (isMobile ? "64px" : isTablet ? "96px" : "128px");

  // Visibility observer to scope will-change
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => setVisible(e.isIntersecting)),
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Scroll-driven strength multiplier (0.6 → 1.0 as band enters viewport center)
  useEffect(() => {
    if (animated !== "scroll" || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = rect.top + rect.height / 2;
      const dist = Math.abs(center - vh / 2) / vh; // 0 = centered
      const t = Math.max(0.6, 1 - Math.min(1, dist) * 0.4);
      setScrollT(t);
    };
    const onS = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onS, { passive: true });
    window.addEventListener("resize", onS);
    return () => {
      window.removeEventListener("scroll", onS);
      window.removeEventListener("resize", onS);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [animated]);

  const layers = useMemo(() => {
    const arr: { blur: number; alpha: number; from: number; to: number }[] = [];
    for (let i = 0; i < count; i++) {
      const p = (i + 1) / count; // 0..1
      const eased = exponential ? Math.pow(p, 2.2) : p;
      const blur = eased * effStrength * 16 * scrollT; // up to ~24px
      // Each layer covers a slice; layer i covers [i/count .. 1]
      const from = i / count;
      arr.push({ blur, alpha: opacity, from, to: 1 });
    }
    return arr;
  }, [count, exponential, effStrength, opacity, scrollT]);

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    height: bandHeight,
    pointerEvents: "none",
    zIndex,
    [position === "bottom" ? "bottom" : "top"]: 0,
  };

  return (
    <div
      ref={ref}
      aria-hidden
      className={className}
      style={baseStyle}
    >
      {layers.map((l, i) => {
        // Build a mask gradient so each layer fades in over its slice
        const dir = position === "bottom" ? "to top" : "to bottom";
        const start = Math.round(l.from * 100);
        const mask = `linear-gradient(${dir}, rgba(0,0,0,1) ${start}%, rgba(0,0,0,0) 100%)`;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              backdropFilter: `blur(${l.blur.toFixed(2)}px)`,
              WebkitMaskImage: mask,
              maskImage: mask,
              willChange: visible ? "backdrop-filter" : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

export default GradualBlur;
