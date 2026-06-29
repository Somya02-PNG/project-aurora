import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { HeroOverlay } from "@/components/sections/HeroOverlay";
import { AboutSection } from "@/components/sections/AboutSection";
import { WorldSection } from "@/components/sections/WorldSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { ProofSection } from "@/components/sections/ProofSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CTASection } from "@/components/sections/CTASection";

const HomeJourneyCanvas = lazy(() =>
  import("@/components/3d/HomeJourneyCanvas").then((m) => ({ default: m.HomeJourneyCanvas })),
);

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

function Home() {
  return (
    <>
      {/* HomeJourneyCanvas removed — GlobalBackground is the unified site background. */}
      <div className="relative flex flex-col" style={{ gap: 0 }}>

        <HeroOverlay />
        <AboutSection />
        <WorldSection />
        <ServicesSection />
        <ProofSection />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
      </div>
    </>
  );
}
