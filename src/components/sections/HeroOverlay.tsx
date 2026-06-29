import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { markReady } from "@/lib/appReady";
import heroImg from "@/assets/hero-handchain.png.asset.json";

/**
 * Hero: left copy + CTAs, right hand+connector image.
 * Static hand layer + clipped connector layer that rotates on Y-axis as one piece.
 * Image blends invisibly into the page background via mix-blend-mode: lighten.
 */
export function HeroOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    markReady("video");
    markReady("scene");
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const eyebrow = el.querySelector("[data-h-eye]");
    const words = el.querySelectorAll("[data-h-word]");
    const sub = el.querySelector("[data-h-sub]");
    const btns = el.querySelectorAll("[data-h-btn]");
    const hero = el.querySelector("[data-h-img]");
    if (reduced) {
      gsap.set([eyebrow, words, sub, btns, hero], { opacity: 1, y: 0 });
      return;
    }
    const tl = gsap.timeline({ delay: 0.35, defaults: { ease: "power3.out" } });
    tl.from(eyebrow, { opacity: 0, y: 10, duration: 0.55 })
      .from(words, { opacity: 0, y: 24, duration: 0.75, stagger: 0.08 }, "-=0.15")
      .from(sub, { opacity: 0, y: 12, duration: 0.6 }, "-=0.25")
      .from(btns, { opacity: 0, y: 12, duration: 0.55, stagger: 0.1 }, "-=0.2")
      .from(hero, { opacity: 0, scale: 0.96, duration: 0.9 }, "-=0.6");
    return () => {
      tl.kill();
    };
  }, [reduced]);

  const headline = ["From", "Ideas", "to", "Intelligent", "Software"];

  // The image is ~944x1696. Connector occupies roughly y: 26%–58%.
  // We clip two stacked copies of the same image:
  //   - bottom layer: hide the connector region (so only the hand shows)
  //   - top layer:    show only the connector region, then rotateY it.
  const CONNECTOR_TOP = 26; // %
  const CONNECTOR_BOTTOM = 58; // %

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "100vh" }}>
      <div
        ref={ref}
        className="relative z-10 mx-auto grid w-full max-w-7xl items-stretch gap-10 px-6 py-24 md:grid-cols-2 md:px-10"
        style={{ minHeight: "100vh" }}
      >
        {/* LEFT — copy + CTAs */}
        <div className="flex max-w-xl flex-col justify-center">
          <div
            data-h-eye
            style={{
              fontSize: 12,
              letterSpacing: "0.32em",
              color: "#3b82f6",
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

          <div className="flex flex-wrap items-center gap-4">
            <Link
              data-h-btn
              to="/contact"
              className="hero-btn-primary"
              style={{
                background: "#3b82f6",
                color: "#FFFFFF",
                padding: "14px 30px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                boxShadow: "0 12px 36px rgba(59,130,246,0.40)",
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
                background: "rgba(59,130,246,0.06)",
                color: "#FFFFFF",
                padding: "14px 30px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                border: "1px solid rgba(59,130,246,0.32)",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              View Our Work
            </Link>
          </div>
        </div>

        {/* RIGHT — hand + rotating connector */}
        <div
          data-h-img
          className="hero-visual relative flex items-center justify-center"
          style={{
            width: "100%",
            height: "100%",
            minHeight: 420,
            pointerEvents: "none",
          }}
        >
          <div className="hero-stack">
            {/* Base layer: full image with connector region masked out -> shows hand only */}
            <img
              src={heroImg.url}
              alt="Glowing digital hand holding a chain link connector"
              className="hero-layer hero-hand"
              draggable={false}
            />
            {/* Top layer: same image, only the connector slice is visible, rotates on Y */}
            <div className="hero-connector-wrap">
              <img
                src={heroImg.url}
                alt=""
                aria-hidden
                className="hero-layer hero-connector"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 18px 44px rgba(59,130,246,0.55); }
        .hero-btn-secondary:hover { border-color: rgba(59,130,246,0.6) !important; background: rgba(59,130,246,0.12) !important; }

        .hero-stack {
          position: relative;
          width: 100%;
          height: 100%;
          max-height: 86vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          mix-blend-mode: lighten;
          user-select: none;
        }
        /* Hide the connector slice on the base layer so the hand shows unchanged */
        .hero-hand {
          clip-path: polygon(
            0% 0%, 100% 0%,
            100% ${CONNECTOR_TOP}%, 0% ${CONNECTOR_TOP}%,
            0% 0%,
            0% 0%,
            0% ${CONNECTOR_BOTTOM}%, 100% ${CONNECTOR_BOTTOM}%,
            100% 100%, 0% 100%
          );
        }
        /* Wrapper carries the rotation; clip-path stays on the image so the slice remains a single piece */
        .hero-connector-wrap {
          position: absolute;
          inset: 0;
          transform-style: preserve-3d;
          perspective: 1200px;
          animation: heroConnectorSpin 3.5s linear infinite;
        }
        .hero-connector {
          clip-path: inset(${CONNECTOR_TOP}% 0% ${100 - CONNECTOR_BOTTOM}% 0%);
          filter: drop-shadow(0 0 22px rgba(56,189,248,0.55));
        }
        @keyframes heroConnectorSpin {
          from { transform: rotateY(0deg); }
          to   { transform: rotateY(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-connector-wrap { animation: none; }
        }
        @media (max-width: 767px) {
          .hero-visual { min-height: 360px; }
        }
      `}</style>
    </section>
  );
}
