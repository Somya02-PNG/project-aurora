import { useEffect } from "react";
import { getLenis } from "@/lib/lenis";

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    getLenis();
  }, []);
  return <>{children}</>;
}
