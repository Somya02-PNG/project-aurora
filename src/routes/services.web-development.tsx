import { createFileRoute } from "@tanstack/react-router";
import { services } from "@/lib/mockData";
import { getServiceContent } from "@/lib/serviceContent";
import { ServiceDetail } from "@/components/sections/ServiceDetail";

const service = services.find((s) => s.slug === "web-development")!;
const c = getServiceContent("web-development");

export const Route = createFileRoute("/services/web-development")({
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
