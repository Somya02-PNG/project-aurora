import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  hover?: boolean;
}

export function GlassCard({ className, glow, hover = true, children, ...rest }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6 transition-all duration-500",
        hover && "hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_30px_80px_-20px_rgba(59,130,246,0.35)]",
        glow && "glow-ring",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
