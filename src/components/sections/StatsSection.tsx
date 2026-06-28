import { stats } from "@/lib/mockData";
import { CountUp } from "@/components/ui/CountUp";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientBadge } from "@/components/ui/GradientBadge";

export function StatsSection() {
  return (
    <section
      className="relative px-4 lg:px-6 reveal-on-scroll"
      style={{ paddingTop: "clamp(64px, 8vw, 120px)", paddingBottom: "clamp(64px, 8vw, 120px)" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl mb-12">
          <GradientBadge className="mb-6">By the numbers</GradientBadge>
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-balance">
            Growth, scale, <span className="text-gradient">intelligence.</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>
    </section>
  );
}
