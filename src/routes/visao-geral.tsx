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

  return (
    <Page className="pb-16">
      <PageTitle
        title="Visão geral"
        sub="Leitura sintética da ação a partir dos registros armazenados neste dispositivo."
      />

      <section className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 md:mt-12 md:grid-cols-4">
        <Stat value={r?.total ?? "—"} label="Atendimentos" />
        <Stat value={r?.demandas ?? "—"} label="Demandas" />
        <Stat value={r?.encaminhados ?? "—"} label="Encaminhados" />
        <Stat value={r?.urgentes ?? "—"} label="Atenção imediata" />
      </section>

      <section className="mt-14 md:mt-20">
        <div className="flex items-baseline justify-between border-b border-foreground pb-4">
          <h2 className="text-lg font-medium tracking-[-0.015em]">Demandas identificadas</h2>
          <span className="label-xs text-subtle">Ocorrências</span>
        </div>

        {data === null ? (
          <div className="space-y-px pt-px">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse bg-surface" />
            ))}
          </div>
        ) : demandas.length === 0 ? (
          <p className="py-10 text-sm text-muted">Ainda não há demandas registradas.</p>
        ) : (
          <div>
            {demandas.map(([id, total]) => (
              <div key={id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-6 border-b border-line py-4">
                <div>
                  <div className="text-sm text-foreground">{DEMANDA_MAP[id].label}</div>
                  <div className="mt-2 h-px bg-line">
                    <div
                      className="h-px bg-foreground"
                      style={{ width: `${Math.max(8, (total / maxDemanda) * 100)}%` }}
                    />
                  </div>
                </div>
                <span className="num-display text-lg">{String(total).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-14 md:mt-20">
        <div className="border-b border-foreground pb-4">
          <h2 className="text-lg font-medium tracking-[-0.015em]">Andamento</h2>
        </div>
        <div className="grid grid-cols-2 gap-px border-x border-b border-line bg-line md:grid-cols-4">
          {STATUS_FLOW.map((s) => (
            <div key={s} className="bg-surface p-5">
              <div className="num-display text-[2rem] leading-none">
                {status ? String(status[s]).padStart(2, "0") : "—"}
              </div>
              <div className="label-xs mt-3 text-muted">{STATUS_LABEL[s]}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 border-t border-line pt-5 md:mt-20">
        <p className="max-w-xl text-xs leading-relaxed text-subtle">
          Os indicadores refletem apenas os registros disponíveis localmente neste navegador. O protótipo não sincroniza dados entre dispositivos.
        </p>
      </section>
    </Page>
  );
}
