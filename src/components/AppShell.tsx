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
      <header className="hidden border-b border-foreground md:block">
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-stretch px-6">
          <Link to="/" className="flex min-h-16 items-center gap-4 border-r border-line pr-6">
            <span className="text-[0.82rem] font-semibold tracking-[0.17em] uppercase">Acolhimento</span>
            <span className="h-1.5 w-1.5 bg-accent" aria-hidden />
            <span className="label-xs text-subtle">Projeto Kelvin · v0.1</span>
          </Link>
          <nav className="flex items-stretch">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "label-xs flex min-h-16 items-center border-r border-line px-5 transition-colors duration-150 first:border-l",
                  isActive(n.to) ? "bg-foreground text-surface" : "text-subtle hover:bg-accent-soft hover:text-foreground",
                  n.strong && !isActive(n.to) && "text-accent",
                )}
              >
                {n.strong ? "+ " : ""}
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      <footer className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="grid border-t border-foreground py-4 md:grid-cols-[1fr_auto] md:items-center">
          <p className="text-[0.64rem] tracking-[0.09em] uppercase text-subtle">
            Protótipo · armazenamento local · não inserir dados reais
          </p>
          <p className="label-xs mt-2 text-subtle md:mt-0">Acolhe Up / 0.1</p>
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-foreground bg-background md:hidden">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className={cn(
              "relative flex min-h-16 items-center justify-center border-r border-line px-1 text-center transition-colors duration-150 last:border-r-0",
              isActive(n.to) ? "bg-foreground text-surface" : "text-subtle",
              n.strong && !isActive(n.to) && "bg-accent text-accent-foreground",
            )}
          >
            <span className="label-xs">{n.strong ? "+ " : ""}{n.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 md:px-6", className)}>{children}</div>;
}

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="grid border-b border-foreground pt-9 pb-5 md:grid-cols-[minmax(0,1.55fr)_minmax(240px,0.45fr)] md:items-stretch md:pt-14 md:pb-6">
      <h1 className="self-end text-[2.1rem] leading-[0.92] font-semibold tracking-[-0.045em] md:text-[3.25rem]">{title}</h1>
      {sub ? <p className="mt-4 flex max-w-md items-end text-[0.78rem] leading-relaxed text-muted md:mt-0 md:border-l md:border-line md:pl-5">{sub}</p> : null}
    </div>
  );
}
