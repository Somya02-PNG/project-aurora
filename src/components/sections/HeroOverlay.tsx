import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import heroChain from "@/assets/hero-chain.png.asset.json";
import { markReady } from "@/lib/appReady";

/** Hero: deep-black space backdrop, animated chain+hand visual, left-side copy + CTAs. */
export function HeroOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    // image hero — no video to wait on
    markReady("video");
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const eyebrow = el.querySelector("[data-h-eye]");
    const words = el.querySelectorAll("[data-h-word]");
    const sub = el.querySelector("[data-h-sub]");
    const btns = el.querySelectorAll("[data-h-btn]");
    if (reduced) {
      gsap.set([eyebrow, words, sub, btns], { opacity: 1, y: 0 });
      return;
    }
    const tl = gsap.timeline({ delay: 0.4, defaults: { ease: "power3.out" } });
    tl.from(eyebrow, { opacity: 0, y: 10, duration: 0.6 })
      .from(words, { opacity: 0, y: 28, duration: 0.85, stagger: 0.09 }, "-=0.2")
      .from(sub, { opacity: 0, y: 12, duration: 0.7 }, "-=0.3")
      .from(btns, { opacity: 0, y: 12, duration: 0.6, stagger: 0.1 }, "-=0.2");
    return () => {
      tl.kill();
    };
  }, [reduced]);

  const headline = ["From", "Ideas", "to", "Intelligent", "Software"];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "100vh", backgroundColor: "#02050C" }}
    >
      {/* Deep starfield gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 80% 50%, rgba(14,165,233,0.18), transparent 60%), radial-gradient(ellipse 60% 40% at 20% 80%, rgba(56,189,248,0.10), transparent 65%), #02050C",
        }}
      />
      {/* Drifting nebula wisps */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 15% 35%, rgba(125,211,252,0.10), transparent 45%), radial-gradient(circle at 55% 60%, rgba(14,165,233,0.06), transparent 50%)",
          animation: "hero-drift 18s ease-in-out infinite alternate",
        }}
      />

      <div
        ref={ref}
        className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 px-6 py-24 md:grid-cols-2 md:px-10"
        style={{ minHeight: "100vh" }}
      >
        {/* LEFT — copy + CTAs */}
        <div className="max-w-xl">
          <div
            data-h-eye
            style={{
              fontSize: 12,
              letterSpacing: "0.32em",
              color: "#7DD3FC",
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
              color: "#EAF4FF",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginBottom: 26,
              textShadow: "0 2px 28px rgba(0,0,0,0.7)",
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
              color: "#9AB3CC",
              maxWidth: 520,
              lineHeight: 1.65,
              marginBottom: 36,
            }}
          >
            We build scalable, AI-powered digital products for the companies shaping what comes next.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              data-h-btn
              to="/contact"
              className="hero-btn-primary"
              style={{
                background: "linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)",
                color: "#02050C",
                padding: "14px 30px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                boxShadow: "0 12px 40px rgba(56,189,248,0.45)",
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
                background: "rgba(125,211,252,0.06)",
                color: "#EAF4FF",
                padding: "14px 30px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                border: "1px solid rgba(125,211,252,0.32)",
                textDecoration: "none",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s ease",
              }}
            >
              View Our Work
            </Link>
          </div>
        </div>

        {/* RIGHT — chain + hand visual, ambient & animated */}
        <div className="relative flex items-center justify-center">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 60% 50%, rgba(56,189,248,0.30), transparent 60%)",
              filter: "blur(40px)",
              animation: "hero-pulse 5s ease-in-out infinite",
            }}
          />
          <div
            className="relative"
            style={{
              width: "100%",
              maxWidth: 720,
              aspectRatio: "16 / 9",
              animation: "hero-float 6s ease-in-out infinite",
            }}
          >
            {/* Static hand+ambience layer (full image) */}
            <img
              src={heroChain.url}
              alt="Digital chain connecting to a glowing hand — futuristic illustration"
              className="absolute inset-0 h-full w-full object-contain"
              style={{ filter: "drop-shadow(0 0 40px rgba(56,189,248,0.35))" }}
            />
            {/* Rotating chain layer: same image, masked to the chain region, spinning on its axis */}
            <img
              src={heroChain.url}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-contain"
              style={{
                WebkitMaskImage:
                  "radial-gradient(ellipse 26% 32% at 72% 38%, #000 55%, transparent 78%)",
                maskImage:
                  "radial-gradient(ellipse 26% 32% at 72% 38%, #000 55%, transparent 78%)",
                transformOrigin: "72% 38%",
                animation: "hero-spin 9s linear infinite",
                filter: "drop-shadow(0 0 30px rgba(125,211,252,0.55))",
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom seamless fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: "18vh",
          background: "linear-gradient(180deg, rgba(2,5,12,0) 0%, rgba(2,5,12,0.95) 100%)",
        }}
      />

      <style>{`
        @keyframes hero-float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes hero-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes hero-pulse {
          0%,100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes hero-drift {
          0% { transform: translate3d(0,0,0); }
          100% { transform: translate3d(-2%, 1%, 0); }
        }
        .hero-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 18px 48px rgba(56,189,248,0.6); }
        .hero-btn-secondary:hover { border-color: rgba(125,211,252,0.6) !important; background: rgba(125,211,252,0.12) !important; }
      `}</style>
    </section>
  );
}
