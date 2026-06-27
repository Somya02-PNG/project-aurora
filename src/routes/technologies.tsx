import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { technologies } from "@/lib/mockData";
import { GradientBadge } from "@/components/ui/GradientBadge";

export const Route = createFileRoute("/technologies")({
  head: () => ({
    meta: [
      { title: "Technologies — DIMISI.tech" },
      { name: "description", content: "The modern stack we use to build production-grade systems." },
      { property: "og:title", content: "Technologies — DIMISI.tech" },
      { property: "og:description", content: "TypeScript, React, Rust, Go, AWS, Kubernetes, AI — our full toolbox." },
    ],
  }),
  component: TechnologiesPage,
});

function TechnologiesPage() {
  const categories = Array.from(new Set(technologies.map((t) => t.category)));
  return (
    <div className="px-4 lg:px-6 pt-40 pb-20">
      <div className="mx-auto max-w-7xl">
        <GradientBadge className="mb-6">Technologies</GradientBadge>
        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight max-w-4xl text-balance">
          The <span className="text-gradient">modern stack</span>, mastered.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          We are pragmatic polyglots. These are the technologies we reach for most often.
        </p>

        <div className="mt-16 space-y-12">
          {categories.map((cat, ci) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: ci * 0.05 }}
            >
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">
                {cat}
              </h2>
              <div className="flex flex-wrap gap-3">
                {technologies
                  .filter((t) => t.category === cat)
                  .map((t) => (
                    <div
                      key={t.name}
                      className="glass px-5 py-3 rounded-xl font-mono text-sm hover:border-white/30 hover:-translate-y-0.5 transition-all"
                    >
                      {t.name}
                    </div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
