import { createFileRoute } from "@tanstack/react-router";
import { SpaceHero } from "@/components/hero/SpaceHero";
import { WorldSection } from "@/components/sections/WorldSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProofSection } from "@/components/sections/ProofSection";
import { CTASection } from "@/components/sections/CTASection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DIMISI.tech — We build the future of digital innovation" },
      {
        name: "description",
        content:
          "Engineering world-class software, AI systems, cloud platforms and digital products. Trusted by Fortune 500s and breakout startups.",
      },
      { property: "og:title", content: "DIMISI.tech — Digital innovation, engineered." },
      {
        property: "og:description",
        content: "Software, AI, cloud, DevOps and consulting from a senior engineering team.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="relative">
      <SpaceHero />
      <WorldSection />
      <ServicesSection />
      <ProofSection />
      <CTASection />
    </div>
  );
}
