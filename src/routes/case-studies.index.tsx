import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { caseStudies } from "@/lib/mockData";
import { GradientBadge } from "@/components/ui/GradientBadge";

export const Route = createFileRoute("/case-studies/")({
  head: () => ({
    meta: [
      { title: "Case Studies — DIMISI.tech" },
      { name: "description", content: "Real engagements, measurable outcomes." },
      { property: "og:title", content: "Case Studies — DIMISI.tech" },
      { property: "og:description", content: "Selected work from the DIMISI engineering practice." },
    ],
  }),
  component: CaseStudiesIndex,
});

function CaseStudiesIndex() {
  return (
    <div className="px-4 lg:px-6 pt-40 pb-20">
      <div className="mx-auto max-w-7xl">
        <GradientBadge className="mb-6">Selected Work</GradientBadge>
        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight max-w-4xl text-balance">
          Outcomes that{" "}
          <span className="text-gradient">moved the needle.</span>
        </h1>

        <div className="mt-16 grid md:grid-cols-2 gap-6">
          {caseStudies.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
            >
              <Link
                to="/case-studies/$slug"
                params={{ slug: c.slug }}
                className="group glass rounded-3xl overflow-hidden block hover:-translate-y-1 transition-all duration-500"
              >
                <div className="h-64 relative overflow-hidden" style={{ background: c.cover }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <div className="absolute top-5 left-5 flex gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider glass-strong px-2.5 py-1 rounded">
                      {c.industry}
                    </span>
                  </div>
                  <ArrowUpRight className="absolute top-5 right-5 size-6 text-white/80 group-hover:rotate-45 group-hover:text-white transition-all" />
                  <div className="absolute bottom-5 left-5 text-xs font-mono uppercase tracking-[0.2em] text-white/70">
                    {c.year}
                  </div>
                </div>
                <div className="p-7">
                  <div className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground mb-2">
                    {c.client}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-balance">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.summary}</p>
                  <div className="mt-6 grid grid-cols-3 gap-3 pt-5 border-t border-white/5">
                    {c.metrics.map((m) => (
                      <div key={m.label}>
                        <div className="text-lg font-bold text-gradient">{m.value}</div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-0.5">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
