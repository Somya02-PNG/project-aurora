import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import type { Service } from "@/lib/mockData";
import { services } from "@/lib/mockData";
import { GradientBadge } from "@/components/ui/GradientBadge";
import { GlassCard } from "@/components/ui/GlassCard";

export function ServiceDetail({ service }: { service: Service }) {
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const Icon = service.icon;
  return (
    <div className="px-4 lg:px-6 pt-40 pb-20">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/services"
          className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-white"
        >
          ← All services
        </Link>

        <div className="mt-8 grid lg:grid-cols-[1fr_auto] gap-12 items-start">
          <div className="max-w-3xl">
            <GradientBadge className="mb-6">{service.title}</GradientBadge>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-balance">
              {service.short.replace(/\.$/, "")}.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">{service.description}</p>
          </div>
          <div
            className="size-32 rounded-3xl flex items-center justify-center border border-white/10 shrink-0"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${service.color}55, transparent 70%)`,
              boxShadow: `0 0 80px ${service.color}55`,
            }}
          >
            <Icon className="size-14" style={{ color: service.color }} />
          </div>
        </div>

        <div className="mt-20 grid lg:grid-cols-2 gap-8">
          <GlassCard hover={false}>
            <h2 className="text-2xl font-semibold mb-6">What we deliver</h2>
            <ul className="space-y-3">
              {service.capabilities.map((c) => (
                <motion.li
                  key={c}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <Check className="size-5 text-[#06B6D4] shrink-0 mt-0.5" />
                  <span>{c}</span>
                </motion.li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard hover={false}>
            <h2 className="text-2xl font-semibold mb-6">Stack we love</h2>
            <div className="flex flex-wrap gap-2">
              {service.stack.map((t) => (
                <span
                  key={t}
                  className="glass px-4 py-2 rounded-full text-sm font-mono text-white/85"
                >
                  {t}
                </span>
              ))}
            </div>
            <Link
              to="/contact"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] px-6 py-3 text-sm font-medium"
            >
              Discuss your project <ArrowRight className="size-4" />
            </Link>
          </GlassCard>
        </div>

        <div className="mt-24">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Explore other services
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {others.map((o) => (
              <Link
                key={o.slug}
                to="/services/$slug"
                params={{ slug: o.slug }}
                className="group glass rounded-2xl p-5 hover:-translate-y-1 transition-all"
              >
                <o.icon className="size-6 mb-3" style={{ color: o.color }} />
                <div className="font-semibold">{o.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{o.short}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
