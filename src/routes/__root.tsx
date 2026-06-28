import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProvider } from "@/components/scroll/ScrollProvider";
import { GlobalStarfield } from "@/components/background/GlobalStarfield";
import { Preloader } from "@/components/Preloader";
import { useReveal } from "@/hooks/useReveal";


const CosmosCanvas = lazy(() =>
  import("@/components/3d/CosmosCanvas").then((m) => ({ default: m.CosmosCanvas })),
);

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-8xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Lost in the digital universe</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for is in a different orbit.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center rounded-full bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] px-6 py-3 text-sm font-medium"
        >
          Return to base
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">Something disrupted the signal</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center rounded-full bg-gradient-to-r from-[#3B82F6] to-[#7C3AED] px-5 py-2 text-sm font-medium"
          >
            Try again
          </button>
          <a href="/" className="inline-flex items-center rounded-full glass px-5 py-2 text-sm">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DIMISI.tech — We build the future of digital innovation" },
      {
        name: "description",
        content:
          "DIMISI Technologies engineers world-class software, AI systems, cloud platforms and digital products for the companies shaping what comes next.",
      },
      { name: "author", content: "DIMISI Technologies Pvt Ltd" },
      { name: "theme-color", content: "#050B18" },
      { property: "og:title", content: "DIMISI.tech — Future of digital innovation" },
      { property: "og:description", content: "Engineering world-class software, AI, cloud and digital products." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body style={{ backgroundColor: "#05000f" }}>
        <GlobalStarfield />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useReveal();
  return (
    <QueryClientProvider client={queryClient}>
      <ScrollProvider>
        <ClientOnly fallback={null}>
          <Suspense fallback={null}>
            <CosmosCanvas />
          </Suspense>
        </ClientOnly>
        <ClientOnly fallback={null}>
          <Preloader />
        </ClientOnly>
        <Navbar />
        <main className="relative">
          <Outlet />
        </main>
        <Footer />
      </ScrollProvider>
    </QueryClientProvider>
  );
}

