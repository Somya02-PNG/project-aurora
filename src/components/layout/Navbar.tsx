import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MegaMenu, type MegaKind } from "./MegaMenu";
import { MobileDrawer } from "./MobileDrawer";
import dimisiLogo from "@/assets/dimisi-logo.png.asset.json";


type Trigger = { key: MegaKind; label: string };

const triggers: Trigger[] = [
  { key: "offerings", label: "Our Offerings" },
  { key: "products", label: "Products" },
  { key: "inside", label: "Inside" },
  { key: "careers", label: "Careers" },
];

export function Navbar() {
  const [open, setOpen] = useState<MegaKind | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);




  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(null), 120);
  };
  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const openKind = (k: MegaKind) => {
    cancelClose();
    setOpen(k);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, []);

  useEffect(() => {
    setOpen(null);
  }, [pathname]);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50"
        style={{
          background: "rgba(5, 11, 24, 0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
        role="navigation"
        aria-label="Primary"
      >
        <div
          ref={wrapRef}
          className="mx-auto flex max-w-7xl items-center justify-between px-4 lg:px-6"
          style={{ height: 64 }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="DIMISI.tech home">
            <span
              className="relative grid place-items-center size-9 rounded-[10px] p-[1.5px] shadow-[0_0_24px_rgba(168,85,247,0.35)]"
              style={{ background: "linear-gradient(135deg,#A855F7 0%,#7C3AED 50%,#E879F9 100%)" }}
              aria-hidden
            >
              <span className="grid place-items-center w-full h-full rounded-[9px] bg-[#0B0418]">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                  <defs>
                    <linearGradient id="nav-d" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#C084FC" />
                      <stop offset="1" stopColor="#E879F9" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M5 3.5h7.2c5.2 0 8.8 3.5 8.8 8.5s-3.6 8.5-8.8 8.5H5V3.5Zm3.6 3.4v10.2h3.4c3.2 0 5.4-2 5.4-5.1 0-3.1-2.2-5.1-5.4-5.1H8.6Z"
                    fill="url(#nav-d)"
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

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 ml-6">
            <Link
              to="/"
              className="relative inline-flex items-center rounded-md px-3.5 py-2 text-[14px] font-medium transition-colors hover:text-white"
              style={{ color: pathname === "/" ? "#F1F5F9" : "#94A3B8" }}
            >
              Home
              {pathname === "/" && (
                <span
                  aria-hidden
                  className="absolute left-1/2 -bottom-0.5 size-1 -translate-x-1/2 rounded-full"
                  style={{ background: "#3B82F6", boxShadow: "0 0 8px #3B82F6" }}
                />
              )}
            </Link>
            {triggers.map((t) => {
              const isOpen = open === t.key;
              const panelId = `mega-${t.key}`;
              return (
                <div
                  key={t.key}
                  className="relative"
                  onMouseEnter={() => openKind(t.key)}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : t.key)}
                    onFocus={() => openKind(t.key)}
                    className="group inline-flex items-center gap-1 rounded-md px-3.5 py-2 text-[14px] font-medium transition-colors"
                    style={{ color: isOpen ? "#F1F5F9" : "#94A3B8" }}
                  >
                    <span className="hover:text-white transition-colors">{t.label}</span>
                    <ChevronDown
                      className={`size-3.5 opacity-70 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    />
                    {isOpen && (
                      <span
                        aria-hidden
                        className="absolute left-1/2 -bottom-0.5 size-1 -translate-x-1/2 rounded-full"
                        style={{ background: "#3B82F6", boxShadow: "0 0 8px #3B82F6" }}
                      />
                    )}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <div
                        className="absolute left-1/2 top-full -translate-x-1/2 pt-1"
                        onMouseEnter={cancelClose}
                        onMouseLeave={scheduleClose}
                      >
                        <MegaMenu kind={t.key} onClose={() => setOpen(null)} panelId={panelId} />
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/contact"
              className="text-[14px] font-medium text-white/75 hover:text-white transition-colors"
            >
              Contact Us
            </Link>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[14px] font-semibold text-white transition-transform"
              style={{
                background: "linear-gradient(135deg, #3B82F6, #7C3AED)",
                boxShadow: "0 0 20px rgba(59,130,246,0.35)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 35px rgba(59,130,246,0.55)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 20px rgba(59,130,246,0.35)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
              }}
            >
              Book Consultation
              <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
            </Link>
          </div>

          {/* Mobile trigger */}
          <button
            type="button"
            className="lg:hidden p-2 text-white"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-6" />
          </button>
        </div>
      </header>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
