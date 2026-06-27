import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function GradientBadge({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-mono uppercase tracking-[0.18em] text-white/80",
        className,
      )}
      {...rest}
    >
      <span className="size-1.5 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] animate-pulse-glow" />
      {children}
    </div>
  );
}
