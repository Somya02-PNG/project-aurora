import { Link } from "@tanstack/react-router";
import { services } from "@/lib/mockData";
import { Github, Linkedin, Twitter, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-white/5 bg-background/40 backdrop-blur-xl">
      <div
        aria-hidden
        className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent"
      />
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-20">
        <div className="grid lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-8 rounded-lg bg-gradient-to-br from-[#3B82F6] via-[#7C3AED] to-[#06B6D4]" />
              <span className="font-bold text-lg">DIMISI.tech</span>
            </div>
            <p className="text-muted-foreground max-w-md text-balance">
              We build the future of digital innovation. Engineering world-class software, AI
              systems, cloud platforms and immersive digital products.
            </p>
            <Link
              to="/contact"
              className="mt-8 group inline-flex items-center gap-2 text-2xl lg:text-4xl font-bold tracking-tight"
            >
              <span className="text-gradient">Let's build together</span>
              <ArrowUpRight className="size-7 lg:size-9 text-white/60 group-hover:rotate-45 group-hover:text-white transition-all" />
            </Link>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-mono mb-4">
              Services
            </h4>
            <ul className="space-y-2.5">
              {services.slice(0, 7).map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-mono mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="text-white/70 hover:text-white">About</Link></li>
              <li><Link to="/case-studies" className="text-white/70 hover:text-white">Case Studies</Link></li>
              <li><Link to="/technologies" className="text-white/70 hover:text-white">Technologies</Link></li>
              <li><Link to="/industries" className="text-white/70 hover:text-white">Industries</Link></li>
              <li><Link to="/contact" className="text-white/70 hover:text-white">Contact</Link></li>
            </ul>
            <div className="mt-8 flex gap-3">
              <a aria-label="Twitter" href="#" className="glass rounded-full p-2 hover:border-white/30"><Twitter className="size-4" /></a>
              <a aria-label="LinkedIn" href="#" className="glass rounded-full p-2 hover:border-white/30"><Linkedin className="size-4" /></a>
              <a aria-label="GitHub" href="#" className="glass rounded-full p-2 hover:border-white/30"><Github className="size-4" /></a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 text-xs font-mono text-muted-foreground uppercase tracking-[0.15em]">
          <span>© {new Date().getFullYear()} DIMISI Technologies Pvt Ltd</span>
          <span>Engineered in the digital universe</span>
        </div>
      </div>
    </footer>
  );
}
