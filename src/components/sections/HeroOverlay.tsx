import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { markReady } from "@/lib/appReady";
import handImg from "@/assets/hero-hand.png";
import connectorImg from "@/assets/hero-connector.png";

/** Hero: left copy + CTAs, right static hand + Y-spinning connector above it. */
export function HeroOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  const connectorRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    markReady("video");
    markReady("scene");
  }, []);

  // Single continuous Y-axis rotation — one transform, no separation possible.
  useEffect(() => {
    if (reduced) return;
    const el = connectorRef.current;
    if (!el) return;
    let raf = 0;
    const start = performance.now();
    const SPIN_MS = 9000;
    const tick = (now: number) => {
      const rotY = (((now - start) % SPIN_MS) / SPIN_MS) * 360;
      el.style.transform = `rotateY(${rotY}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

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
    const tl = gsap.timeline({ delay: 0.35, defaults: { ease: "power3.out" } });
    tl.from(eyebrow, { opacity: 0, y: 10, duration: 0.55 })
      .from(words, { opacity: 0, y: 24, duration: 0.75, stagger: 0.08 }, "-=0.15")
      .from(sub, { opacity: 0, y: 12, duration: 0.6 }, "-=0.25")
      .from(btns, { opacity: 0, y: 12, duration: 0.55, stagger: 0.1 }, "-=0.2");
    return () => {
      tl.kill();
    };
  }, [reduced]);

  const headline = ["From", "Ideas", "to", "Intelligent", "Software"];

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "100vh" }}>
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

        {/* RIGHT — static hand + spinning connector above it (no frame, no box) */}
        <div
          className="relative"
          style={{
            width: "100%",
            aspectRatio: "1 / 1.05",
            maxWidth: 620,
            justifySelf: "center",
            background: "transparent",
            overflow: "visible",
            perspective: 1400,
            pointerEvents: "none",
          }}
        >
          {/* Connector — single element, single transform = one solid object */}
          <div
            style={{
              position: "absolute",
              top: "6%",
              left: "50%",
              width: "32%",
              transform: "translateX(-50%)",
              transformStyle: "preserve-3d",
              filter: "drop-shadow(0 0 22px rgba(59,130,246,0.55))",
            }}
          >
            <div
              ref={connectorRef}
              style={{
                width: "100%",
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              <img
                src={connectorImg}
                alt="Glowing futuristic connector link"
                width={1024}
                height={1024}
                style={{
                  display: "block",
                  width: "100%",
                  height: "auto",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          {/* Hand — completely static, no mask, no box */}
          <img
            src={handImg}
            alt="Glowing digital hand"
            width={1024}
            height={1024}
            style={{
              position: "absolute",
              left: "0%",
              bottom: "0%",
              width: "100%",
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 18px 48px rgba(59,130,246,0.25))",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      <style>{`
        .hero-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 18px 44px rgba(59,130,246,0.55); }
        .hero-btn-secondary:hover { border-color: rgba(59,130,246,0.6) !important; background: rgba(59,130,246,0.12) !important; }
        @media (prefers-reduced-motion: reduce) {
          .hero-btn-primary, .hero-btn-secondary { transition: none !important; }
        }
      `}</style>
    </section>
  );
}
