import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { GalaxyScene } from "./GalaxyScene";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Full-bleed hero section: GalaxyScene canvas + overlay UI with GSAP intro. */
export function SpaceHero() {
  const rootRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const eyebrow = el.querySelector("[data-hero-eyebrow]");
    const words = el.querySelectorAll("[data-hero-word]");
    const sub = el.querySelector("[data-hero-sub]");
    const btns = el.querySelectorAll("[data-hero-btn]");

    if (reduced) {
      gsap.set([eyebrow, words, sub, btns], { opacity: 1, y: 0 });
      return;
    }

    const tl = gsap.timeline({ delay: 0.8, defaults: { ease: "power3.out" } });
    tl.from(eyebrow, { opacity: 0, y: 8, duration: 0.6 })
      .from(words, { opacity: 0, y: 24, duration: 0.8, stagger: 0.15 }, "-=0.2")
      .from(sub, { opacity: 0, y: 12, duration: 0.7 }, "+=0.05")
      .from(btns, { opacity: 0, y: 12, duration: 0.6, stagger: 0.12 }, "-=0.2");

    return () => {
      tl.kill();
    };
  }, [reduced]);

  const headline = ["From", "Ideas", "to", "Intelligent", "Software"];

  return (
    <section
      ref={rootRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", backgroundColor: "#020008" }}
    >
      <div className="absolute inset-0">
        {mounted && <GalaxyScene rootEl={rootRef.current} />}
      </div>

      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-10 flex items-center"
      >
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <div className="max-w-2xl">
            <div
              data-hero-eyebrow
              style={{
                fontSize: 13,
                letterSpacing: "0.2em",
                color: "#6d28d9",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: 18,
              }}
            >
              DIMISI Technologies
            </div>

            <h1
              style={{
                fontSize: "clamp(36px, 6vw, 72px)",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.1,
                marginBottom: 24,
                letterSpacing: "-0.02em",
              }}
            >
              <span style={{ display: "block" }}>
                {headline.slice(0, 3).map((w, i) => (
                  <span
                    key={i}
                    data-hero-word
                    style={{ display: "inline-block", marginRight: "0.32em" }}
                  >
                    {w}
                  </span>
                ))}
              </span>
              <span style={{ display: "block" }}>
                {headline.slice(3).map((w, i) => (
                  <span
                    key={i}
                    data-hero-word
                    style={{ display: "inline-block", marginRight: "0.32em" }}
                  >
                    {w}
                  </span>
                ))}
              </span>
            </h1>

            <p
              data-hero-sub
              style={{
                fontSize: 16,
                color: "#9ca3af",
                maxWidth: 480,
                lineHeight: 1.6,
                marginBottom: 32,
              }}
            >
              We build scalable AI-powered digital products for modern businesses.
            </p>

            <div className="pointer-events-auto flex flex-wrap gap-4">
              <Link
                data-hero-btn
                to="/contact"
                className="hero-btn-primary"
                style={{
                  background: "#7c3aed",
                  color: "#ffffff",
                  padding: "14px 28px",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 15,
                  textDecoration: "none",
                  display: "inline-block",
                  transition: "all 0.2s ease",
                }}
              >
                Book Consultation
              </Link>
              <Link
                data-hero-btn
                to="/services"
                className="hero-btn-secondary"
                style={{
                  background: "transparent",
                  color: "#e5e7eb",
                  padding: "14px 28px",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 15,
                  border: "1px solid rgba(255,255,255,0.2)",
                  textDecoration: "none",
                  display: "inline-block",
                  transition: "all 0.2s ease",
                }}
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-btn-primary:hover {
          background: #6d28d9 !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(124,58,237,0.35);
        }
        .hero-btn-secondary:hover {
          border-color: rgba(255,255,255,0.5) !important;
          color: #ffffff !important;
        }
      `}</style>
    </section>
  );
}
