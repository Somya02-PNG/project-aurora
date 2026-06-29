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
        background: "rgba(6,20,40,0.80)",
        border: "1px solid rgba(0,180,255,0.12)",
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
            border-color: rgba(0,180,255,0.45) !important;
            background: rgba(6,20,40,0.92) !important;
            box-shadow: 0 0 30px rgba(0,120,255,0.10), 0 20px 40px rgba(0,0,0,0.5);
            transform: translateY(-4px);
          }
        `}</style>
      )}
    </div>
  );
}
