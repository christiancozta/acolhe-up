import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Page, PageTitle } from "@/components/AppShell";
import { Input, PrioridadeTag, StatusTag } from "@/components/kit";
import { DEMANDA_MAP } from "@/lib/demandas";
import { formatarData, ordenar, useAtendimentos } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Atendimento } from "@/lib/types";

export const Route = createFileRoute("/atendimentos/")({
  head: () => ({
    meta: [
      { title: "Atendimentos · Acolhimento" },
      {
        name: "description",
        content: "Consulte, busque e filtre os atendimentos registrados durante a ação de acolhimento.",
      },
      { property: "og:title", content: "Atendimentos · Acolhimento" },
      { property: "og:description", content: "Consulte, busque e filtre os atendimentos registrados." },
    ],
  }),
  component: Atendimentos,
});

const FILTROS = [
  { id: "todos", label: "Todos" },
  { id: "novos", label: "Novos" },
  { id: "atencao", label: "Atenção" },
  { id: "urgentes", label: "Urgentes" },
  { id: "encaminhados", label: "Encaminhados" },
  { id: "concluidos", label: "Concluídos" },
] as const;

type FiltroId = (typeof FILTROS)[number]["id"];

function aplica(a: Atendimento, f: FiltroId) {
  switch (f) {
    case "novos":
      return a.status === "novo";
    case "atencao":
      return a.prioridade === "atencao";
    case "urgentes":
      return a.prioridade === "urgente";
    case "encaminhados":
      return a.status === "encaminhado";
    case "concluidos":
      return a.status === "concluido";
    default:
      return true;
  }
}

function Atendimentos() {
  const data = useAtendimentos();
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<FiltroId>("todos");

  const lista = useMemo(() => {
    if (!data) return [];
    const q = busca.trim().toLowerCase();
    return ordenar(
      data.filter(
        (a) =>
          aplica(a, filtro) &&
          (!q ||
            a.nome.toLowerCase().includes(q) ||
            a.nacionalidade.toLowerCase().includes(q) ||
            a.responsavel.toLowerCase().includes(q)),
      ),
    );
  }, [data, busca, filtro]);

  return (
    <Page className="pb-16">
      <PageTitle title="Atendimentos" sub={data ? `${data.length} registros armazenados neste dispositivo.` : undefined} />

      <div className="mt-6">
        <Input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar atendimento..."
          aria-label="Buscar atendimento"
        />
        <div className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFiltro(f.id)}
              className={cn(
                "label-xs shrink-0 border px-3 py-2.5 transition-colors duration-150",
                filtro === f.id
                  ? "border-foreground bg-foreground text-surface"
                  : "border-line text-muted hover:border-line-strong hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {data === null ? (
        <div className="mt-10 space-y-px">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse bg-surface" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <Vazio
          titulo="Ainda não há atendimentos"
          texto="Os registros realizados durante a ação aparecerão aqui."
          cta
        />
      ) : lista.length === 0 ? (
        <Vazio
          titulo="Nenhum atendimento encontrado"
          texto="Tente outro nome ou remova os filtros ativos."
        />
      ) : (
        <ul className="mt-10 border-t border-foreground">
          {lista.map((a) => (
            <li key={a.id}>
              <Link
                to="/atendimentos/$id"
                params={{ id: a.id }}
                className="block border-b border-line py-5 transition-colors duration-150 hover:bg-surface"
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4">
                  <h2 className="truncate text-[1.0625rem] font-medium tracking-[-0.01em]">{a.nome}</h2>
                  <StatusTag status={a.status} />
                </div>
                <p className="mt-1.5 text-sm text-muted">
                  {a.nacionalidade} · {a.idioma}
                </p>
                <p className="mt-3 text-sm text-foreground/80">
                  {a.demandas.map((d) => DEMANDA_MAP[d].label).join(" · ")}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <PrioridadeTag prioridade={a.prioridade} />
                  <span className="label-xs text-subtle">{a.responsavel}</span>
                  <span className="label-xs ml-auto text-subtle">{formatarData(a.criadoEm)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Page>
  );
}

function Vazio({ titulo, texto, cta }: { titulo: string; texto: string; cta?: boolean }) {
  return (
    <div className="mt-10 border-t border-foreground py-16 text-center">
      <p className="label-xs">{titulo}</p>
      <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-muted">{texto}</p>
      {cta && (
        <Link
          to="/novo"
          className="mt-8 inline-flex min-h-12 items-center rounded-md bg-accent px-5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-foreground"
        >
          + Novo atendimento
        </Link>
      )}
    </div>
  );
}
