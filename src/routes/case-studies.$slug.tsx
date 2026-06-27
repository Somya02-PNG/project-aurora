import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { caseStudies } from "@/lib/mockData";
import { GradientBadge } from "@/components/ui/GradientBadge";
import { GlassCard } from "@/components/ui/GlassCard";

export const Route = createFileRoute("/case-studies/$slug")({
  head: ({ params }) => {
    const c = caseStudies.find((x) => x.slug === params.slug);
    const title = c ? `${c.title} — DIMISI.tech` : "Case Study — DIMISI.tech";
    const desc = c?.summary ?? "DIMISI case study";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  loader: ({ params }) => {
    const c = caseStudies.find((x) => x.slug === params.slug);
    if (!c) throw notFound();
    return c;
  },
  notFoundComponent: () => (
    <div className="px-4 pt-40 pb-20 mx-auto max-w-3xl text-center">
      <h1 className="text-4xl font-bold">Case study not found</h1>
      <Link to="/case-studies" className="mt-6 inline-block text-muted-foreground hover:text-white">
        ← All work
      </Link>
    </div>
  ),
  component: CaseStudyPage,
});

function CaseStudyPage() {
  const c = Route.useLoaderData();
  const others = caseStudies.filter((x) => x.slug !== c.slug).slice(0, 2);

  return (
    <div className="pt-32 pb-20">
      {/* Hero */}
      <div className="px-4 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-white"
          >
            <ArrowLeft className="size-3.5" /> All work
          </Link>

          <div
            className="mt-8 h-[55vh] rounded-3xl relative overflow-hidden border border-white/10"
            style={{ background: c.cover }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 p-8 lg:p-14 flex flex-col justify-end">
              <div className="flex flex-wrap gap-2 mb-6">
                <GradientBadge>{c.industry}</GradientBadge>
                <span className="glass px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider">
                  {c.year}
                </span>
              </div>
              <div className="text-sm font-mono uppercase tracking-[0.18em] text-white/70 mb-3">
                {c.client}
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight max-w-4xl text-balance">
                {c.title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 lg:px-6 mt-16">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <GlassCard hover={false}>
              <h2 className="text-2xl font-semibold mb-4">The challenge</h2>
              <p className="text-muted-foreground leading-relaxed">
                {c.client} was facing a critical inflection point. The existing systems could not
                keep pace with the velocity, scale or ambition of the business. They needed an
                engineering partner who could move fast without breaking what mattered.
              </p>
            </GlassCard>
            <GlassCard hover={false}>
              <h2 className="text-2xl font-semibold mb-4">What we built</h2>
              <p className="text-muted-foreground leading-relaxed">{c.summary}</p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Working in tight, autonomous squads, we delivered the platform in a series of
                production-grade increments — each measurable, each shipped behind feature flags,
                each instrumented for observability from day one.
              </p>
            </GlassCard>
          </div>
          <div className="space-y-4">
            <GlassCard hover={false}>
              <h3 className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground mb-4">
                Outcome
              </h3>
              <div className="space-y-5">
                {c.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="text-3xl font-bold text-gradient">{m.value}</div>
                    <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-1">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
            <GlassCard hover={false}>
              <h3 className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground mb-3">
                Services
              </h3>
              <div className="flex flex-wrap gap-2">
                {c.services.map((s) => (
                  <span key={s} className="text-xs font-mono px-2.5 py-1 rounded bg-white/5 border border-white/5">
                    {s}
                  </span>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Other work */}
      <div className="px-4 lg:px-6 mt-24">
        <div className="mx-auto max-w-7xl">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-6">
            More work
          </h3>
          <div className="grid md:grid-cols-2 gap-5">
            {others.map((o) => (
              <Link
                key={o.slug}
                to="/case-studies/$slug"
                params={{ slug: o.slug }}
                className="group glass rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-500"
              >
                <div className="h-40" style={{ background: o.cover }} />
                <div className="p-6">
                  <div className="text-xs font-mono uppercase tracking-[0.18em] text-muted-foreground mb-1">
                    {o.client}
                  </div>
                  <div className="font-semibold flex items-center justify-between">
                    {o.title}
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
