import { GradientBadge } from "@/components/ui/GradientBadge";
import { GlassCard } from "@/components/ui/GlassCard";
import { Brain, Users, Sparkles } from "lucide-react";

const pillars = [
  { icon: Users, title: "Human-centered", body: "Senior engineers and designers working as one team with yours." },
  { icon: Brain, title: "AI-native", body: "Every product engineered with intelligence baked into the core." },
  { icon: Sparkles, title: "Cinematic craft", body: "Performance, polish and detail you can feel in every interaction." },
];

export function AboutSection() {
  return (
    <section
      className="relative px-4 lg:px-6 reveal-on-scroll"
      style={{ paddingTop: "clamp(64px, 8vw, 120px)", paddingBottom: "clamp(64px, 8vw, 120px)" }}
    >
      <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <GradientBadge className="mb-6">Who we are</GradientBadge>
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-balance">
            Humans and machines, <span className="text-gradient">building together.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            DIMISI is a tightly-knit collective of engineers, designers and AI researchers
            crafting the products that define what comes next.
          </p>
        </div>
        <div className="grid gap-4">
          {pillars.map((p) => (
            <GlassCard key={p.title}>
              <div className="flex items-start gap-4">
                <div className="size-12 shrink-0 rounded-xl bg-gradient-to-br from-[#A855F7]/30 to-[#22d3ee]/30 flex items-center justify-center border border-white/10">
                  <p.icon className="size-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{p.body}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
