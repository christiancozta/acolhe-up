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
      { title: "Atendimento | Acolhe Up" },
      {
        name: "description",
        content:
          "Detalhes e acompanhamento de um atendimento registrado durante a ação de acolhimento.",
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
      <Page className="pb-14">
        <div className="pt-10 md:pt-14">
          <div className="h-10 w-56 animate-pulse bg-accent-soft" />
          <div className="mt-8 h-36 animate-pulse bg-accent-soft" />
        </div>
      </Page>
    );
  }

  if (!atendimento) {
    return (
      <Page className="pb-14">
        <PageTitle
          title="Atendimento não encontrado"
          sub="Este registro não está disponível neste dispositivo."
        />
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
    <Page className="pb-14">
      <div className="pt-10 md:pt-14">
        <Link
          to="/atendimentos"
          className="label-xs text-subtle transition-colors hover:text-foreground"
        >
          ← Atendimentos
        </Link>
        <div className="mt-6 grid border-y border-foreground py-8 md:grid-cols-[minmax(0,1.5fr)_minmax(220px,0.5fr)] md:items-end md:py-10">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusTag status={atendimento.status} />
              <PrioridadeTag prioridade={atendimento.prioridade} />
              {atendimento.demo ? <span className="label-xs text-subtle">Demonstração</span> : null}
            </div>
            <h1 className="mt-5 text-[2.35rem] leading-[0.9] font-semibold tracking-[-0.045em] md:text-[3.5rem]">
              {atendimento.nome}
            </h1>
            <p className="mt-3 text-sm text-muted">
              {atendimento.nacionalidade} / {atendimento.idioma}
            </p>
          </div>
          <div className="mt-5 border-t border-line pt-4 md:mt-0 md:border-t-0 md:border-l md:pl-5">
            <p className="label-xs text-subtle">Registro</p>
            <p className="mt-3 text-sm">{formatarData(atendimento.criadoEm)}</p>
          </div>
        </div>
      </div>

      <section className="grid border-b border-foreground md:grid-cols-[minmax(220px,0.42fr)_minmax(0,1.58fr)]">
        <div className="py-8 md:border-r md:pr-8">
          <p className="label-xs text-subtle">Identificação</p>
        </div>
        <dl className="md:pl-8">
          <Row label="Situação documental" value={atendimento.situacaoDocumental} />
          <Row label="Contato" value={atendimento.contato || "Não informado"} />
          <Row label="Acolhimento" value={atendimento.acolhedor || "Não informado"} />
          <Row label="Responsável" value={atendimento.responsavel} />
        </dl>
      </section>

      <section className="grid border-b border-foreground md:grid-cols-[minmax(220px,0.42fr)_minmax(0,1.58fr)]">
        <div className="py-8 md:border-r md:pr-8">
          <p className="label-xs text-subtle">Demandas</p>
          <p className="num-display mt-3 text-3xl">
            {String(atendimento.demandas.length).padStart(2, "0")}
          </p>
        </div>
        <div className="md:pl-8">
          {atendimento.demandas.map((idDemanda) => {
            const demanda = DEMANDA_MAP[idDemanda];
            return (
              <div key={idDemanda} className="border-b border-line py-5 last:border-b-0">
                <h3 className="text-[0.95rem] font-medium">{demanda.label}</h3>
                <dl className="mt-4 space-y-3">
                  {demanda.campos.map((campo) => {
                    const resposta = atendimento.respostas[campoKey(idDemanda, campo.key)];
                    if (!resposta) return null;
                    return (
                      <div key={campo.key} className="rule-lead flex items-baseline text-sm">
                        <dt className="shrink-0 text-subtle">{campo.label}</dt>
                        <dd className="min-w-0 text-right leading-relaxed text-foreground">
                          {resposta}
                        </dd>
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
        <section className="grid border-b border-foreground md:grid-cols-[minmax(220px,0.42fr)_minmax(0,1.58fr)]">
          <div className="py-8 md:border-r md:pr-8">
            <p className="label-xs text-subtle">Observações</p>
          </div>
          <p className="py-8 text-sm leading-relaxed text-foreground md:pl-8">
            {atendimento.observacoes}
          </p>
        </section>
      ) : null}

      <section className="border-b border-foreground py-7">
        <div className="grid md:grid-cols-[minmax(220px,0.42fr)_minmax(0,1.58fr)]">
          <div className="pb-5 md:border-r md:pr-8 md:pb-0">
            <p className="label-xs text-subtle">Andamento</p>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Atualize o estado do atendimento neste dispositivo.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-px border border-line bg-line md:ml-8">
            {STATUS_FLOW.map((status) => {
              const active = atendimento.status === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => mudarStatus(status)}
                  aria-pressed={active}
                  className={cn(
                    "min-h-16 px-3 text-sm transition-colors duration-150",
                    active
                      ? "bg-accent font-medium text-accent-foreground"
                      : "bg-background text-muted hover:bg-accent-soft hover:text-accent",
                  )}
                >
                  {STATUS_LABEL[status]}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </Page>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rule-lead flex items-baseline border-b border-line py-4 text-sm last:border-b-0">
      <dt className="shrink-0 text-subtle">{label}</dt>
      <dd className="min-w-0 text-right leading-relaxed text-foreground">{value}</dd>
    </div>
  );
}
