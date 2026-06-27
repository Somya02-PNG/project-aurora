import { createFileRoute } from "@tanstack/react-router";
import { services } from "@/lib/mockData";
import { getServiceContent } from "@/lib/serviceContent";
import { ServiceDetail } from "@/components/sections/ServiceDetail";

const service = services.find((s) => s.slug === "cloud-services")!;
const c = getServiceContent("cloud-services");

export const Route = createFileRoute("/services/cloud-services")({
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
