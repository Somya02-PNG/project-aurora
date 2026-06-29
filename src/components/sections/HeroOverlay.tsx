import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import heroChain from "@/assets/hero-chain.png.asset.json";
import { markReady } from "@/lib/appReady";

/** Hero: left copy + CTAs, right floating hand + unified animated chain (no frame). */
export function HeroOverlay() {
  const ref = useRef<HTMLDivElement>(null);
  const chainRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    markReady("video");
  }, []);

  // Drive chain rotateY + rotateX + translateY simultaneously via one rAF loop so
  // all three values land on the SAME transform string — guarantees one object.
  useEffect(() => {
    if (reduced) return;
    const el = chainRef.current;
    if (!el) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      const rotY = (t * (360 / 8)) % 360; // 8s full spin
      const rotX = Math.sin((t / 5) * Math.PI * 2) * 12; // ±12deg, 5s cycle
      const transY = -Math.sin((t / 4) * Math.PI * 2) * 7 - 7; // -14..0 px, 4s
      const glowT = 0.5 + 0.5 * Math.sin((t / 3) * Math.PI * 2);
      const glowPx = 15 + glowT * 20; // 15..35
      const glowA = 0.5 + glowT * 0.4; // 0.5..0.9
      el.style.setProperty("--rotY", `${rotY}deg`);
      el.style.setProperty("--rotX", `${rotX}deg`);
      el.style.setProperty("--transY", `${transY}px`);
      el.style.setProperty("--glow", `${glowPx}px`);
      el.style.setProperty("--glowA", `${glowA}`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);


  useEffect(() => {
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
              color: "#00B4FF",
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
              color: "#8BA8C4",
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
                background: "#2563EB",
                color: "#FFFFFF",
                padding: "14px 30px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                boxShadow: "0 12px 40px rgba(37,99,235,0.45)",
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
                background: "rgba(0,180,255,0.06)",
                color: "#FFFFFF",
                padding: "14px 30px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                border: "1px solid rgba(0,180,255,0.32)",
                textDecoration: "none",
                backdropFilter: "blur(8px)",
                transition: "all 0.2s ease",
              }}
            >
              View Our Work
            </Link>
          </div>
        </div>

        {/* RIGHT — framed 3D canvas: static hand + animated chain object */}
        <div
          className="relative"
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            maxWidth: 620,
            justifySelf: "center",
            borderRadius: 16,
            overflow: "hidden",
            background: "rgba(2,11,24,0.6)",
            border: "1px solid rgba(0,180,255,0.15)",
            perspective: 1200,
          }}
        >
          {/* Ambient inner glow */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 70% 70%, rgba(0,180,255,0.22), transparent 60%)",
              filter: "blur(20px)",
            }}
          />

          {/* STATIC HAND — full image, anchored bottom-right, cropped & scaled */}
          <img
            src={heroChain.url}
            alt="Glowing digital hand reaching for a chain link — futuristic illustration"
            className="absolute inset-0 h-full w-full"
            style={{
              objectFit: "cover",
              objectPosition: "right bottom",
              transform: "scale(1.18)",
              transformOrigin: "right bottom",
              filter: "drop-shadow(0 0 30px rgba(0,180,255,0.4))",
            }}
          />

          {/* ANIMATED CHAIN OBJECT — nested wrappers compose float + tilt + spin + glow */}
          <div className="absolute inset-0 chain-float" style={{ pointerEvents: "none" }}>
            <div className="absolute inset-0 chain-tilt">
              <div className="absolute inset-0 chain-spin">
                <img
                  src={heroChain.url}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full chain-glow"
                  style={{
                    objectFit: "cover",
                    objectPosition: "right bottom",
                    transform: "scale(1.18)",
                    transformOrigin: "right bottom",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 22% 28% at 68% 32%, #000 55%, transparent 80%)",
                    maskImage:
                      "radial-gradient(ellipse 22% 28% at 68% 32%, #000 55%, transparent 80%)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 18px 48px rgba(37,99,235,0.6); }
        .hero-btn-secondary:hover { border-color: rgba(0,180,255,0.6) !important; background: rgba(0,180,255,0.12) !important; }
      `}</style>
    </section>
  );
}
