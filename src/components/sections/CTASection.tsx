import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { GradientBadge } from "@/components/ui/GradientBadge";

export function CTASection() {
  return (
    <section className="relative flex items-center justify-center px-4 lg:px-6 overflow-hidden bg-section-cta reveal-on-scroll" style={{ paddingTop: "clamp(48px, 6vw, 80px)", paddingBottom: "clamp(48px, 6vw, 80px)" }}>
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(124,58,237,0.3), transparent 50%), radial-gradient(circle at 50% 50%, rgba(168,85,247,0.25), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-8"
        >
          <GradientBadge>
            <Sparkles className="size-3" /> Limited 2026 engagements
          </GradientBadge>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-5xl sm:text-7xl lg:text-9xl font-bold tracking-tight leading-[0.9] text-balance"
        >
          Let's build{" "}
          <span className="text-gradient">something remarkable</span> together.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/contact"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A855F7] via-[#7C3AED] to-[#E879F9] px-8 py-5 text-base font-medium shadow-[0_20px_80px_-15px_rgba(124,58,237,0.8)] hover:scale-[1.03] transition-all"
          >
            Book Consultation
            <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/case-studies"
            className="inline-flex items-center justify-center gap-2 rounded-full glass px-8 py-5 text-base font-medium hover:border-white/30"
          >
            View Our Work
          </Link>
        </motion.div>

        <p className="mt-12 text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground">
          hello@dimisi.tech · Mumbai · Bengaluru · Remote
        </p>
      </div>
    </section>
  );
}
