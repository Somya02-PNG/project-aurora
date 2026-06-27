import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Quote } from "lucide-react";
import { stats, testimonials, caseStudies, technologies } from "@/lib/mockData";
import { CountUp } from "@/components/ui/CountUp";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientBadge } from "@/components/ui/GradientBadge";

export function ProofSection() {
  return (
    <section className="relative px-4 lg:px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl mb-16">
          <GradientBadge className="mb-6">Proof</GradientBadge>
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-balance">
            Trusted by the teams{" "}
            <span className="text-gradient">building tomorrow.</span>
          </h2>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {stats.map((s) => (
            <GlassCard key={s.label} hover={false} className="text-center py-10">
              <div className="text-4xl lg:text-6xl font-bold text-gradient tracking-tight">
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-3 text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
                {s.label}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-5 mb-20">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <GlassCard className="h-full">
                <Quote className="size-6 text-[#A855F7] mb-4" />
                <p className="text-base leading-relaxed text-white/85">{t.quote}</p>
                <div className="mt-6 pt-4 border-t border-white/5">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mt-0.5">
                    {t.title}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Tech marquee */}
        <div className="mb-20 overflow-hidden mask-fade">
          <div className="flex gap-3 animate-[scroll_40s_linear_infinite] whitespace-nowrap">
            {[...technologies, ...technologies].map((t, i) => (
              <span
                key={i}
                className="glass px-5 py-2.5 rounded-full text-sm font-mono text-white/80"
              >
                {t.name}
              </span>
            ))}
          </div>
        </div>

        {/* Featured case studies */}
        <div className="grid md:grid-cols-2 gap-5">
          {caseStudies.slice(0, 2).map((c) => (
            <Link
              key={c.slug}
              to="/case-studies/$slug"
              params={{ slug: c.slug }}
              className="group glass rounded-2xl overflow-hidden block hover:-translate-y-1 transition-all duration-500"
            >
              <div className="h-56 relative overflow-hidden" style={{ background: c.cover }}>
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider glass-strong px-2 py-1 rounded">
                    {c.industry}
                  </span>
                </div>
                <ArrowUpRight className="absolute top-4 right-4 size-5 text-white/70 group-hover:rotate-45 group-hover:text-white transition-all" />
              </div>
              <div className="p-6">
                <div className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground mb-2">
                  {c.client} · {c.year}
                </div>
                <h3 className="text-xl font-semibold mb-3">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .mask-fade { mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); }
      `}</style>
    </section>
  );
}
