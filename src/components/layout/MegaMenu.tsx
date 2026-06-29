import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Globe, Smartphone, Bot, Palette, Code as Code2, Cloud, Briefcase, Wrench, TrendingUp, Rocket, ArrowRight, Sparkles } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

export type MegaKind = "offerings" | "products" | "inside" | "careers";

const panelMotion = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as const },
};

const panelBase: React.CSSProperties = {
  background: "rgba(10, 18, 35, 0.95)",
  backdropFilter: "blur(24px)",
  border: "1px solid rgba(59, 130, 246, 0.15)",
  borderRadius: 16,
  boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.1)",
  padding: 32,
};

type ServiceItem = {
  icon: ComponentType<{ className?: string; size?: number }>;
  label: string;
  desc: string;
  href: string;
  internal?: boolean;
};

const services: ServiceItem[] = [
  { icon: Globe, label: "Web Development", desc: "Modern, high-performance web apps and platforms", href: "/services/web-development", internal: true },
  { icon: Smartphone, label: "Mobile Development", desc: "iOS and Android native and cross-platform apps", href: "/services/mobile-app-development" },
  { icon: Bot, label: "AI & Automation", desc: "Intelligent systems and workflow automation", href: "/services/ai-automation" },
  { icon: Palette, label: "UI/UX Design", desc: "Clean, conversion-focused digital experiences", href: "/services/ui-ux-design" },
  { icon: Code2, label: "Software Development", desc: "Scalable custom software solutions", href: "/services/software-development", internal: true },
  { icon: Cloud, label: "Cloud Services", desc: "Secure, modern cloud infrastructure", href: "/services/cloud-services", internal: true },
  { icon: Briefcase, label: "IT Consulting", desc: "Strategic technology advisory", href: "/services/it-consulting" },
  { icon: Wrench, label: "IT Support & Maintenance", desc: "24/7 system support and upkeep", href: "/services/it-support-maintenance" },
  { icon: TrendingUp, label: "Digital Marketing", desc: "SEO, growth, and digital presence", href: "/services/digital-marketing" },
  { icon: Rocket, label: "Startup Mentorship", desc: "Guidance and support for early-stage startups", href: "/services/startup-mentorship" },
];

type ProductItem = { name: string; tagline: string; href: string; external?: boolean };
const products: ProductItem[] = [
  { name: "Kalesh", tagline: "The open opinion platform", href: "https://www.thekalesh.com/", external: true },
  { name: "KaryON", tagline: "Team workflow and task management", href: "/products/karyon" },
  { name: "Stylon", tagline: "AI-powered style and fashion platform", href: "/products/stylon" },
  { name: "Axis Conference Web", tagline: "Virtual conferencing for modern teams", href: "/products/axiscon" },
];

type LinkItem = { label: string; href: string; internal?: boolean; badge?: string };

const insideHome: LinkItem[] = [{ label: "Inside Home", href: "/", internal: true }];
const insideResources: LinkItem[] = [
  { label: "Newsletter", href: "/newsletter" },
  { label: "Events & Webinars", href: "/events" },
  { label: "Sitemap", href: "/sitemap" },
];
const insideWho: LinkItem[] = [
  { label: "About Us", href: "/about", internal: true },
  { label: "Team & Leadership", href: "/team-leadership" },
  { label: "Security & Trust", href: "/security" },
  { label: "Privacy Center", href: "/privacy" },
  { label: "Support Hub", href: "/support" },
];

const careers: LinkItem[] = [
  { label: "Careers Overview", href: "/careers" },
  { label: "Meet Our People", href: "/careers" },
  { label: "Open Positions", href: "/careers", badge: "We're Hiring!" },
];

