import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import heroVideo from "@/assets/hero-journey.mp4.asset.json";

/** Transparent hero text + CTA layer over the 3D journey canvas. */
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
      {/* Cinematic video backdrop (sits behind 3D canvas via z-index) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlayThrough={() => import("@/lib/appReady").then((m) => m.markReady("video"))}
        onLoadedData={() => import("@/lib/appReady").then((m) => m.markReady("video"))}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ zIndex: 0, opacity: 0.85, transform: "translateZ(0)" }}
        src={heroVideo.url}
      />
      {/* Cover the bottom-right Gemini watermark with a seamless frosted patch */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          right: 0,
          bottom: 0,
          width: 240,
          height: 90,
          background: "#05000f",
          backdropFilter: "blur(18px)",
          WebkitMaskImage:
            "radial-gradient(ellipse 120% 120% at 100% 100%, #000 45%, transparent 78%)",
          maskImage:
            "radial-gradient(ellipse 120% 120% at 100% 100%, #000 45%, transparent 78%)",
          zIndex: 1,
        }}
      />
      {/* Tint + legibility veils */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 1,
          background:
            "radial-gradient(ellipse 65% 45% at 50% 62%, rgba(5,0,16,0.55), transparent 70%), linear-gradient(180deg, rgba(5,0,16,0.35), rgba(5,0,16,0.55))",
        }}
      />
      <div ref={ref} className="absolute inset-0 z-10 flex items-center justify-center px-6">
        <div className="w-full max-w-3xl text-center">
          <div
            data-h-eye
            style={{
              fontSize: 12,
              letterSpacing: "0.32em",
              color: "#C0C0FF",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: 22,
              textShadow: "0 1px 12px rgba(0,0,0,0.7)",
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
              textShadow: "0 2px 28px rgba(0,0,0,0.7)",
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
              color: "#E5DEF7",
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
                background: "#7c3aed",
                color: "#fff",
                padding: "14px 30px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                boxShadow: "0 12px 40px rgba(124,58,237,0.45)",
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
                background: "rgba(255,255,255,0.06)",
                color: "#fff",
                padding: "14px 30px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                border: "1px solid rgba(255,255,255,0.22)",
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
          background: "linear-gradient(180deg, rgba(5,0,16,0) 0%, rgba(5,0,16,0.85) 100%)",
        }}
      />
      <style>{`
        .vh-primary:hover { background: #6d28d9 !important; transform: translateY(-2px); box-shadow: 0 18px 48px rgba(124,58,237,0.55); }
        .vh-secondary:hover { border-color: rgba(255,255,255,0.5) !important; background: rgba(255,255,255,0.10) !important; }
      `}</style>
    </section>
  );
}
