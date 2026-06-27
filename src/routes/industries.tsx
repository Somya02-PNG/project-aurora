import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { industries } from "@/lib/mockData";
import { GradientBadge } from "@/components/ui/GradientBadge";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries — DIMISI.tech" },
      { name: "description", content: "Industries we serve — fintech, healthcare, commerce, logistics and more." },
      { property: "og:title", content: "Industries — DIMISI.tech" },
      { property: "og:description", content: "Deep domain expertise across 18+ industries." },
    ],
  }),
  component: IndustriesPage,
});

function IndustriesPage() {
  return (
    <div className="px-4 lg:px-6 pt-40 pb-20">
      <div className="mx-auto max-w-7xl">
        <GradientBadge className="mb-6">Industries</GradientBadge>
        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight max-w-4xl text-balance">
          We speak <span className="text-gradient">your industry</span>.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Domain expertise across the verticals where software has to be right the first time.
        </p>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {industries.map((i, idx) => (
            <motion.div
              key={i.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (idx % 4) * 0.08 }}
              className="group glass rounded-2xl p-6 hover:-translate-y-1 transition-all duration-500"
            >
              <div className="size-12 rounded-xl bg-gradient-to-br from-[#3B82F6]/30 to-[#7C3AED]/30 flex items-center justify-center mb-5 border border-white/10">
                <i.icon className="size-5" />
              </div>
              <h3 className="text-lg font-semibold mb-1.5">{i.name}</h3>
              <p className="text-sm text-muted-foreground">{i.blurb}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
