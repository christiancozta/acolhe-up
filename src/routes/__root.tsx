import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppShell } from "../components/AppShell";

function NotFoundComponent() {
  return (
    <div className="page-gutter flex min-h-dvh items-center bg-background">
      <div className="w-full border-y border-foreground py-12">
        <p className="label-xs text-accent">Erro 404</p>
        <h1 className="mt-5 text-[2.75rem] leading-none font-semibold tracking-[-0.055em] text-foreground md:text-[4.4rem]">
          Página não encontrada
        </h1>
        <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted">
          O endereço informado não existe ou foi movido.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center border border-accent bg-accent px-5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-foreground"
          >
            Voltar ao início
          </Link>
        </div>
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
    <div className="page-gutter flex min-h-dvh items-center bg-background">
      <div className="w-full border-y border-foreground py-12">
        <p className="label-xs text-accent">Falha de carregamento</p>
        <h1 className="mt-5 text-[2.75rem] leading-none font-semibold tracking-[-0.055em] text-foreground md:text-[4.4rem]">
          Não foi possível abrir esta página
        </h1>
        <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted">
          Tente carregar novamente ou volte ao início.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-12 items-center justify-center border border-accent bg-accent px-5 text-sm font-semibold text-accent-foreground transition-colors hover:bg-foreground"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex min-h-12 items-center justify-center border border-accent bg-background px-5 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Voltar ao início
          </a>
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
      { title: "Acolhimento | Acolhe Up" },
      {
        name: "description",
        content:
          "Registro e acompanhamento de demandas de pessoas migrantes. Protótipo funcional com armazenamento local.",
      },
      { property: "og:title", content: "Acolhimento | Acolhe Up" },
      {
        property: "og:description",
        content: "Registro e acompanhamento de demandas de pessoas migrantes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/acolhe-up/favicon.ico", type: "image/x-icon" },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
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
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AppShell>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </AppShell>
    </QueryClientProvider>
  );
}
