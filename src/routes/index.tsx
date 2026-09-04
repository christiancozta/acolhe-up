import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/AppShell";
import { Stat } from "@/components/kit";
import { DEMANDA_MAP } from "@/lib/demandas";
import { useAtendimentos } from "@/lib/store";
import { porDemanda, resumo } from "@/lib/stats";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Acolhimento | Acolhe Up" },
      {
        name: "description",
        content:
          "Registro e acompanhamento de demandas de pessoas migrantes durante ações presenciais de acolhimento.",
      },
      { property: "og:title", content: "Acolhimento | Acolhe Up" },
      {
        property: "og:description",
        content: "Registro e acompanhamento de demandas de pessoas migrantes.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const data = useAtendimentos();
  const r = data ? resumo(data) : null;
  const demandas = data ? porDemanda(data).slice(0, 5) : [];
  const maxDemanda = demandas[0]?.[1] ?? 1;

  return (
    <Page>
      <section className="pt-12 md:pt-20">
        <p className="label-xs text-accent">Ação de acolhimento</p>
        <div className="border-b border-foreground pt-7 pb-9 md:pt-9 md:pb-12">
          <h1 className="max-w-5xl text-[3.55rem] leading-[0.88] font-semibold tracking-[-0.07em] md:text-[6.4rem]">
            Acolhimento
          </h1>
          <p className="mt-6 max-w-2xl text-[0.95rem] leading-relaxed text-muted md:text-[1.05rem]">
            Registro e acompanhamento de demandas de pessoas migrantes durante ações presenciais.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
            <p className="label-xs text-subtle">Estado da operação</p>
            <div className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 bg-accent" aria-hidden />
              <span className="text-sm font-medium">Pronto para registrar</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 border-b border-foreground md:grid-cols-4 md:divide-x md:divide-line">
        <div className="border-b border-line pr-4 md:border-b-0 md:pr-6">
          <Stat value={r?.total ?? "…"} label="Atendimentos" />
        </div>
        <div className="border-b border-l border-line pl-4 md:border-b-0 md:border-l-0 md:px-6">
          <Stat value={r?.demandas ?? "…"} label="Demandas" />
        </div>
        <div className="pr-4 md:px-6">
          <Stat value={r?.triados ?? "…"} label="Triados" />
        </div>
        <div className="border-l border-line pl-4 md:border-l-0 md:pl-6">
          <Stat value={r?.urgentes ?? "…"} label="Atenção imediata" />
        </div>
      </section>

      <section className="grid border-b border-foreground md:grid-cols-[1.55fr_0.45fr]">
        <Link
          to="/novo"
          className="group rule-lead rule-lead-invert flex min-h-28 items-center bg-accent px-5 text-accent-foreground transition-colors hover:bg-foreground md:min-h-36 md:px-8"
        >
          <div>
            <span className="label-xs opacity-70">Entrada</span>
            <span className="mt-3 block text-xl font-semibold tracking-[-0.03em] md:text-[1.75rem]">
              Novo atendimento
            </span>
          </div>
          <span
            aria-hidden
            className="text-3xl font-light transition-transform duration-150 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
        <div className="grid grid-cols-2 border-t border-line md:grid-cols-1 md:border-t-0 md:border-l">
          <Link
            to="/atendimentos"
            className="label-xs flex min-h-16 items-center justify-between px-4 text-muted transition-colors hover:bg-accent-soft hover:text-accent md:px-6"
          >
            Atendimentos <span>↗</span>
          </Link>
          <Link
            to="/visao-geral"
            className="label-xs flex min-h-16 items-center justify-between border-l border-line px-4 text-muted transition-colors hover:bg-accent-soft hover:text-accent md:border-l-0 md:border-t md:px-6"
          >
            Visão geral <span>↗</span>
          </Link>
        </div>
      </section>

      <section className="grid border-b border-line py-8 md:grid-cols-[minmax(220px,0.45fr)_minmax(0,1.55fr)] md:py-10">
        <div className="pb-7 md:border-r md:pr-8 md:pb-0">
          <h2 className="text-lg font-semibold tracking-[-0.025em]">Incidência atual</h2>
          <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted">
            Demandas mais frequentes nos registros deste navegador.
          </p>
        </div>
        <div className="border-t border-line pt-2 md:border-t-0 md:pt-0 md:pl-8">
          {data === null ? (
            <div className="py-8 text-sm text-subtle">Carregando leitura operacional…</div>
          ) : demandas.length === 0 ? (
            <div className="py-8 text-sm text-subtle">
              Ainda não há dados suficientes para compor a leitura.
            </div>
          ) : (
            demandas.map(([id, total]) => (
              <div
                key={id}
                className="grid grid-cols-[minmax(0,1fr)_minmax(90px,1.6fr)_32px] items-center gap-4 border-b border-line py-3 last:border-b-0 md:grid-cols-[9.5rem_minmax(120px,1fr)_32px]"
              >
                <span className="truncate text-xs text-muted">{DEMANDA_MAP[id].label}</span>
                <div className="h-px">
                  <div
                    className="h-px bg-accent transition-[width] duration-300"
                    style={{ width: `${Math.max(10, (total / maxDemanda) * 100)}%` }}
                  />
                </div>
                <span className="num-display text-right text-sm">
                  {String(total).padStart(2, "0")}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="h-12 md:h-16" />
    </Page>
  );
}
