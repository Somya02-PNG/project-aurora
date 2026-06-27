import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/lib/mockData";
import { GradientBadge } from "@/components/ui/GradientBadge";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — DIMISI.tech" },
      { name: "description", content: "Seven specialized engineering practices, one senior team." },
      { property: "og:title", content: "Services — DIMISI.tech" },
      { property: "og:description", content: "Software, Web, Mobile, Cloud, DevOps, AI and Consulting." },
    ],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <div className="px-4 lg:px-6 pt-40 pb-20">
      <div className="mx-auto max-w-7xl">
        <GradientBadge className="mb-6">Services</GradientBadge>
        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight max-w-4xl text-balance">
          A complete <span className="text-gradient">engineering practice</span> for ambitious teams.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Pick a single capability, or run an entire transformation with us.
        </p>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            >
              <Link
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group relative h-full glass rounded-2xl p-6 block overflow-hidden hover:-translate-y-1 transition-all duration-500"
              >
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
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
