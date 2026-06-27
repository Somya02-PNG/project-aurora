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
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative size-8 rounded-lg bg-gradient-to-br from-[#A855F7] via-[#7C3AED] to-[#E879F9] shadow-[0_0_24px_rgba(168,85,247,0.5)]">
                <div className="absolute inset-[3px] rounded-md bg-background" />
                <div className="absolute inset-[6px] rounded-sm bg-gradient-to-br from-[#A855F7] to-[#E879F9]" />
              </div>
              <div className="leading-tight">
                <div className="text-base font-bold tracking-tight">DIMISI</div>
                <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground -mt-0.5">
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
