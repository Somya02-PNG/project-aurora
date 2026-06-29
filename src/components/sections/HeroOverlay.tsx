import { lazy, Suspense, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { markReady } from "@/lib/appReady";


const DomeField = lazy(() => import("@/components/3d/DomeField"));


/** Hero: centered copy + CTAs over the dark starfield background. */
export function HeroOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const domeWrapRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    markReady("video");
    markReady("scene");
  }, []);

  // Scroll-synced fade: as the hero scrolls out, dim the dome and intensify
  // the bottom-to-background fade so there is never a hard seam with AboutSection.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const sec = sectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const start = vh * 0.55;
      const raw = 1 - rect.bottom / start;
      const p = Math.max(0, Math.min(1, raw));
      if (domeWrapRef.current) {
        domeWrapRef.current.style.opacity = String(1 - p * 0.95);
        domeWrapRef.current.style.transform = `translate(-50%, ${p * 6}vh)`;
      }
      if (fadeRef.current) {
        fadeRef.current.style.opacity = String(0.55 + p * 0.45);
      }
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

      {/* Top vignette to keep text legible */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,4,8,0.6) 0%, rgba(2,4,8,0) 40%, rgba(2,4,8,0) 100%)",
        }}
      />

      {/* Bottom blend — softly fades hero + dome edge into the global background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[4]"
        style={{
          height: "30vh",
          background:
            "linear-gradient(to bottom, rgba(2,4,8,0) 0%, rgba(2,4,8,0.55) 55%, #020408 100%)",
        }}
      />


      <div
        ref={ref}
        className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center justify-start px-6 pt-28 pb-12 text-center"
        style={{ minHeight: "100vh" }}
      >

        {/* LEFT — copy + CTAs */}
        <div className="max-w-xl">
          <div
            data-h-eye
            style={{
              fontSize: 12,
              letterSpacing: "0.32em",
              color: "#8B5CF6",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: 22,
            }}
          >
            DIMISI Technologies
          </div>
          <h1
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 700,
              color: "#FFFFFF",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginBottom: 26,
            }}
          >
            {headline.map((w, i) => (
              <span key={i} data-h-word style={{ display: "inline-block", marginRight: "0.3em" }}>
                {w}
              </span>
            ))}
          </h1>
          <p
            data-h-sub
            style={{
              fontSize: 17,
              color: "#8aa8c8",
              maxWidth: 520,
              lineHeight: 1.65,
              marginBottom: 36,
            }}
          >
            We build scalable, AI-powered digital products for the companies shaping what comes next.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              data-h-btn
              to="/contact"
              className="hero-btn-primary"
              style={{
                background: "#8B5CF6",
                color: "#FFFFFF",
                padding: "14px 30px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                boxShadow: "0 12px 36px rgba(139,92,246,0.40)",
                transition: "all 0.2s ease",
              }}
            >
              Book Consultation
            </Link>
            <Link
              data-h-btn
              to="/case-studies"
              className="hero-btn-secondary"
              style={{
                background: "rgba(139,92,246,0.06)",
                color: "#FFFFFF",
                padding: "14px 30px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                border: "1px solid rgba(139,92,246,0.32)",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              View Our Work
            </Link>
          </div>
        </div>

      </div>

      <style>{`
        .hero-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 18px 44px rgba(139,92,246,0.55); }
        .hero-btn-secondary:hover { border-color: rgba(139,92,246,0.6) !important; background: rgba(139,92,246,0.12) !important; }
      `}</style>
    </section>
  );
}
