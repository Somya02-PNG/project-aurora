import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials } from "@/lib/mockData";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientBadge } from "@/components/ui/GradientBadge";

export function TestimonialsSection() {
  return (
    <section
      className="relative px-4 lg:px-6 reveal-on-scroll"
      style={{ paddingTop: "clamp(64px, 8vw, 120px)", paddingBottom: "clamp(64px, 8vw, 120px)" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl mb-12">
          <GradientBadge className="mb-6">Trust</GradientBadge>
          <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-balance">
            Words from the teams <span className="text-gradient">we build with.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <GlassCard className="h-full">
                <Quote className="size-6 text-[#00D4FF] mb-4" />
                <p className="text-base leading-relaxed text-white/85">{t.quote}</p>
                <div className="mt-6 pt-4 border-t border-white/5">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground font-mono uppercase tracking-wider mt-0.5">
                    {t.title}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
