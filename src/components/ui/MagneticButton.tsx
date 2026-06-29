import { Link } from "@tanstack/react-router";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline" | "magnetic";

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  to?: string;
  href?: string;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-[#0050A0] via-[#0094CC] to-[#00D4FF] text-white shadow-[0_10px_40px_-10px_rgba(0,212,255,0.5)] hover:shadow-[0_20px_60px_-10px_rgba(0,136,255,0.6)] hover:scale-[1.03]",
  ghost:
    "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20",
  outline:
    "bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/40",
  magnetic:
    "bg-gradient-to-r from-[#00D4FF] to-[#0050A0] text-white animate-pulse-glow",
};

export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ className, variant = "primary", to, href, children, ...rest }, ref) => {
    const cls = cn(
      "relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 will-change-transform",
      variants[variant],
      className,
    );
    if (to) {
      return (
        <Link to={to} className={cls}>
          {children}
        </Link>
      );
    }
    if (href) {
      return (
        <a href={href} className={cls}>
          {children}
        </a>
      );
    }
    return (
      <button ref={ref} className={cls} {...rest}>
        {children}
      </button>
    );
  },
);
MagneticButton.displayName = "MagneticButton";
