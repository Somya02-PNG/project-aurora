import { useEffect, useState } from "react";

export type Perf = "low" | "mid" | "high";

export function useDevicePerformance(): Perf {
  const [perf, setPerf] = useState<Perf>("high");
  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 4;
    const mem = (navigator as any).deviceMemory ?? 8;
    const mobile = /Mobi|Android/i.test(navigator.userAgent);
    if (mobile || cores <= 4 || mem <= 4) setPerf("low");
    else if (cores <= 8) setPerf("mid");
    else setPerf("high");
  }, []);
  return perf;
}
