import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, PageTitle } from "@/components/AppShell";
import { PrioridadeTag, StatusTag } from "@/components/kit";
import { DEMANDA_MAP, campoKey } from "@/lib/demandas";
import { atualizarAtendimento, formatarData, useAtendimentos } from "@/lib/store";
import { STATUS_FLOW, STATUS_LABEL, type Status } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/atendimentos/$id")({
  head: () => ({
    meta: [
      { title: "Atendimento · Acolhimento" },
      {
        name: "description",
        content: "Detalhes e acompanhamento de um atendimento registrado durante a ação de acolhimento.",
      },
    ],
  }),
  component: AtendimentoDetalhe,
});

function AtendimentoDetalhe() {
  const { id } = Route.useParams();
  const data = useAtendimentos();
  const atendimento = data?.find((a) => a.id === id);

  if (data === null) {
    return (
      <Page className="pb-16">
        <div className="pt-10 md:pt-14">
          <div className="h-10 w-56 animate-pulse bg-surface" />
          <div className="mt-8 h-36 animate-pulse bg-surface" />
        </div>
      </Page>
    );
  }

  if (!atendimento) {
    return (
      <Page className="pb-16">
        <PageTitle title="Atendimento não encontrado" sub="Este registro não está disponível neste dispositivo." />
        <Link
          to="/atendimentos"
          className="label-xs mt-8 inline-flex border border-line-strong px-4 py-3 transition-colors hover:border-foreground"
        >
          ← Voltar aos atendimentos
        </Link>
      </Page>
    );
  }

  const mudarStatus = (status: Status) => atualizarAtendimento(atendimento.id, { status });

  return (
    <Page className="pb-16">
      <div className="pt-10 md:pt-14">
        <Link to="/atendimentos" className="label-xs text-subtle transition-colors hover:text-foreground">
          ← Atendimentos
        </Link>
        <div className="mt-5 border-b border-foreground pb-5">
          <div className="flex flex-wrap items-center gap-3">
            <StatusTag status={atendimento.status} />
            <PrioridadeTag prioridade={atendimento.prioridade} />
            {atendimento.demo ? <span className="label-xs text-subtle">Demonstração</span> : null}
          </div>
          <h1 className="mt-4 text-[2rem] leading-none font-semibold tracking-[-0.025em] md:text-[2.75rem]">
            {atendimento.nome}
          </h1>
          <p className="mt-3 text-sm text-muted">
            {atendimento.nacionalidade} · {atendimento.idioma} · {formatarData(atendimento.criadoEm)}
          </p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="label-xs text-muted">Identificação</h2>
        <dl className="mt-4 border-t border-line">
          <Row label="Situação documental" value={atendimento.situacaoDocumental} />
          <Row label="Contato" value={atendimento.contato || "Não informado"} />
          <Row label="Acolhimento" value={atendimento.acolhedor || "Não informado"} />
          <Row label="Responsável" value={atendimento.responsavel} />
        </dl>
      </section>

      <section className="mt-12">
        <div className="flex items-baseline justify-between border-b border-foreground pb-4">
          <h2 className="text-lg font-medium tracking-[-0.015em]">Demandas</h2>
          <span className="label-xs text-subtle">{atendimento.demandas.length}</span>
        </div>

        <div>
          {atendimento.demandas.map((idDemanda) => {
            const demanda = DEMANDA_MAP[idDemanda];
            return (
              <div key={idDemanda} className="border-b border-line py-5">
                <h3 className="text-[0.9375rem] font-medium">{demanda.label}</h3>
                <dl className="mt-4 space-y-3">
                  {demanda.campos.map((campo) => {
                    const resposta = atendimento.respostas[campoKey(idDemanda, campo.key)];
                    if (!resposta) return null;
                    return (
                      <div key={campo.key} className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-5 text-sm">
                        <dt className="text-subtle">{campo.label}</dt>
                        <dd className="text-right leading-relaxed text-foreground">{resposta}</dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            );
          })}
        </div>
      </section>

      {atendimento.observacoes ? (
        <section className="mt-12">
          <h2 className="label-xs text-muted">Observações</h2>
          <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-foreground">
            {atendimento.observacoes}
          </p>
        </section>
      ) : null}

      <section className="mt-12">
        <div className="border-b border-foreground pb-4">
          <h2 className="text-lg font-medium tracking-[-0.015em]">Andamento</h2>
          <p className="mt-2 text-xs leading-relaxed text-subtle">Atualize o estágio do atendimento neste dispositivo.</p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line md:grid-cols-4">
          {STATUS_FLOW.map((status) => {
            const active = atendimento.status === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => mudarStatus(status)}
                aria-pressed={active}
                className={cn(
                  "min-h-14 px-3 text-sm transition-colors duration-150",
                  active
                    ? "bg-foreground font-medium text-surface"
                    : "bg-surface text-muted hover:bg-background hover:text-foreground",
                )}
              >
                {STATUS_LABEL[status]}
              </button>
            );
          })}
        </div>
      </section>
    </Page>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-5 border-b border-line py-4 text-sm">
      <dt className="text-subtle">{label}</dt>
      <dd className="text-right leading-relaxed text-foreground">{value}</dd>
    </div>
  );
}
