import { useEffect, useRef } from "react";

/**
 * Tracks normalized scroll progress (0..1) across the entire document
 * and stores it in a ref so consumers (R3F useFrame) can read without
 * triggering React re-renders.
 */
export function useJourneyProgress() {
  const ref = useRef({ value: 0 });
  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const v = Math.min(1, Math.max(0, window.scrollY / max));
      ref.current.value = v;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return ref;
}
