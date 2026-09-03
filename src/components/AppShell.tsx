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
    <div className="flex min-h-dvh flex-col">
      <header className="hidden border-b border-line-strong md:block">
        <div className="mx-auto flex max-w-5xl items-baseline justify-between px-8 py-5">
          <Link to="/" className="group flex items-baseline gap-3">
            <span className="text-base font-semibold tracking-[0.16em] uppercase">Acolhimento</span>
            <span className="label-xs text-subtle">Projeto Kelvin · v0.1</span>
          </Link>
          <nav className="flex items-center gap-6">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "label-xs transition-colors duration-150",
                  isActive(n.to) ? "text-foreground" : "text-subtle hover:text-foreground",
                  n.strong && "border border-foreground px-3 py-2 hover:bg-foreground hover:text-surface",
                )}
              >
                {n.strong ? "+ " : ""}
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 pb-24 md:pb-0">{children}</main>

      <footer className="mx-auto w-full max-w-5xl px-5 pb-6 md:px-8 md:pb-10">
        <p className="border-t border-line pt-4 text-[0.6875rem] tracking-[0.06em] text-subtle">
          Protótipo · armazenamento local · não inserir dados reais
        </p>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line-strong bg-surface md:hidden">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className={cn(
              "flex min-h-16 flex-col items-center justify-center gap-1.5 text-center transition-colors duration-150",
              n.strong
                ? "bg-accent text-accent-foreground"
                : isActive(n.to)
                  ? "text-foreground"
                  : "text-subtle",
            )}
          >
            <span
              className={cn(
                "h-px w-6 transition-colors duration-150",
                n.strong ? "bg-accent-foreground/50" : isActive(n.to) ? "bg-foreground" : "bg-transparent",
              )}
            />
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
  return <div className={cn("mx-auto w-full max-w-5xl px-5 md:px-8", className)}>{children}</div>;
}

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="border-b border-foreground pt-10 pb-5 md:pt-14">
      <h1 className="text-[1.75rem] leading-none font-semibold tracking-[-0.02em] md:text-[2.25rem]">
        {title}
      </h1>
      {sub ? <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{sub}</p> : null}
    </div>
  );
}
