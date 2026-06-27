import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GradientBadge } from "@/components/ui/GradientBadge";
import { GlassCard } from "@/components/ui/GlassCard";
import { CountUp } from "@/components/ui/CountUp";
import { stats } from "@/lib/mockData";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — DIMISI.tech" },
      { name: "description", content: "A senior engineering team building the future of digital innovation." },
      { property: "og:title", content: "About — DIMISI.tech" },
      { property: "og:description", content: "Our mission, principles and the people behind DIMISI Technologies." },
    ],
  }),
  component: AboutPage,
});

const principles = [
  { title: "Senior-only", body: "Every engineer on every project is senior. No body shop, no resume mills." },
  { title: "Outcome over output", body: "We optimize for the metric that moves your business — not lines of code." },
  { title: "Engineering as craft", body: "Architecture is design. Testing is design. Naming is design. We sweat it all." },
  { title: "Ship every week", body: "Long roadmaps die in drawers. We ship value continuously, behind flags." },
];

function AboutPage() {
  return (
    <div className="px-4 lg:px-6 pt-40 pb-20">
      <div className="mx-auto max-w-7xl">
        <GradientBadge className="mb-6">About DIMISI</GradientBadge>
        <h1 className="text-5xl lg:text-8xl font-bold tracking-tight max-w-5xl text-balance leading-[1.02]">
          A small team of{" "}
          <span className="text-gradient">senior engineers</span> building unreasonably good software.
        </h1>
        <p className="mt-8 text-lg text-muted-foreground max-w-3xl">
          DIMISI Technologies is an engineering studio based in India and operating globally. We
          partner with founders, CTOs and enterprises to build the platforms, AI products and
          digital experiences that define their next chapter.
        </p>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <GlassCard key={s.label} hover={false} className="text-center py-10">
              <div className="text-4xl lg:text-5xl font-bold text-gradient">
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground">
                {s.label}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Principles */}
        <div className="mt-24">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-10">
            Principles we engineer by.
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {principles.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
              >
                <GlassCard className="h-full">
                  <div className="font-mono text-xs uppercase tracking-[0.2em] text-[#06B6D4] mb-3">
                    0{i + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{p.body}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div className="mt-24 glass-strong rounded-3xl p-10 lg:p-16 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 80% 20%, rgba(124,58,237,0.25), transparent 60%)",
            }}
          />
          <div className="relative">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">
              Our mission
            </div>
            <p className="text-3xl lg:text-5xl font-bold tracking-tight text-balance leading-[1.1]">
              To engineer the digital infrastructure of the next decade — and to make working with
              an engineering team feel like a creative partnership again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
