import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X, ArrowUpRight } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { megaMenuData } from "./MegaMenu";

type Section = "offerings" | "products" | "inside" | "careers";

export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<Section | null>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[59] bg-black/60"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-[60] flex h-dvh w-[88vw] max-w-sm flex-col"
            style={{ background: "rgba(5,11,24,0.98)", backdropFilter: "blur(24px)" }}
            role="dialog"
            aria-label="Mobile navigation"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <span className="font-bold tracking-wide">DIMISI<span className="text-white/40">.tech</span></span>
              <button onClick={onClose} aria-label="Close menu" className="p-2 text-white/80 hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3">
              <Accordion label="Our Offerings" id="offerings" expanded={expanded} setExpanded={setExpanded}>
                <ul className="space-y-1">
                  {megaMenuData.services.map((s) => (
                    <DrawerLink key={s.label} href={s.href} internal={s.internal} onClose={onClose}>
                      {s.label}
                    </DrawerLink>
                  ))}
                </ul>
              </Accordion>
              <Accordion label="Products" id="products" expanded={expanded} setExpanded={setExpanded}>
                <ul className="space-y-1">
                  {megaMenuData.products.map((p) => (
                    <DrawerLink key={p.name} href={p.href} onClose={onClose}>
                      {p.name} <span className="text-white/40">— {p.tagline}</span>
                    </DrawerLink>
                  ))}
                </ul>
              </Accordion>
              <Accordion label="Inside" id="inside" expanded={expanded} setExpanded={setExpanded}>
                <ul className="space-y-1">
                  {[...megaMenuData.insideHome, ...megaMenuData.insideResources, ...megaMenuData.insideWho].map((i) => (
                    <DrawerLink key={i.label} href={i.href} internal={i.internal} onClose={onClose}>
                      {i.label}
                    </DrawerLink>
                  ))}
                </ul>
              </Accordion>
              <Accordion label="Careers" id="careers" expanded={expanded} setExpanded={setExpanded}>
                <ul className="space-y-1">
                  {megaMenuData.careers.map((c) => (
                    <DrawerLink key={c.label} href={c.href} onClose={onClose}>
                      <span className="inline-flex items-center gap-2">
                        {c.label}
                        {c.badge && (
                          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
                            {c.badge}
                          </span>
                        )}
                      </span>
                    </DrawerLink>
                  ))}
                </ul>
              </Accordion>
              <Link
                to="/contact"
                onClick={onClose}
                className="mt-2 block rounded-lg px-4 py-3 text-sm font-medium text-white/85 hover:bg-white/5"
              >
                Contact Us
              </Link>
            </div>

            <div className="border-t border-white/5 p-4">
              <Link
                to="/contact"
                onClick={onClose}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] px-4 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(59,130,246,0.35)]"
              >
                Book Consultation <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Accordion({
  label,
  id,
  expanded,
  setExpanded,
  children,
}: {
  label: string;
  id: Section;
  expanded: Section | null;
  setExpanded: (s: Section | null) => void;
  children: ReactNode;
}) {
  const open = expanded === id;
  return (
    <div className="border-b border-white/5">
      <button
        onClick={() => setExpanded(open ? null : id)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left text-base font-semibold text-white"
      >
        {label}
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-3 pl-4 pr-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DrawerLink({
  href,
  internal,
  onClose,
  children,
}: {
  href: string;
  internal?: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const cls = "block rounded-md px-3 py-2 text-sm text-white/75 hover:bg-white/5 hover:text-white";
  if (internal) {
    return (
      <li>
        <Link to={href} onClick={onClose} className={cls}>
          {children}
        </Link>
      </li>
    );
  }
  return (
    <li>
      <a href={href} onClick={onClose} className={cls}>
        {children}
      </a>
    </li>
  );
}
