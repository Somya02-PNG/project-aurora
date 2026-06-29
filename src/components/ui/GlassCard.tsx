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
        "card-corner rounded-2xl p-6",
        hover && "gc-hover",
        glow && "glow-ring",
        className,
      )}
      style={{
        background: "rgba(12,26,46,0.78)",
        border: "1px solid #1a3050",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
      }}
      {...rest}
    >
      {children}
      {hover && (
        <style>{`
          .gc-hover { will-change: transform; }
          .gc-hover:hover {
            border-color: rgba(59,130,246,0.55) !important;
            background: rgba(12,26,46,0.92) !important;
            box-shadow: 0 0 28px rgba(59,130,246,0.12), 0 18px 36px rgba(0,0,0,0.55);
            transform: translateY(-3px);
          }
        `}</style>
      )}
    </div>
  );
}
