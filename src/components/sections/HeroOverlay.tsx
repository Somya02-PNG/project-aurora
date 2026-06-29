import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Transparent hero text + CTA layer over the 3D hero canvas. */
export function HeroOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

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
    const tl = gsap.timeline({ delay: 0.65, defaults: { ease: "power3.out" } });
    tl.from(eyebrow, { opacity: 0, y: 10, duration: 0.6 })
      .from(words, { opacity: 0, y: 28, duration: 0.9, stagger: 0.1 }, "-=0.2")
      .from(sub, { opacity: 0, y: 12, duration: 0.7 }, "-=0.3")
      .from(btns, { opacity: 0, y: 12, duration: 0.6, stagger: 0.1 }, "-=0.2");
    return () => {
      tl.kill();
    };
  }, [reduced]);

  const headline = ["From", "Ideas", "to", "Intelligent", "Software"];

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "100vh" }}>
      {/* Tint + legibility veils */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 1,
          background:
            "radial-gradient(ellipse 65% 45% at 50% 62%, rgba(2,8,16,0.45), transparent 70%), linear-gradient(180deg, rgba(2,8,16,0.25), rgba(2,8,16,0.45))",
        }}
      />
      <div ref={ref} className="absolute inset-0 z-10 flex items-center justify-center px-6">
        <div className="w-full max-w-3xl text-center">
          <div
            data-h-eye
            style={{
              fontSize: 12,
              letterSpacing: "0.32em",
              color: "#00D4FF",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: 22,
              textShadow: "0 0 20px rgba(0,212,255,0.5), 0 1px 12px rgba(0,0,0,0.7)",
            }}
          >
            DIMISI Technologies
          </div>
          <h1
            style={{
              fontSize: "clamp(40px, 6.5vw, 78px)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginBottom: 28,
              textShadow: "0 2px 28px rgba(0,0,0,0.7), 0 0 60px rgba(0,212,255,0.15)",
            }}
          >
            {headline.map((w, i) => (
              <span key={i} data-h-word style={{ display: "inline-block", marginRight: "0.32em" }}>
                {w}
              </span>
            ))}
          </h1>
          <p
            data-h-sub
            style={{
              fontSize: 17,
              color: "#B8D4E8",
              maxWidth: 560,
              margin: "0 auto 36px",
              lineHeight: 1.6,
              textShadow: "0 1px 12px rgba(0,0,0,0.7)",
            }}
          >
            We build scalable, AI-powered digital products for the companies shaping what comes next.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              data-h-btn
              to="/contact"
              className="vh-primary"
              style={{
                background: "linear-gradient(135deg, #0050A0 0%, #00D4FF 100%)",
                color: "#fff",
                padding: "14px 30px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                boxShadow: "0 12px 40px rgba(0,212,255,0.35)",
                transition: "all 0.2s ease",
              }}
            >
              Book Consultation
            </Link>
            <Link
              data-h-btn
              to="/services"
              className="vh-secondary"
              style={{
                background: "rgba(0,212,255,0.08)",
                color: "#fff",
                padding: "14px 30px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                border: "1px solid rgba(0,212,255,0.35)",
                textDecoration: "none",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s ease",
              }}
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: "20vh",
          background: "linear-gradient(180deg, rgba(2,8,16,0) 0%, rgba(2,8,16,0.85) 100%)",
        }}
      />
      <style>{`
        .vh-primary:hover { transform: translateY(-2px); box-shadow: 0 18px 48px rgba(0,212,255,0.5); filter: brightness(1.1); }
        .vh-secondary:hover { border-color: rgba(0,212,255,0.7) !important; background: rgba(0,212,255,0.15) !important; }
      `}</style>
    </section>
  );
}
