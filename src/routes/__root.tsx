import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter, useNavigate,
  HeadContent, Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";

const PUBLIC_ROUTES = new Set(["/splash", "/auth", "/role-select", "/admin-login"]);

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-navy">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-gold px-4 py-2 text-sm font-medium text-gold-foreground">
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md bg-navy px-4 py-2 text-sm text-navy-foreground"
          >Try again</button>
          <a href="/" className="rounded-md border px-4 py-2 text-sm">Go home</a>
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
      { name: "theme-color", content: "#0B2545" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Property Hub USA" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "NGpropertyHUB" },
      { property: "og:title", content: "NGpropertyHUB" },
      { name: "twitter:title", content: "NGpropertyHUB" },
      { name: "description", content: "No. 1 Real Estate Market in the US" },
      { property: "og:description", content: "No. 1 Real Estate Market in the US" },
      { name: "twitter:description", content: "No. 1 Real Estate Market in the US" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Property Hub USA",
          url: "https://app.ngpropertyhub.com",
          logo: "https://app.ngpropertyhub.com/favicon.ico",
          description:
            "The #1 U.S. real estate platform — verified listings, smart escrow, AI valuations, fractional investments, and crypto payments across all 50 states.",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LayoutShell />
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function LayoutShell() {
  const path = useRouter().state.location.pathname;
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isPublic = PUBLIC_ROUTES.has(path);
  const hideChrome = isPublic;

  useEffect(() => {
    if (loading) return;
    if (!user && !isPublic) {
      navigate({ to: "/splash", replace: true });
    }
  }, [user, loading, isPublic, path, navigate]);

  if (!loading && !user && !isPublic) return null;

  return (
    <div className="min-h-screen flex flex-col">
      {!hideChrome && <Navbar />}
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
      {!hideChrome && <Footer />}
      {!hideChrome && <BottomNav />}
      <FloatingWhatsApp />
      {!hideChrome && <ScrollToTopButton />}
    </div>
  );
}
