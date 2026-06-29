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
          background: scrolled ? "rgba(2,11,24,0.97)" : "rgba(2,11,24,0.88)",
          backdropFilter: "blur(24px) saturate(1.3)",
          WebkitBackdropFilter: "blur(24px) saturate(1.3)",
          borderBottom: scrolled
            ? "1px solid rgba(0,180,255,0.15)"
            : "1px solid rgba(0,180,255,0.08)",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.6)" : "none",
          transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
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
          <Link to="/" className="flex items-center shrink-0" aria-label="DIMISI.tech home">
            <img
              src={dimisiLogo.url}
              alt="DIMISI"
              style={{
                height: 40,
                width: "auto",
                display: "block",
                filter: "drop-shadow(0 0 8px rgba(192,192,255,0.18))",
              }}
            />
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
