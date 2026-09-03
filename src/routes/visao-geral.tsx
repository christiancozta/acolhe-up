import { createFileRoute } from "@tanstack/react-router";
import { Page, PageTitle } from "@/components/AppShell";
import { Stat } from "@/components/kit";
import { DEMANDA_MAP } from "@/lib/demandas";
import { useAtendimentos } from "@/lib/store";
import { porDemanda, porStatus, resumo } from "@/lib/stats";
import { STATUS_FLOW, STATUS_LABEL } from "@/lib/types";

export const Route = createFileRoute("/visao-geral")({
  head: () => ({
    meta: [
      { title: "Visão geral · Acolhimento" },
      {
        name: "description",
        content: "Síntese dos atendimentos, demandas, prioridades e andamento da ação de acolhimento.",
      },
    ],
  }),
  component: VisaoGeral,
});

function VisaoGeral() {
  const data = useAtendimentos();
  const r = data ? resumo(data) : null;
  const demandas = data ? porDemanda(data) : [];
  const status = data ? porStatus(data) : null;
  const maxDemanda = demandas[0]?.[1] ?? 1;
  const totalStatus = status ? STATUS_FLOW.reduce((n, s) => n + status[s], 0) : 0;

  return (
    <Page className="pb-14">
      <PageTitle title="Visão geral" sub="Leitura sintética da ação a partir dos registros disponíveis neste dispositivo." />

      <section className="grid grid-cols-2 border-b border-foreground md:grid-cols-4 md:divide-x md:divide-line">
        <div className="pr-4 md:pr-5"><Stat value={r?.total ?? "—"} label="Atendimentos" /></div>
        <div className="pl-4 md:px-5"><Stat value={r?.demandas ?? "—"} label="Demandas" /></div>
        <div className="pr-4 md:px-5"><Stat value={r?.triados ?? "—"} label="Triados" /></div>
        <div className="pl-4 md:pl-5"><Stat value={r?.urgentes ?? "—"} label="Atenção imediata" /></div>
      </section>

      <section className="grid border-b border-foreground md:grid-cols-[0.42fr_1.58fr]">
        <div className="py-7 md:border-r md:pr-5">
          <p className="label-xs text-subtle">Fluxo</p>
          <h2 className="mt-3 text-xl font-medium tracking-[-0.025em]">Estado dos atendimentos</h2>
          <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted">Três estados apenas: entrada, triagem e conclusão.</p>
        </div>

        <div className="grid grid-cols-3 border-t border-line md:border-t-0">
          {STATUS_FLOW.map((s) => {
            const count = status?.[s] ?? 0;
            const share = totalStatus ? Math.round((count / totalStatus) * 100) : 0;
            return (
              <div key={s} className="flex min-h-40 flex-col justify-between border-r border-line p-4 last:border-r-0 md:min-h-48 md:p-5">
                <div>
                  <div className="num-display text-[2.6rem] leading-none md:text-[3.5rem]">{status ? String(count).padStart(2, "0") : "—"}</div>
                  <div className="label-xs mt-3 text-muted">{STATUS_LABEL[s]}</div>
                </div>
                <div>
                  <div className="h-1.5 bg-accent-soft">
                    <div className="h-1.5 bg-accent transition-[width] duration-300" style={{ width: `${share}%` }} />
                  </div>
                  <p className="label-xs mt-2 text-subtle">{share}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid border-b border-foreground md:grid-cols-[0.42fr_1.58fr]">
        <div className="py-7 md:border-r md:pr-5">
          <p className="label-xs text-subtle">Incidência</p>
          <h2 className="mt-3 text-xl font-medium tracking-[-0.025em]">Demandas identificadas</h2>
          <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted">Leitura proporcional das ocorrências registradas.</p>
        </div>

        <div className="border-t border-line py-1 md:border-t-0 md:pl-5">
          {data === null ? (
            <div className="py-12 text-sm text-subtle">Carregando leitura…</div>
          ) : demandas.length === 0 ? (
            <p className="py-12 text-sm text-muted">Ainda não há demandas registradas.</p>
          ) : (
            demandas.map(([id, total], index) => (
              <div key={id} className="grid grid-cols-[30px_minmax(90px,0.7fr)_minmax(120px,1.3fr)_34px] items-center gap-4 border-b border-line py-4 last:border-b-0">
                <span className="label-xs text-subtle">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-sm text-foreground">{DEMANDA_MAP[id].label}</span>
                <div className="h-2 bg-accent-soft">
                  <div className="h-2 bg-accent" style={{ width: `${Math.max(8, (total / maxDemanda) * 100)}%` }} />
                </div>
                <span className="num-display text-right text-lg">{String(total).padStart(2, "0")}</span>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="grid border-b border-line py-5 md:grid-cols-[1fr_auto] md:items-center">
        <p className="max-w-xl text-[0.7rem] leading-relaxed text-subtle">
          Os indicadores refletem apenas os registros disponíveis localmente neste navegador. Não há sincronização entre dispositivos.
        </p>
        <p className="label-xs mt-3 text-subtle md:mt-0">Leitura local</p>
      </section>
    </Page>
  );
}