function SmartLink({
  href,
  internal,
  external,
  className,
  children,
  onClick,
  role,
}: {
  href: string;
  internal?: boolean;
  external?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  role?: string;
}) {
  if (internal) {
    return (
      <Link to={href} className={className} onClick={onClick} role={role}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={className}
      onClick={onClick}
      role={role}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

export function MegaMenu({
  kind,
  onClose,
  panelId,
}: {
  kind: MegaKind;
  onClose: () => void;
  panelId: string;
}) {
  const close = () => onClose();

  if (kind === "offerings") {
    return (
      <motion.div
        {...panelMotion}
        id={panelId}
        role="menu"
        style={{ ...panelBase, width: 880 }}
        className="grid grid-cols-[1fr_280px] gap-6"
      >
        <div className="grid grid-cols-2 gap-1">
          {services.map((s) => (
            <SmartLink
              key={s.label}
              href={s.href}
              internal={s.internal}
              role="menuitem"
              onClick={close}
              className="group flex items-start gap-3 rounded-[10px] border-l-2 border-transparent px-3.5 py-2.5 transition-all duration-200 hover:border-[#00D4FF] hover:bg-[rgba(0,212,255,0.08)]"
            >
              <s.icon className="mt-0.5 size-5 text-[#00D4FF]" />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white">{s.label}</div>
                <div className="text-xs text-white/55">{s.desc}</div>
              </div>
            </SmartLink>
          ))}
        </div>

        <div
          className="flex flex-col justify-between rounded-2xl p-5"
          style={{
            background: "linear-gradient(160deg, rgba(0,212,255,0.15), rgba(0,80,160,0.15))",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] uppercase tracking-widest text-white/80">
              <Sparkles className="size-3" /> Free
            </div>
            <h3 className="mt-3 text-lg font-bold text-white">Not sure where to start?</h3>
            <p className="mt-2 text-xs text-white/65">
              Book a free 30-minute discovery call with our team.
            </p>
          </div>
          <Link
            to="/contact"
            onClick={close}
            className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#0050A0] px-3 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(0,212,255,0.35)] transition-transform hover:scale-[1.02]"
          >
            Book Free Consultation <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </motion.div>
    );
  }

  if (kind === "products") {
    return (
      <motion.div
        {...panelMotion}
        id={panelId}
        role="menu"
        style={{ ...panelBase, width: 720 }}
      >
        <div className="grid grid-cols-2 gap-3">
          {products.map((p) => (
            <SmartLink
              key={p.name}
              href={p.href}
              external={p.external}
              role="menuitem"
              onClick={close}
              className="group rounded-xl border p-4 transition-all"
              {...{ style: { background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" } }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-base font-bold text-white group-hover:text-[#60A5FA]">{p.name}</div>
                  <div className="mt-1 text-xs text-white/55">{p.tagline}</div>
                </div>
              </div>
              <div className="mt-3 text-xs font-medium text-[#60A5FA] opacity-0 transition-opacity group-hover:opacity-100">
                Learn more →
              </div>
            </SmartLink>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-5 border-t border-white/5 pt-4 text-xs">
          <Link to="/contact" onClick={close} className="text-white/70 hover:text-white">
            Contact Sales
          </Link>
          <Link to="/about" onClick={close} className="text-white/70 hover:text-white">
            Partner Program
          </Link>
        </div>
      </motion.div>
    );
  }

  if (kind === "inside") {
    const Col = ({ title, items }: { title: string; items: LinkItem[] }) => (
      <div>
        <div className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/45">
          {title}
        </div>
        <ul className="space-y-1.5">
          {items.map((i) => (
            <li key={i.label}>
              <SmartLink
                href={i.href}
                internal={i.internal}
                role="menuitem"
                onClick={close}
                className="block rounded-md px-2 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                {i.label}
              </SmartLink>
            </li>
          ))}
        </ul>
      </div>
    );
    return (
      <motion.div
        {...panelMotion}
        id={panelId}
        role="menu"
        style={{ ...panelBase, width: 640 }}
        className="grid grid-cols-3 gap-6"
      >
        <Col title="Home" items={insideHome} />
        <Col title="Resources" items={insideResources} />
        <Col title="Who We Are" items={insideWho} />
      </motion.div>
    );
  }

  // careers
  return (
    <motion.div
      {...panelMotion}
      id={panelId}
      role="menu"
      style={{ ...panelBase, width: 260, padding: 12 }}
    >
      <ul className="space-y-0.5">
        {careers.map((c) => (
          <li key={c.label}>
            <SmartLink
              href={c.href}
              role="menuitem"
              onClick={close}
              className="flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-white/85 transition-colors hover:bg-white/5 hover:text-white"
            >
              <span>{c.label}</span>
              {c.badge && (
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
                  {c.badge}
                </span>
              )}
            </SmartLink>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export const megaMenuData = { services, products, insideHome, insideResources, insideWho, careers };
