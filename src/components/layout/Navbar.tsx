import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/services", label: "Services" },
  { to: "/technologies", label: "Technologies" },
  { to: "/industries", label: "Industries" },
  { to: "/case-studies", label: "Work" },
  { to: "/about", label: "About" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled ? "py-3" : "py-5",
        )}
      >
        <div
          className={cn(
            "mx-auto max-w-7xl px-4 lg:px-6 transition-all duration-500",
            scrolled && "glass-strong rounded-2xl",
          )}
        >
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 group">
              <span
                className="relative grid place-items-center size-9 rounded-[10px] p-[1.5px] shadow-[0_0_24px_rgba(168,85,247,0.35)]"
                style={{ background: "linear-gradient(135deg,#A855F7 0%,#7C3AED 50%,#E879F9 100%)" }}
                aria-hidden
              >
                <span className="grid place-items-center w-full h-full rounded-[9px] bg-[#0B0418]">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                    <defs>
                      <linearGradient id="dimisi-d" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#C084FC" />
                        <stop offset="1" stopColor="#E879F9" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M5 3.5h7.2c5.2 0 8.8 3.5 8.8 8.5s-3.6 8.5-8.8 8.5H5V3.5Zm3.6 3.4v10.2h3.4c3.2 0 5.4-2 5.4-5.1 0-3.1-2.2-5.1-5.4-5.1H8.6Z"
                      fill="url(#dimisi-d)"
                    />
                  </svg>
                </span>
              </span>
              <div className="leading-tight">
                <div className="text-base font-bold tracking-[0.02em]">DIMISI</div>
                <div className="text-[9px] font-mono uppercase tracking-[0.3em] text-muted-foreground -mt-0.5">
                  .tech
                </div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="relative px-4 py-2 text-sm text-white/75 transition-colors hover:text-white"
                  activeProps={{ className: "text-white" }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-white text-background px-4 py-2 text-sm font-medium hover:bg-white/90 transition-all"
              >
                Book a Call
                <ArrowUpRight className="size-3.5 group-hover:rotate-45 transition-transform" />
              </Link>
            </div>

            <button
              className="lg:hidden p-2 text-white"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </header>

      {open && <MobileMenu close={() => setOpen(false)} />}
    </>
  );
}

function MobileMenu({ close }: { close: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-2xl lg:hidden">
      <div className="flex items-center justify-between px-4 py-5">
        <span className="font-bold">DIMISI.tech</span>
        <button onClick={close} aria-label="Close menu" className="p-2">
          <X className="size-6" />
        </button>
      </div>
      <nav className="px-6 mt-6 flex flex-col gap-1">
        {nav.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            onClick={close}
            className="text-3xl font-bold tracking-tight py-3 border-b border-white/5"
          >
            {n.label}
          </Link>
        ))}
        <Link
          to="/contact"
          onClick={close}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A855F7] to-[#7C3AED] px-6 py-4 font-medium"
        >
          Book a Call <ArrowUpRight className="size-4" />
        </Link>
      </nav>
    </div>
  );
}
