import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { GradientBadge } from "@/components/ui/GradientBadge";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 lg:px-6 pt-20">
      <div className="mx-auto max-w-6xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-8"
        >
          <GradientBadge>
            <Sparkles className="size-3" /> Now engineering 2026 platforms
          </GradientBadge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="text-5xl sm:text-6xl lg:text-8xl xl:text-9xl font-bold tracking-tight leading-[0.95] text-balance"
        >
          We build the{" "}
          <span className="text-gradient">future</span>
          <br />
          of digital innovation
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto text-balance"
        >
          Engineering world-class software, AI systems, cloud platforms and digital products for
          the companies shaping what comes next.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/contact"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#3B82F6] via-[#7C3AED] to-[#06B6D4] px-7 py-4 text-sm font-medium shadow-[0_10px_50px_-10px_rgba(124,58,237,0.7)] hover:scale-[1.03] transition-all"
          >
            Book Consultation
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2 rounded-full glass px-7 py-4 text-sm font-medium hover:border-white/30"
          >
            Explore Services
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground"
      >
        Scroll
        <ChevronDown className="size-4 animate-bounce" />
      </motion.div>
    </section>
  );
}
