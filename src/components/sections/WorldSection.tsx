import { motion } from "framer-motion";
import { GradientBadge } from "@/components/ui/GradientBadge";
import { GlassCard } from "@/components/ui/GlassCard";
import { AlertTriangle, Network, Timer } from "lucide-react";

const problems = [
  {
    icon: Network,
    title: "Fragmented systems",
    body: "Teams duct-tape together legacy stacks that drag every release.",
  },
  {
    icon: Timer,
    title: "Slow delivery",
    body: "Quarter-long ship cycles in a world that moves week by week.",
  },
  {
    icon: AlertTriangle,
    title: "Scaling pain",
    body: "Infrastructure and architecture buckle exactly when growth arrives.",
  },
];

export function WorldSection() {
  return (
    <section className="relative min-h-screen flex items-center px-4 lg:px-6 py-24">
      <div className="mx-auto max-w-7xl w-full">
        <div className="max-w-3xl mb-16">
          <GradientBadge className="mb-6">The challenge</GradientBadge>
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-balance">
            A connected world,{" "}
            <span className="text-gradient">disconnected systems.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Every modern business runs on software. Most of that software is held together by hope.
            DIMISI replaces that with engineering.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <GlassCard className="h-full">
                <div className="size-12 rounded-xl bg-gradient-to-br from-[#A855F7]/30 to-[#7C3AED]/30 flex items-center justify-center mb-5 border border-white/10">
                  <p.icon className="size-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
