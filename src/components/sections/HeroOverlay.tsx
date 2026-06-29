import { lazy, Suspense, useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { markReady } from "@/lib/appReady";

const DomeField = lazy(() => import("@/components/3d/DomeField"));

/** Hero: centered copy + CTAs over the dark starfield background. */
export function HeroOverlay() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    markReady("video");
    markReady("scene");
  }, []);

  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  const domeHeight = isMobile ? "62vh" : isTablet ? "68vh" : "72vh";
  const domeWidth = isMobile ? "150vw" : isTablet ? "120vw" : "110vw";

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100vh", background: "transparent" }}
    >
      {/* Dome anchored to the bottom of the hero, full bleed */}
      <div
        className="absolute left-1/2 z-[2] -translate-x-1/2"
        style={{ bottom: 0, width: domeWidth, height: domeHeight }}
      >
        <Suspense fallback={null}>
          <DomeField />
        </Suspense>
      </div>

      {/* Soft top legibility veil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(4,10,24,0.35) 0%, rgba(4,10,24,0) 38%, rgba(4,10,24,0) 100%)",
        }}
      />

      {/* Soft bottom transparency — reduced; GradualBlur band handles the seam */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[4]"
        style={{
          height: "24vh",
          background:
            "linear-gradient(to bottom, rgba(4,10,24,0) 0%, rgba(4,10,24,0.10) 60%, rgba(4,10,24,0.14) 100%)",
        }}
      />


      <div
        ref={ref}
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-5 pb-12 text-center sm:px-6"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-full">
          {/* Premium glass badge */}
          <div
            className="hero-badge"
            style={{
              opacity: 1,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 16px",
              borderRadius: 999,
              background: "rgba(59,130,246,0.06)",
              backdropFilter: "blur(12px) saturate(140%)",
              border: "1px solid rgba(59,130,246,0.28)",
              boxShadow:
                "0 0 24px rgba(59,130,246,0.18), inset 0 0 0 1px rgba(255,255,255,0.04)",
              marginBottom: 28,
            }}
          >
            <span
              aria-hidden
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "#3B82F6",
                boxShadow: "0 0 10px rgba(59,130,246,0.9)",
                animation: "heroBadgePulse 2.4s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontSize: isMobile ? 10 : 11,
                letterSpacing: "0.32em",
                color: "#93C5FD",
                textTransform: "uppercase",
                fontWeight: 600,
                lineHeight: 1,
              }}
            >
              DIMISI Technologies
            </span>
          </div>

          {/* Headline */}
          <h1
            className="hero-headline"
            style={{
              opacity: 1,
              fontSize: "clamp(40px, 7.2vw, 88px)",
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              marginBottom: 28,
              textWrap: "balance" as React.CSSProperties["textWrap"],
              textShadow: "0 1px 24px rgba(59,130,246,0.18)",
            }}
          >
            <span style={{ color: "#FFFFFF" }}>From Ideas to</span>
            <br className="hidden sm:inline" />{" "}
            <span className="hero-grad">Intelligent Software</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              opacity: 1,
              fontSize: "clamp(15px, 1.25vw, 18px)",
              color: "#A8C0DC",
              maxWidth: 560,
              margin: "0 auto 40px",
              lineHeight: 1.7,
              letterSpacing: "0.01em",
              textWrap: "pretty" as React.CSSProperties["textWrap"],
            }}
          >
            We build scalable, AI-powered digital products for the companies shaping what
            comes next.
          </p>

          <div className="flex flex-wrap items-center justify-center" style={{ gap: 14 }}>
            <Link
              to="/contact"
              className="hero-btn-primary"
              style={{
                opacity: 1,
                background: "#3B82F6",
                color: "#FFFFFF",
                padding: "14px 30px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                boxShadow: "0 12px 36px rgba(59,130,246,0.40)",
                transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              Book Consultation
            </Link>
            <Link
              to="/case-studies"
              className="hero-btn-secondary"
              style={{
                opacity: 1,
                background: "rgba(59,130,246,0.06)",
                color: "#FFFFFF",
                padding: "14px 30px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                border: "1px solid rgba(59,130,246,0.32)",
                textDecoration: "none",
                transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              View Our Work
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .hero-grad {
          background: linear-gradient(135deg, #60A5FA 0%, #3B82F6 50%, #A78BFA 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
        }
        @keyframes heroBadgePulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 10px rgba(59,130,246,0.9); }
          50% { opacity: 0.55; box-shadow: 0 0 4px rgba(59,130,246,0.4); }
        }
        .hero-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 18px 44px rgba(59,130,246,0.55); }
        .hero-btn-secondary:hover { border-color: rgba(59,130,246,0.6) !important; background: rgba(59,130,246,0.12) !important; }
      `}</style>
    </section>
  );
}
