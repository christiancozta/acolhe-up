import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/atendimentos", label: "Atendimentos" },
  { to: "/novo", label: "Novo", strong: true },
  { to: "/visao-geral", label: "Visão geral" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="page-gutter sticky top-0 z-20 hidden grid-cols-[1fr_auto] items-stretch border-b border-line bg-background/95 backdrop-blur-sm md:grid">
        <Link to="/" className="flex min-h-18 items-center gap-4 pr-8">
          <span className="text-[0.9rem] font-semibold tracking-[-0.015em]">Acolhimento</span>
          <span className="label-xs text-subtle">Projeto Kelvin</span>
        </Link>
        <nav className="flex items-stretch" aria-label="Navegação principal">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "label-xs flex min-h-18 items-center border-l border-line px-5 transition-colors",
                !n.strong && isActive(n.to) && "bg-accent-soft text-accent",
                !n.strong && !isActive(n.to) && "text-muted hover:bg-sunken hover:text-accent",
                n.strong && "bg-accent text-accent-foreground hover:bg-foreground",
              )}
            >
              {n.strong ? "+ " : ""}
              {n.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      <footer className="page-gutter w-full">
        <div className="grid border-t border-line py-5 md:grid-cols-[1fr_auto] md:items-center">
          <p className="text-[0.64rem] tracking-[0.08em] uppercase text-subtle">
            Protótipo. Armazenamento local. Não inserir dados reais.
          </p>
          <p className="label-xs mt-2 text-accent md:mt-0">Acolhe Up</p>
        </div>
      </footer>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-background/98 md:hidden"
        aria-label="Navegação principal"
      >
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className={cn(
              "relative flex min-h-16 items-center justify-center border-r border-line px-1 text-center transition-colors last:border-r-0",
              isActive(n.to) ? "bg-accent-soft text-accent" : "text-muted",
              n.strong && !isActive(n.to) && "bg-accent text-accent-foreground",
              n.strong && isActive(n.to) && "bg-accent text-accent-foreground",
            )}
          >
            <span className="label-xs">
              {n.strong ? "+ " : ""}
              {n.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("page-gutter w-full", className)}>{children}</div>;
}

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="border-b border-foreground pt-12 pb-8 md:pt-20 md:pb-10">
      <h1 className="max-w-4xl text-[2.75rem] leading-[0.95] font-semibold tracking-[-0.055em] md:text-[4.4rem]">
        {title}
      </h1>
      {sub ? (
        <p className="mt-5 max-w-2xl text-[0.9rem] leading-relaxed text-muted md:text-base">
          {sub}
        </p>
      ) : null}
    </div>
  );
}
