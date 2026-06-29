import { lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { HeroOverlay } from "@/components/sections/HeroOverlay";
import { AboutSection } from "@/components/sections/AboutSection";
import { WorldSection } from "@/components/sections/WorldSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { ProofSection } from "@/components/sections/ProofSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CTASection } from "@/components/sections/CTASection";
import { GradualBlur } from "@/components/ui/GradualBlur";

// HomeJourneyCanvas reserved for future re-enable; GlobalBackground is the active backdrop.
void lazy;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DIMISI.tech — We build the future of digital innovation" },
      {
        name: "description",
        content:
          "Engineering world-class software, AI systems, cloud platforms and digital products. One cinematic 3D journey through the work of DIMISI.",
      },
    ],
  }),
  component: Home,
});

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative" style={{ background: "transparent" }}>
      {children}
      <GradualBlur position="bottom" />
    </div>
  );
}

function Home() {
  return (
    <div className="relative flex flex-col" style={{ gap: 0 }}>
      <Section><HeroOverlay /></Section>
      <Section><AboutSection /></Section>
      <Section><WorldSection /></Section>
      <Section><ServicesSection /></Section>
      <Section><ProofSection /></Section>
      <Section><StatsSection /></Section>
      <Section><TestimonialsSection /></Section>
      <CTASection />
    </div>
  );
}

