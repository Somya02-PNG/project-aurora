import { createFileRoute } from "@tanstack/react-router";
import { services } from "@/lib/mockData";
import { ServiceDetail } from "@/components/sections/ServiceDetail";

const service = services.find((s) => s.slug === "devops")!;

export const Route = createFileRoute("/services/devops")({
  head: () => ({
    meta: [
      { title: `${service.title} — DIMISI.tech` },
      { name: "description", content: service.description },
      { property: "og:title", content: `${service.title} — DIMISI.tech` },
      { property: "og:description", content: service.description },
    ],
  }),
  component: () => <ServiceDetail service={service} />,
});
