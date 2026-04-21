import { Outlet, Link, createRootRoute, HeadContent, Scripts, useLocation, Navigate } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AppProvider, useApp } from "../lib/app-context";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "A web platform unifying HR operations and buffet services for employees, managers, HR admins, and canteen staff." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "A web platform unifying HR operations and buffet services for employees, managers, HR admins, and canteen staff." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Lovable App" },
      { name: "twitter:description", content: "A web platform unifying HR operations and buffet services for employees, managers, HR admins, and canteen staff." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0aee64f6-1190-41e9-803d-a45ed9bd6b12/id-preview-39ce948a--b1f21d3f-4313-400c-8f6f-bda297043333.lovable.app-1776796572748.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0aee64f6-1190-41e9-803d-a45ed9bd6b12/id-preview-39ce948a--b1f21d3f-4313-400c-8f6f-bda297043333.lovable.app-1776796572748.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AppProvider>
      <AuthGuard>
        <Outlet />
      </AuthGuard>
    </AppProvider>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  const location = useLocation();

  if (!isAuthenticated && location.pathname !== "/login") {
    return <Navigate to="/login" />;
  }

  if (isAuthenticated && location.pathname === "/login") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
