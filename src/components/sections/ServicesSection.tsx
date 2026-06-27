import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/mockData";
import { GradientBadge } from "@/components/ui/GradientBadge";

export function ServicesSection() {
  return (
    <section className="relative min-h-screen px-4 lg:px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl mb-16">
          <GradientBadge className="mb-6">Services</GradientBadge>
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-balance">
            A complete{" "}
            <span className="text-gradient">digital ecosystem.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Seven specialized practices, one senior team. Pick a single capability or run an entire
            transformation through us.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            >
              <Link
                to={`/services/${s.slug}` as never}
                className="group relative h-full glass rounded-2xl p-6 block overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-white/20"
              >
                <div
                  className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${s.color}33, transparent 60%)`,
                  }}
                />
                <div className="relative">
                  <div
                    className="size-14 rounded-2xl flex items-center justify-center mb-5 border border-white/10"
                    style={{
                      background: `linear-gradient(135deg, ${s.color}30, transparent)`,
                      boxShadow: `0 0 30px ${s.color}40`,
                    }}
                  >
                    <s.icon className="size-6" style={{ color: s.color }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 flex items-center justify-between">
                    {s.title}
                    <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-white group-hover:rotate-45 transition-all" />
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.short}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {s.stack.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded bg-white/5 border border-white/5 text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
