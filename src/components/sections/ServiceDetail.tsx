import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Service } from "@/lib/mockData";
import { services, caseStudies } from "@/lib/mockData";
import { getServiceContent } from "@/lib/serviceContent";
import { GradientBadge } from "@/components/ui/GradientBadge";
import { GlassCard } from "@/components/ui/GlassCard";

export function ServiceDetail({ service }: { service: Service }) {
  const content = getServiceContent(service.slug);
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const related = caseStudies.filter((c) => content.caseStudySlugs.includes(c.slug));
  const Icon = service.icon;

  return (
    <div className="px-4 lg:px-6 pt-40 pb-24">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/services"
          className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-white"
        >
          ← All services
        </Link>

        {/* 1. HERO */}
        <div className="mt-8 grid lg:grid-cols-[1fr_auto] gap-12 items-start">
          <div className="max-w-3xl">
            <GradientBadge className="mb-6">{service.title}</GradientBadge>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-balance">
              {content.tagline}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">{service.description}</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#3B82F6] via-[#7C3AED] to-[#06B6D4] px-6 py-3 text-sm font-medium shadow-[0_10px_40px_-10px_rgba(124,58,237,0.7)] hover:scale-[1.02] transition-all"
              >
                Book Consultation
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/case-studies"
                className="inline-flex items-center justify-center gap-2 rounded-full glass px-6 py-3 text-sm font-medium hover:border-white/30"
              >
                View Case Studies
              </Link>
            </div>
          </div>
          <div
            className="size-32 rounded-3xl flex items-center justify-center border border-white/10 shrink-0"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${service.color}55, transparent 70%)`,
              boxShadow: `0 0 80px ${service.color}55`,
            }}
          >
            <Icon className="size-14" style={{ color: service.color }} />
          </div>
        </div>

        {/* 2. OVERVIEW */}
        <section className="mt-24 grid lg:grid-cols-[1fr_2fr] gap-10 items-start">
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight">Overview</h2>
          <div className="space-y-5 text-lg text-muted-foreground leading-relaxed">
            {content.overview.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {/* 3. BENEFITS */}
        <section className="mt-24">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight">
              Why teams choose us for {service.title.toLowerCase()}
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              The outcomes that matter to product, engineering and executive teams.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {content.benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <GlassCard className="h-full">
                  <div
                    className="size-11 rounded-xl flex items-center justify-center mb-4 border border-white/10"
                    style={{
                      background: `linear-gradient(135deg, ${service.color}33, transparent)`,
                    }}
                  >
                    <b.icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.body}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. DELIVERY PROCESS */}
        <section className="mt-24">
          <GradientBadge className="mb-5">Delivery Process</GradientBadge>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-12">
            How we deliver — step by step
          </h2>
          <ol className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 relative">
            {content.process.map((step, i) => (
              <li key={step.title} className="relative">
                <GlassCard className="h-full" hover={false}>
                  <div className="text-xs font-mono text-muted-foreground mb-3">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div
                    className="size-10 rounded-lg flex items-center justify-center mb-4 border border-white/10"
                    style={{
                      background: `linear-gradient(135deg, ${service.color}33, transparent)`,
                    }}
                  >
                    <step.icon className="size-5" />
                  </div>
                  <div className="font-semibold mb-1.5">{step.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{step.body}</div>
                </GlassCard>
              </li>
            ))}
          </ol>
        </section>

        {/* 5. TECHNOLOGIES */}
        <section className="mt-24 grid lg:grid-cols-2 gap-8">
          <GlassCard hover={false}>
            <h2 className="text-2xl font-semibold mb-2">Capabilities</h2>
            <p className="text-sm text-muted-foreground mb-6">
              What's included in a typical {service.title.toLowerCase()} engagement.
            </p>
            <ul className="space-y-3">
              {service.capabilities.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <Check className="size-5 text-[#06B6D4] shrink-0 mt-0.5" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard hover={false}>
            <h2 className="text-2xl font-semibold mb-2">Technologies we use</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Battle-tested stacks chosen per project, not by fashion.
            </p>
            <div className="flex flex-wrap gap-2">
              {content.technologies.map((t) => (
                <span
                  key={t}
                  className="glass px-4 py-2 rounded-full text-sm font-mono text-white/85"
                >
                  {t}
                </span>
              ))}
            </div>
            <Link
              to="/technologies"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white"
            >
              Explore our full stack <ArrowRight className="size-4" />
            </Link>
          </GlassCard>
        </section>

        {/* 6. RELATED CASE STUDIES */}
        {related.length > 0 && (
          <section className="mt-24">
            <GradientBadge className="mb-5">Proof</GradientBadge>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight mb-10">
              Related case studies
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {related.map((c) => (
                <Link
                  key={c.slug}
                  to="/case-studies/$slug"
                  params={{ slug: c.slug }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 p-7 hover:-translate-y-1 transition-all"
                  style={{ background: c.cover }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="relative z-10">
                    <div className="text-xs font-mono uppercase tracking-[0.2em] text-white/70">
                      {c.industry} · {c.year}
                    </div>
                    <div className="mt-3 text-2xl font-semibold">{c.title}</div>
                    <p className="mt-3 text-sm text-white/85 line-clamp-2">{c.summary}</p>
                    <div className="mt-6 flex gap-5 text-xs">
                      {c.metrics.slice(0, 3).map((m) => (
                        <div key={m.label}>
                          <div className="text-lg font-semibold">{m.value}</div>
                          <div className="text-white/70">{m.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
                      Read case study
                      <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 7. FAQ */}
        <section className="mt-24 grid lg:grid-cols-[1fr_2fr] gap-10 items-start">
          <div>
            <GradientBadge className="mb-5">FAQ</GradientBadge>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight">
              Common questions
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Don't see your question? <Link to="/contact" className="text-white underline">Ask us directly</Link>.
            </p>
          </div>
          <Accordion type="single" collapsible className="glass rounded-2xl px-6">
            {content.faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-white/10">
                <AccordionTrigger className="text-left text-base font-medium">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* 8. FINAL CTA */}
        <section className="mt-24">
          <div
            className="relative overflow-hidden rounded-3xl border border-white/10 p-10 lg:p-14 text-center"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${service.color}33, transparent 60%), rgba(10,15,30,0.6)`,
            }}
          >
            <h2 className="text-3xl lg:text-5xl font-semibold tracking-tight text-balance">
              Ready to start your {service.title.toLowerCase()} project?
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Book a 30-minute consultation with a senior engineer. No sales script — just a real
              conversation about what you're trying to ship.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#3B82F6] via-[#7C3AED] to-[#06B6D4] px-7 py-3.5 text-sm font-medium"
              >
                Book Consultation <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/case-studies"
                className="inline-flex items-center justify-center gap-2 rounded-full glass px-7 py-3.5 text-sm font-medium"
              >
                View Related Case Studies
              </Link>
            </div>
          </div>
        </section>

        {/* OTHER SERVICES */}
        <section className="mt-24">
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-6">
            Explore other services
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {others.map((o) => (
              <Link
                key={o.slug}
                to={`/services/${o.slug}` as never}
                className="group glass rounded-2xl p-5 hover:-translate-y-1 transition-all"
              >
                <o.icon className="size-6 mb-3" style={{ color: o.color }} />
                <div className="font-semibold">{o.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{o.short}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
