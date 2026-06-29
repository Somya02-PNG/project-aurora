import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { markReady } from "@/lib/appReady";
import DarkVeil from "@/components/background/DarkVeil";
import DotField from "@/components/background/DotField";
import Orb from "@/components/background/Orb";
import Strands from "@/components/background/Strands";
import GradualBlur from "@/components/effects/GradualBlur";



/** Hero: centered copy + CTAs over the dark starfield background. */
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

  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  const dotFieldProps = isMobile
    ? { dotRadius: 1.1, dotSpacing: 10, cursorRadius: 280, bulgeStrength: 45, glowRadius: 100 }
    : isTablet
      ? { dotRadius: 1.35, dotSpacing: 12, cursorRadius: 380, bulgeStrength: 55, glowRadius: 130 }
      : { dotRadius: 1.65, dotSpacing: 14, cursorRadius: 500, bulgeStrength: 67, glowRadius: 160 };

  const orbSize = isMobile
    ? "min(420px, 72vw)"
    : isTablet
      ? "min(640px, 80vw)"
      : "min(900px, 92vw)";

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "100vh" }}>
      {/* DarkVeil — animated generative shader background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <DarkVeil
          hueShift={210}
          speed={0.5}
          warpAmount={0.6}
          noiseIntensity={0.02}
          scanlineIntensity={0.04}
          scanlineFrequency={2.0}
          colorA={[0.02, 0.05, 0.18]}
          colorB={[0.45, 0.35, 0.95]}
          colorMix={0.85}
          brightness={1.1}
      />

      {/* GradualBlur — smooth blur fade at the bottom edge */}
      <GradualBlur
        target="parent"
        position="bottom"
        height="6rem"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential
        opacity={1}
        zIndex={5}
      />

      </div>

      {/* DotField — interactive dot grid overlay */}
      <div aria-hidden className="absolute inset-0 z-[1]" style={{ mixBlendMode: "screen" }}>
        <DotField
          {...dotFieldProps}
          cursorForce={0.10}
          bulgeOnly={true}
          sparkle={false}
          waveAmplitude={0}
        />
      </div>

      {/* Orb — centered glowing orb */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2"
        style={{ width: orbSize, height: orbSize }}
      >
        <Orb hue={260} hoverIntensity={0.5} rotateOnHover forceHoverState={false} />
      </div>

      {/* Vignette for text legibility */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 55%, rgba(2,4,12,0.15) 0%, rgba(2,4,8,0.75) 100%)",
        }}
      />


      <div
        ref={ref}
        className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-6 py-24 text-center"
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

          <div className="flex flex-wrap items-center justify-center gap-4">
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

          {/* Strands — animated woven light strands beneath CTAs */}
          <div
            aria-hidden
            style={{
              width: "100%",
              height: "clamp(180px, 24vw, 280px)",
              marginTop: 40,
              position: "relative",
            }}
          >
            <Strands
              colors={["#3B82F6", "#7C3AED", "#06B6D4"]}
              count={3}
              speed={0.5}
              amplitude={1}
              waviness={1}
              thickness={0.7}
              glow={2.6}
              taper={3}
              spread={1}
              intensity={0.6}
              saturation={1.5}
              opacity={1}
              scale={1.5}
            />
          </div>

        </div>

      </div>

      <style>{`
        .hero-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 18px 44px rgba(59,130,246,0.55); }
        .hero-btn-secondary:hover { border-color: rgba(59,130,246,0.6) !important; background: rgba(59,130,246,0.12) !important; }
      `}</style>
    </section>
  );
}
