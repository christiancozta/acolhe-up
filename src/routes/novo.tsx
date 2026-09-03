import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Page } from "@/components/AppShell";
import { Button, ChoiceGroup, Field, Input, Textarea } from "@/components/kit";
import { cn } from "@/lib/utils";
import { DEMANDAS, campoKey } from "@/lib/demandas";
import { criarAtendimento, novoId } from "@/lib/store";
import {
  PRIORIDADE_LABEL,
  SITUACOES_DOCUMENTAIS,
  type Atendimento,
  type DemandaId,
  type Prioridade,
} from "@/lib/types";

export const Route = createFileRoute("/novo")({
  head: () => ({
    meta: [
      { title: "Novo atendimento · Acolhimento" },
      {
        name: "description",
        content: "Registre um acolhimento em três etapas: identificação, demandas e acompanhamento.",
      },
      { property: "og:title", content: "Novo atendimento · Acolhimento" },
      { property: "og:description", content: "Registre um acolhimento em três etapas curtas." },
    ],
  }),
  component: NovoAtendimento,
});

const PRIORIDADES: Prioridade[] = ["normal", "atencao", "urgente"];

function Steps({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-3 pt-10 md:pt-14">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex flex-1 items-center gap-3">
          <span
            className={cn(
              "label-xs transition-colors duration-200",
              n === step ? "text-foreground" : n < step ? "text-accent" : "text-subtle",
            )}
          >
            0{n}
          </span>
          <span
            className={cn(
              "h-px flex-1 transition-colors duration-200",
              n <= step ? "bg-foreground" : "bg-line",
            )}
          />
        </div>
      ))}
    </div>
  );
}

function StepTitle({ children }: { children: string }) {
  return (
    <h1 className="mt-6 border-b border-foreground pb-5 text-[1.75rem] leading-none font-semibold tracking-[-0.025em] md:text-[2.25rem]">
      {children}
    </h1>
  );
}

