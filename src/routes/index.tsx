import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/AppShell";
import { Stat } from "@/components/kit";
import { DEMANDA_MAP } from "@/lib/demandas";
import { useAtendimentos } from "@/lib/store";
import { porDemanda, resumo } from "@/lib/stats";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Acolhimento · Projeto Kelvin v0.1" },
      {
        name: "description",
        content: "Registro e acompanhamento de demandas de pessoas migrantes durante ações presenciais de acolhimento.",
      },
      { property: "og:title", content: "Acolhimento · Projeto Kelvin v0.1" },
      { property: "og:description", content: "Registro e acompanhamento de demandas de pessoas migrantes." },
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
      <section className="pt-10 md:pt-16">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <p className="label-xs text-subtle">Projeto Kelvin · v0.1</p>
          <p className="label-xs text-subtle">Ação local / dispositivo atual</p>
        </div>

        <div className="grid border-b border-foreground py-8 md:grid-cols-[1.55fr_0.45fr] md:items-end md:py-12">
          <div>
            <h1 className="text-[3.35rem] leading-[0.84] font-semibold tracking-[-0.065em] md:text-[5.9rem]">Acolhimento</h1>
            <p className="mt-6 max-w-lg text-[0.9rem] leading-relaxed text-muted md:text-base">
              Registro e acompanhamento de demandas de pessoas migrantes durante ações presenciais.
            </p>
          </div>
          <div className="mt-8 border-t border-line pt-4 md:mt-0 md:border-t-0 md:border-l md:pl-5">
            <p className="label-xs text-subtle">Estado da operação</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="h-2 w-2 bg-accent" aria-hidden />
              <span className="text-sm">Pronto para registrar</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 border-y border-foreground md:grid-cols-4 md:divide-x md:divide-line">
        <div className="pr-4 md:pr-5"><Stat value={r?.total ?? "—"} label="Atendimentos" /></div>
        <div className="pl-4 md:px-5"><Stat value={r?.demandas ?? "—"} label="Demandas" /></div>
        <div className="pr-4 md:px-5"><Stat value={r?.triados ?? "—"} label="Triados" /></div>
        <div className="pl-4 md:pl-5"><Stat value={r?.urgentes ?? "—"} label="Atenção imediata" /></div>
      </section>

      <section className="grid border-b border-foreground md:grid-cols-[1.55fr_0.45fr]">
        <Link
          to="/novo"
          className="group rule-lead rule-lead-invert flex min-h-24 items-center bg-accent px-5 text-accent-foreground transition-colors duration-150 hover:bg-foreground md:min-h-28 md:px-7"
        >
          <div>
            <span className="label-xs opacity-70">Entrada</span>
            <span className="mt-2 block text-xl font-medium tracking-[-0.025em] md:text-2xl">Novo atendimento</span>
          </div>
          <span aria-hidden className="text-3xl font-light transition-transform duration-150 group-hover:translate-x-1">→</span>
        </Link>
        <div className="grid grid-cols-2 border-t border-line md:grid-cols-1 md:border-t-0 md:border-l">
          <Link to="/atendimentos" className="label-xs flex min-h-16 items-center justify-between px-4 text-muted transition-colors hover:bg-accent-soft hover:text-foreground md:px-5">
            Atendimentos <span>↗</span>
          </Link>
          <Link to="/visao-geral" className="label-xs flex min-h-16 items-center justify-between border-l border-line px-4 text-muted transition-colors hover:bg-accent-soft hover:text-foreground md:border-l-0 md:border-t md:px-5">
            Visão geral <span>↗</span>
          </Link>
        </div>
      </section>

      <section className="grid border-b border-line md:grid-cols-[0.45fr_1.55fr]">
        <div className="py-6 md:border-r md:pr-5">
          <p className="label-xs text-subtle">Incidência atual</p>
          <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted">Demandas mais frequentes nos registros deste navegador.</p>
        </div>
        <div className="border-t border-line py-2 md:border-t-0 md:pl-5">
          {data === null ? (
            <div className="py-8 text-sm text-subtle">Carregando leitura operacional…</div>
          ) : demandas.length === 0 ? (
            <div className="py-8 text-sm text-subtle">Ainda não há dados suficientes para compor a leitura.</div>
          ) : (
            demandas.map(([id, total]) => (
              <div key={id} className="grid grid-cols-[minmax(0,1fr)_minmax(90px,1.6fr)_32px] items-center gap-4 border-b border-line py-3 last:border-b-0 md:grid-cols-[9.5rem_minmax(120px,1fr)_32px]">
                <span className="truncate text-xs text-muted">{DEMANDA_MAP[id].label}</span>
                <div className="h-2 bg-accent-soft">
                  <div className="h-2 bg-accent transition-[width] duration-300" style={{ width: `${Math.max(10, (total / maxDemanda) * 100)}%` }} />
                </div>
                <span className="num-display text-right text-sm">{String(total).padStart(2, "0")}</span>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="h-10 md:h-14" />
    </Page>
  );
}
