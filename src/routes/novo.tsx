import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
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
    <div className="grid grid-cols-3 border-y border-foreground md:mt-10">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className={cn(
            "flex min-h-14 items-center justify-between gap-2 border-r border-line px-3 last:border-r-0 md:rule-lead md:justify-normal md:gap-0 md:px-4",
            n === step ? "bg-foreground text-surface md:rule-lead-invert" : n < step ? "bg-accent-soft text-accent" : "text-subtle",
          )}
        >
          <span className="label-xs">0{n}</span>
          <span className="min-w-0 truncate text-[0.62rem] uppercase tracking-[0.08em] md:text-[0.68rem]">
            {n === 1 ? "Identificação" : n === 2 ? "Demandas" : "Acompanhamento"}
          </span>
        </div>
      ))}
    </div>
  );
}

function StepTitle({ children, note }: { children: string; note: string }) {
  return (
    <div className="grid border-b border-foreground py-7 md:grid-cols-[1.55fr_0.45fr] md:items-stretch md:py-9">
      <h1 className="self-end text-[2rem] leading-[0.92] font-semibold tracking-[-0.045em] md:text-[3rem]">{children}</h1>
      <p className="label-xs mt-4 flex items-end text-subtle md:mt-0 md:border-l md:border-line md:pl-5">{note}</p>
    </div>
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
    <Page className="pb-14">
      <Steps step={step} />

      {step === 1 && (
        <div className="animate-reveal">
          <StepTitle note="Dados mínimos / coleta local">Quem estamos acolhendo?</StepTitle>
          <div className="grid gap-x-8 gap-y-7 py-7 md:grid-cols-2 md:py-9">
            <div className="md:col-span-2">
              <Field label="Nome / identificação">
                <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Primeiro nome e inicial" autoComplete="off" />
              </Field>
            </div>
            <Field label="Nacionalidade">
              <Input value={nacionalidade} onChange={(e) => setNacionalidade(e.target.value)} placeholder="País" />
            </Field>
            <Field label="Idioma principal">
              <Input value={idioma} onChange={(e) => setIdioma(e.target.value)} placeholder="Idioma" />
            </Field>
            <Field label="Contato" hint="Opcional">
              <Input value={contato} onChange={(e) => setContato(e.target.value)} placeholder="Telefone ou e-mail" />
            </Field>
            <Field label="Responsável pelo acolhimento">
              <Input value={acolhedor} onChange={(e) => setAcolhedor(e.target.value)} placeholder="Quem está atendendo" />
            </Field>
            <div className="md:col-span-2">
              <Field label="Situação documental">
                <ChoiceGroup columns options={SITUACOES_DOCUMENTAIS} value={situacao} onChange={setSituacao} />
              </Field>
            </div>
          </div>
          <div className="flex items-center justify-between border-y border-line py-5">
            <p className="max-w-xs text-xs leading-relaxed text-subtle">{nome.trim() ? "Identificação mínima preenchida." : "Informe ao menos um nome ou identificação."}</p>
            <Button size="lg" disabled={!nome.trim()} onClick={() => setStep(2)}>Continuar →</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-reveal">
          <StepTitle note={`${String(demandas.length).padStart(2, "0")} demandas selecionadas`}>O que precisa de atenção?</StepTitle>
          <p className="border-b border-line py-5 text-sm leading-relaxed text-muted">Selecione todas as demandas identificadas durante o acolhimento.</p>

          <div className="grid gap-px border-x border-b border-line bg-line sm:grid-cols-2">
            {DEMANDAS.map((d, index) => {
              const active = demandas.includes(d.id);
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggle(d.id)}
                  aria-pressed={active}
                  className={cn(
                    "grid min-h-20 grid-cols-[32px_1fr_auto] items-center gap-3 px-4 text-left transition-colors duration-150",
                    active ? "bg-foreground text-surface" : "bg-background text-muted hover:bg-accent-soft hover:text-foreground",
                  )}
                >
                  <span className="label-xs opacity-55">{String(index + 1).padStart(2, "0")}</span>
                  <span className={cn("text-[0.92rem]", active && "font-medium")}>{d.label}</span>
                  <span className="text-lg">{active ? "×" : "+"}</span>
                </button>
              );
            })}
          </div>

          {demandas.length > 0 && (
            <div className="mt-8 border-b border-line">
              {DEMANDAS.filter((d) => demandas.includes(d.id)).map((d) => (
                <div key={d.id} className="animate-reveal grid border-t border-foreground py-6 md:grid-cols-[0.42fr_1.58fr]">
                  <div className="pb-5 md:border-r md:pr-5 md:pb-0">
                    <p className="label-xs text-subtle">Demanda</p>
                    <p className="mt-3 text-base font-medium">{d.label}</p>
                  </div>
                  <div className="space-y-6 md:pl-6">
                    {d.campos.map((c) => {
                      const k = campoKey(d.id, c.key);
                      return c.type === "text" ? (
                        <Field key={k} label={c.label}>
                          <Input value={respostas[k] ?? ""} onChange={(e) => setResposta(k, e.target.value)} />
                        </Field>
                      ) : (
                        <Field key={k} label={c.label}>
                          <ChoiceGroup options={c.options ?? []} value={respostas[k]} onChange={(v) => setResposta(k, v)} />
                        </Field>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between border-y border-line py-5">
            <Button variant="outline" size="lg" onClick={() => setStep(1)}>← Voltar</Button>
            <Button size="lg" disabled={demandas.length === 0} onClick={() => setStep(3)}>Continuar →</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-reveal">
          <StepTitle note="Saída operacional">Como seguimos?</StepTitle>
          <div className="grid gap-x-8 gap-y-7 py-7 md:grid-cols-2 md:py-9">
            <div className="md:col-span-2">
              <Field label="Prioridade">
                <div className="grid grid-cols-3 gap-px border border-line bg-line">
                  {PRIORIDADES.map((p) => {
                    const active = prioridade === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPrioridade(p)}
                        aria-pressed={active}
                        className={cn(
                          "min-h-14 px-2 text-sm transition-colors duration-150",
                          active && p === "urgente" && "bg-urgent font-medium text-surface",
                          active && p !== "urgente" && "bg-foreground font-medium text-surface",
                          !active && "bg-background text-muted hover:bg-accent-soft hover:text-foreground",
                        )}
                      >
                        {PRIORIDADE_LABEL[p]}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>

            <Field label="Responsável">
              <Input value={responsavel} onChange={(e) => setResponsavel(e.target.value)} placeholder="Quem segue com o caso" />
            </Field>
            <div className="border-t border-line pt-3">
              <span className="label-xs text-muted">Status inicial</span>
              <div className="mt-4 flex items-center gap-2"><span className="h-2 w-2 bg-accent" /><span className="text-sm">Novo</span></div>
            </div>
            <div className="md:col-span-2">
              <Field label="Observações">
                <Textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} placeholder="Anotações breves sobre o acolhimento" />
              </Field>
            </div>
          </div>

          <div className="flex items-center justify-between border-y border-line py-5">
            <Button variant="outline" size="lg" onClick={() => setStep(2)}>← Voltar</Button>
            <Button size="lg" disabled={salvando} onClick={registrar}>{salvando ? "Registrando…" : "Registrar atendimento"}</Button>
          </div>
        </div>
      )}

      <button type="button" onClick={() => navigate({ to: "/atendimentos" })} className="label-xs mt-8 text-subtle transition-colors hover:text-foreground">Cancelar</button>
    </Page>
  );
}

function Confirmacao({ atendimento }: { atendimento: Atendimento }) {
  return (
    <Page className="pb-14">
      <div className="animate-reveal pt-10 md:pt-16">
        <div className="grid border-y border-foreground py-8 md:grid-cols-[1.55fr_0.45fr] md:items-end md:py-12">
          <div>
            <p className="label-xs text-accent">Atendimento registrado</p>
            <h1 className="mt-5 text-[2.5rem] leading-[0.9] font-semibold tracking-[-0.05em] md:text-[4rem]">{atendimento.nome}</h1>
            <p className="mt-4 text-sm text-muted">{atendimento.nacionalidade} · {atendimento.idioma}</p>
          </div>
          <div className="mt-6 border-t border-line pt-4 md:mt-0 md:border-t-0 md:border-l md:pl-5">
            <p className="label-xs text-subtle">Estado</p>
            <p className="mt-3 text-sm">Novo</p>
          </div>
        </div>

        <dl className="border-b border-foreground">
          <Row label="Demandas">
            <div className="flex flex-wrap justify-end gap-x-3 gap-y-1">
              {atendimento.demandas.map((d) => <span key={d} className="label-xs">{DEMANDAS.find((x) => x.id === d)?.label}</span>)}
            </div>
          </Row>
          <Row label="Prioridade"><span className={cn("label-xs", atendimento.prioridade === "urgente" && "text-urgent")}>{PRIORIDADE_LABEL[atendimento.prioridade]}</span></Row>
          <Row label="Responsável"><span className="label-xs">{atendimento.responsavel}</span></Row>
        </dl>

        <div className="grid border-b border-line md:grid-cols-2">
          <Link to="/atendimentos/$id" params={{ id: atendimento.id }} className="flex min-h-16 items-center justify-between bg-accent px-5 text-sm font-medium text-accent-foreground transition-colors hover:bg-foreground">Ver atendimento <span>→</span></Link>
          <Link to="/novo" reloadDocument className="flex min-h-16 items-center justify-between border-t border-line px-5 text-sm font-medium transition-colors hover:bg-accent-soft md:border-t-0 md:border-l">+ Novo atendimento <span>→</span></Link>
        </div>
      </div>
    </Page>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[0.42fr_1.58fr] border-b border-line py-4 last:border-b-0">
      <dt className="label-xs text-muted">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}