function NovoAtendimento() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [salvo, setSalvo] = useState<Atendimento | null>(null);
  const [salvando, setSalvando] = useState(false);

  const [nome, setNome] = useState("");
  const [nacionalidade, setNacionalidade] = useState("");
  const [idioma, setIdioma] = useState("");
  const [contato, setContato] = useState("");
  const [acolhedor, setAcolhedor] = useState("");
  const [situacao, setSituacao] = useState("");

  const [demandas, setDemandas] = useState<DemandaId[]>([]);
  const [respostas, setRespostas] = useState<Record<string, string>>({});

  const [prioridade, setPrioridade] = useState<Prioridade>("normal");
  const [responsavel, setResponsavel] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const toggle = (id: DemandaId) =>
    setDemandas((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));

  const setResposta = (k: string, v: string) => setRespostas((p) => ({ ...p, [k]: v }));

  function registrar() {
    setSalvando(true);
    const atendimento: Atendimento = {
      id: novoId(),
      nome: nome.trim(),
      nacionalidade: nacionalidade.trim() || "Não informado",
      idioma: idioma.trim() || "Não informado",
      contato: contato.trim() || undefined,
      acolhedor: acolhedor.trim() || responsavel.trim(),
      situacaoDocumental: situacao || "Não informado",
      demandas,
      respostas,
      prioridade,
      responsavel: responsavel.trim() || acolhedor.trim() || "Não informado",
      observacoes: observacoes.trim() || undefined,
      status: "novo",
      criadoEm: new Date().toISOString(),
    };
    window.setTimeout(() => {
      criarAtendimento(atendimento);
      setSalvo(atendimento);
      setSalvando(false);
    }, 320);
  }

  if (salvo) return <Confirmacao atendimento={salvo} />;

  return (
    <Page className="pb-16">
      <Steps step={step} />

      {step === 1 && (
        <div className="animate-reveal">
          <StepTitle>Quem estamos acolhendo?</StepTitle>
          <div className="mt-8 space-y-7">
            <Field label="Nome / identificação">
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Primeiro nome e inicial"
                autoComplete="off"
              />
            </Field>
            <div className="grid gap-7 md:grid-cols-2">
              <Field label="Nacionalidade">
                <Input value={nacionalidade} onChange={(e) => setNacionalidade(e.target.value)} placeholder="País" />
              </Field>
              <Field label="Idioma principal">
                <Input value={idioma} onChange={(e) => setIdioma(e.target.value)} placeholder="Idioma" />
              </Field>
            </div>
            <Field label="Contato" hint="Opcional">
              <Input value={contato} onChange={(e) => setContato(e.target.value)} placeholder="Telefone ou e-mail" />
            </Field>
            <Field label="Responsável pelo acolhimento">
              <Input value={acolhedor} onChange={(e) => setAcolhedor(e.target.value)} placeholder="Quem está atendendo" />
            </Field>
            <Field label="Situação documental">
              <ChoiceGroup columns options={SITUACOES_DOCUMENTAIS} value={situacao} onChange={setSituacao} />
            </Field>
          </div>

          <div className="mt-10 border-t border-line pt-6">
            <Button size="lg" className="w-full md:w-auto" disabled={!nome.trim()} onClick={() => setStep(2)}>
              Continuar →
            </Button>
            {!nome.trim() && (
              <p className="mt-3 text-xs text-subtle">Informe ao menos um nome ou identificação.</p>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-reveal">
          <StepTitle>O que precisa de atenção?</StepTitle>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Selecione todas as demandas identificadas durante o acolhimento.
          </p>

          <div className="mt-7 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
            {DEMANDAS.map((d) => {
              const active = demandas.includes(d.id);
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggle(d.id)}
                  aria-pressed={active}
                  className={cn(
                    "flex min-h-16 items-center justify-between px-4 text-left transition-colors duration-150",
                    active
                      ? "bg-foreground text-surface"
                      : "bg-surface text-muted hover:bg-background hover:text-foreground",
                  )}
                >
                  <span className={cn("text-[0.9375rem]", active && "font-medium")}>{d.label}</span>
                  <span className="label-xs">{active ? "Selecionado" : ""}</span>
                </button>
              );
            })}
          </div>

          {demandas.length > 0 && (
            <div className="mt-10 space-y-10">
              {DEMANDAS.filter((d) => demandas.includes(d.id)).map((d) => (
                <div key={d.id} className="animate-reveal border-t border-foreground pt-5">
                  <p className="label-xs">{d.label}</p>
                  <div className="mt-5 space-y-6">
                    {d.campos.map((c) => {
                      const k = campoKey(d.id, c.key);
                      return c.type === "text" ? (
                        <Field key={k} label={c.label}>
                          <Input value={respostas[k] ?? ""} onChange={(e) => setResposta(k, e.target.value)} />
                        </Field>
                      ) : (
                        <Field key={k} label={c.label}>
                          <ChoiceGroup
                            options={c.options ?? []}
                            value={respostas[k]}
                            onChange={(v) => setResposta(k, v)}
                          />
                        </Field>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3 border-t border-line pt-6">
            <Button variant="outline" size="lg" onClick={() => setStep(1)}>
              ← Voltar
            </Button>
            <Button size="lg" className="flex-1 md:flex-none" disabled={demandas.length === 0} onClick={() => setStep(3)}>
              Continuar →
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-reveal">
          <StepTitle>Como seguimos?</StepTitle>
          <div className="mt-8 space-y-7">
            <Field label="Prioridade">
              <div className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-line bg-line">
                {PRIORIDADES.map((p) => {
                  const active = prioridade === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPrioridade(p)}
                      aria-pressed={active}
                      className={cn(
                        "min-h-13 px-2 text-sm transition-colors duration-150",
                        active && p === "urgente" && "bg-urgent font-medium text-surface",
                        active && p !== "urgente" && "bg-foreground font-medium text-surface",
                        !active && "bg-surface text-muted hover:bg-background hover:text-foreground",
                      )}
                    >
                      {PRIORIDADE_LABEL[p]}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Responsável">
              <Input
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                placeholder="Quem segue com o caso"
              />
            </Field>

            <Field label="Observações">
              <Textarea
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Anotações breves sobre o acolhimento"
              />
            </Field>

            <div className="flex items-baseline justify-between border-t border-line pt-5">
              <span className="label-xs text-muted">Status inicial</span>
              <span className="label-xs">Novo</span>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 border-t border-line pt-6">
            <Button variant="outline" size="lg" onClick={() => setStep(2)}>
              ← Voltar
            </Button>
            <Button size="lg" className="flex-1 md:flex-none" disabled={salvando} onClick={registrar}>
              {salvando ? "Registrando…" : "Registrar atendimento"}
            </Button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => navigate({ to: "/atendimentos" })}
        className="label-xs mt-10 text-subtle transition-colors hover:text-foreground"
      >
        Cancelar
      </button>
    </Page>
  );
}

function Confirmacao({ atendimento }: { atendimento: Atendimento }) {
  return (
    <Page className="pb-16">
      <div className="animate-reveal pt-14 md:pt-24">
        <p className="label-xs text-accent">Atendimento registrado</p>
        <h1 className="mt-5 text-[2.25rem] leading-none font-semibold tracking-[-0.03em] md:text-[3rem]">
          {atendimento.nome}
        </h1>
        <p className="mt-3 text-sm text-muted">
          {atendimento.nacionalidade} · {atendimento.idioma}
        </p>

        <dl className="mt-10 border-t border-foreground">
          <Row label="Demandas">
            <div className="flex flex-wrap justify-end gap-x-3 gap-y-1">
              {atendimento.demandas.map((d) => (
                <span key={d} className="label-xs">
                  {DEMANDAS.find((x) => x.id === d)?.label}
                </span>
              ))}
            </div>
          </Row>
          <Row label="Prioridade">
            <span className={cn("label-xs", atendimento.prioridade === "urgente" && "text-urgent")}>
              {PRIORIDADE_LABEL[atendimento.prioridade]}
            </span>
          </Row>
          <Row label="Status">
            <span className="label-xs">Novo</span>
          </Row>
          <Row label="Responsável">
            <span className="label-xs">{atendimento.responsavel}</span>
          </Row>
        </dl>

        <div className="mt-10 flex flex-col gap-3 md:flex-row">
          <Link
            to="/atendimentos/$id"
            params={{ id: atendimento.id }}
            className="flex min-h-13 items-center justify-center rounded-md bg-accent px-6 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-foreground"
          >
            Ver atendimento
          </Link>
          <Link
            to="/novo"
            reloadDocument
            className="flex min-h-13 items-center justify-center rounded-md border border-line-strong px-6 text-sm font-medium transition-colors duration-200 hover:border-foreground hover:bg-surface"
          >
            + Novo atendimento
          </Link>
        </div>
      </div>
    </Page>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-line py-4">
      <dt className="label-xs text-muted">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}
