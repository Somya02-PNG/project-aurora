import { useEffect, useState } from "react";
import logo from "@/assets/dimisi-logo.png.asset.json";

export function Preloader() {
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");

  useEffect(() => {
    // Lock scroll while preloader is visible.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const t1 = window.setTimeout(() => {
      setPhase("out");
      // Notify the app to begin its reveal in parallel.
      window.dispatchEvent(new CustomEvent("dimisi:preloader-done"));
    }, 2600);
    const t2 = window.setTimeout(() => {
      setPhase("gone");
      document.body.style.overflow = prevOverflow;
    }, 3700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  if (phase === "gone") return null;

  const isOut = phase === "out";

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#060608",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        opacity: isOut ? 0 : 1,
        transform: isOut ? "scale(1.04)" : "scale(1)",
        filter: isOut ? "blur(12px)" : "blur(0)",
        transition:
          "opacity 1s cubic-bezier(0.65,0,0.35,1), transform 1s cubic-bezier(0.65,0,0.35,1), filter 1s cubic-bezier(0.65,0,0.35,1)",
        pointerEvents: isOut ? "none" : "auto",
        willChange: "opacity, transform, filter",
      }}
    >
      <div style={{ position: "relative", width: 96, height: 96 }}>
        <img
          src={logo.url}
          alt="DIMISI"
          style={{
            width: 72,
            height: 72,
            position: "absolute",
            top: 12,
            left: 12,
            filter: "drop-shadow(0 0 12px rgba(74,108,247,0.35))",
          }}
        />
      </div>
      <div style={{ position: "relative", height: 16, width: 80 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 4,
              height: 4,
              marginTop: -2,
              marginLeft: -2,
              borderRadius: "50%",
              background: "#4A6CF7",
              boxShadow: "0 0 8px #4A6CF7",
              animation: `pl-orbit 1.4s linear ${i * 0.47}s infinite`,
            }}
          />
        ))}
      </div>
      <div
        style={{
          width: 160,
          height: 1,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg,#4A6CF7,#7B5EA7,#4A6CF7)",
            transformOrigin: "left center",
            animation: "pl-fill 2.4s ease-out forwards",
          }}
        />
      </div>
      <div
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 11,
          letterSpacing: "0.18em",
          color: "#4A4A6A",
        }}
      >
        INITIALIZING
      </div>
      <style>{`
        @keyframes pl-orbit {
          from { transform: rotate(0deg) translateX(32px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(32px) rotate(-360deg); }
        }
        @keyframes pl-fill {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
