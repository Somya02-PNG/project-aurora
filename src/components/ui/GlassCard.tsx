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
        background: "#0E0E14",
        border: "1px solid rgba(100,120,255,0.12)",
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
      }}
      {...rest}
    >
      {children}
      {hover && (
        <style>{`
          .gc-hover { will-change: transform; }
          .gc-hover:hover {
            border-color: rgba(100,120,255,0.40) !important;
            box-shadow: 0 0 40px rgba(74,108,247,0.08), 0 20px 60px rgba(0,0,0,0.6);
            transform: translateY(-4px);
          }
        `}</style>
      )}
    </div>
  );
}
