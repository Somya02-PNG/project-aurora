import Lenis from "lenis";

let instance: Lenis | null = null;

export function getLenis() {
  if (typeof window === "undefined") return null;
  if (!instance) {
    instance = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    const raf = (time: number) => {
      instance?.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }
  return instance;
}
