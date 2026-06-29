import { ArrowRight, ChevronDown, Sparkles, Play, TrendingUp, Activity, Globe as Globe2, ShieldCheck, Cpu, Layers } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { GradientBadge } from "@/components/ui/GradientBadge";
import heroVideo from "@/assets/hero-space.mp4.asset.json";

const insights = [
  { label: "Deployments", value: "1.2M+", delta: "+24.6%", icon: Activity },
  { label: "Data Points", value: "8.6TB", delta: "+32.1%", icon: TrendingUp },
  { label: "Global Nodes", value: "320+", delta: "+18.7%", icon: Globe2 },
];

const features = [
  {
    icon: Cpu,
    title: "AI Orchestration",
    body: "Intelligent automation that adapts and evolves with every signal.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Infrastructure",
    body: "Enterprise-grade security built for the regulated future.",
  },
  {
    icon: Layers,
    title: "Scalable Ecosystem",
    body: "Connect, integrate and scale across products without limits.",
  },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center px-4 lg:px-8 pt-28 pb-24 overflow-hidden">
      {/* Full-bleed cinematic space video — hero centerpiece */}
      <div className="absolute inset-0 -z-[5] pointer-events-none overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={heroVideo.url}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          style={{ opacity: 0.45, mixBlendMode: "screen" }}
        />
        {/* Vignette + readability veil */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 45%, rgba(5,0,16,0) 0%, rgba(5,0,16,0.35) 55%, rgba(5,0,16,0.88) 100%), linear-gradient(180deg, rgba(5,0,16,0.55) 0%, rgba(20,8,38,0.15) 40%, rgba(5,0,16,0.92) 100%)",
          }}
        />
        {/* Purple nebula wash */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 18% 22%, rgba(124,58,237,0.28), transparent 55%), radial-gradient(ellipse at 82% 78%, rgba(232,121,249,0.22), transparent 55%)",
            mixBlendMode: "screen",
          }}
        />
      </div>


      <div className="mx-auto w-full max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
          {/* Left — copy */}
          <div className="text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-6"
            >
              <GradientBadge>
                <Sparkles className="size-3" /> Next generation platform
              </GradientBadge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.95]"
            >
              Powering the<br />
              future of{" "}
              <span className="text-gradient">Intelligence</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-7 text-base lg:text-lg text-muted-foreground max-w-xl"
            >
              DIMISI is an AI-native engineering studio building software, cloud and intelligent
              systems for companies shaping what comes next. Future-ready. Human-centered.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mt-10 flex flex-col sm:flex-row gap-3"
            >
              <Link
                to="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#00D4FF] via-[#0088FF] to-[#0050A0] px-7 py-4 text-sm font-medium shadow-[0_10px_50px_-10px_rgba(0,212,255,0.5)] hover:scale-[1.03] transition-all"
              >
                Explore Platform
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 rounded-full glass px-7 py-4 text-sm font-medium hover:border-white/30"
              >
                <span className="grid place-items-center size-6 rounded-full bg-white/10">
                  <Play className="size-3 ml-0.5" />
                </span>
                Watch Intro
              </Link>
            </motion.div>
          </div>

          {/* Right — Real-time insights panel */}
          <motion.aside
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="hidden lg:block"
          >
            <div className="glass-strong rounded-2xl p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
                  Real-time insights
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
              </div>
              <div className="space-y-3">
                {insights.map((it) => {
                  const Icon = it.icon;
                  return (
                    <div
                      key={it.label}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4"
                    >
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {it.label}
                        </div>
                        <div className="text-2xl font-bold mt-1">{it.value}</div>
                      </div>
                      <div className="text-right">
                        <Icon className="size-4 text-[#00D4FF] ml-auto" />
                        <div className="mt-2 text-xs text-emerald-400 font-mono">{it.delta}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                  System status
                  <span className="text-emerald-400 font-mono">100%</span>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-[#00D4FF] via-[#0088FF] to-[#0050A0]" />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">All systems operational</div>
              </div>
            </div>
          </motion.aside>
        </div>

        {/* Bottom feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group glass rounded-2xl p-5 hover:border-white/20 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="grid place-items-center size-11 rounded-xl bg-gradient-to-br from-[#00D4FF]/20 to-[#0050A0]/20 border border-white/10">
                    <Icon className="size-5 text-[#D8B4FE]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-[0.18em] text-foreground">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                    <Link
                      to="/services"
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-[#D8B4FE] hover:text-white transition-colors"
                    >
                      Learn more <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-muted-foreground"
      >
        Scroll to explore
        <ChevronDown className="size-4 animate-bounce" />
      </motion.div>
    </section>
  );
}
