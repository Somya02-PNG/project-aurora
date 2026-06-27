import { createFileRoute } from "@tanstack/react-router";
import { services } from "@/lib/mockData";
import { getServiceContent } from "@/lib/serviceContent";
import { ServiceDetail } from "@/components/sections/ServiceDetail";

const service = services.find((s) => s.slug === "devops")!;
const c = getServiceContent("devops");

export const Route = createFileRoute("/services/devops")({
  head: () => ({
    meta: [
      { title: c.metaTitle },
      { name: "description", content: c.metaDescription },
      { property: "og:title", content: c.metaTitle },
      { property: "og:description", content: c.metaDescription },
    ],
  }),
  component: () => <ServiceDetail service={service} />,
});
