import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Page, PageTitle } from "@/components/AppShell";
import { Input, PrioridadeTag, StatusTag } from "@/components/kit";
import { DEMANDA_MAP } from "@/lib/demandas";
import { formatarData, ordenar, useAtendimentos } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Atendimento, Status } from "@/lib/types";

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

const CATEGORIAS: { id: Status; label: string }[] = [
  { id: "novo", label: "Novos" },
  { id: "triado", label: "Triados" },
  { id: "concluido", label: "Concluídos" },
];

function Atendimentos() {
  const data = useAtendimentos();
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<Status>("novo");

  const lista = useMemo(() => {
    if (!data) return [];
    const q = busca.trim().toLowerCase();
    return ordenar(
      data.filter(
        (a) =>
          a.status === categoria &&
          (!q ||
            a.nome.toLowerCase().includes(q) ||
            a.nacionalidade.toLowerCase().includes(q) ||
            a.responsavel.toLowerCase().includes(q)),
      ),
    );
  }, [data, busca, categoria]);

  const contagem = (status: Status) => data?.filter((a) => a.status === status).length ?? 0;

  return (
    <Page className="pb-14">
      <PageTitle title="Atendimentos" sub="Fila local organizada em três estados operacionais." />

      <section className="grid grid-cols-3 border-b border-foreground">
        {CATEGORIAS.map((c) => {
          const active = categoria === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoria(c.id)}
              className={cn(
                "grid min-h-20 border-r border-line px-3 py-3 text-left transition-colors duration-150 last:border-r-0 md:min-h-24 md:px-5",
                active ? "bg-foreground text-surface" : "hover:bg-accent-soft",
              )}
            >
              <span className={cn("num-display text-3xl leading-none md:text-4xl", !active && "text-foreground")}>{String(contagem(c.id)).padStart(2, "0")}</span>
              <span className={cn("label-xs self-end", active ? "text-surface/70" : "text-muted")}>{c.label}</span>
            </button>
          );
        })}
      </section>

      <section className="grid border-b border-line py-4 md:grid-cols-[1.55fr_0.45fr] md:items-stretch">
        <Input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome, nacionalidade ou responsável"
          aria-label="Buscar atendimento"
        />
        <p className="label-xs mt-3 text-subtle md:mt-0 md:flex md:items-center md:self-stretch md:border-l md:border-line md:pl-5">
          {String(lista.length).padStart(2, "0")} em exibição
        </p>
      </section>

      {data === null ? (
        <div className="border-b border-line py-12 text-sm text-subtle">Carregando registros…</div>
      ) : lista.length === 0 ? (
        <Vazio categoria={CATEGORIAS.find((c) => c.id === categoria)?.label ?? "categoria"} busca={busca} />
      ) : (
        <ul className="border-b border-foreground">
          {lista.map((a, index) => (
            <li key={a.id}>
              <Link
                to="/atendimentos/$id"
                params={{ id: a.id }}
                className="group grid border-b border-line py-5 transition-colors duration-150 last:border-b-0 hover:bg-accent-soft md:grid-cols-[44px_minmax(0,1.35fr)_minmax(180px,0.65fr)_auto] md:items-center md:gap-5"
              >
                <span className="label-xs hidden text-subtle md:block">{String(index + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-4 md:block">
                    <h2 className="truncate text-[1.05rem] font-medium tracking-[-0.015em] md:text-[1.18rem]">{a.nome}</h2>
                    <span className="md:hidden"><StatusTag status={a.status} /></span>
                  </div>
                  <p className="mt-1.5 text-xs text-muted">{a.nacionalidade} · {a.idioma}</p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/80 md:hidden">{a.demandas.map((d) => DEMANDA_MAP[d].label).join(" · ")}</p>
                </div>
                <div className="mt-4 hidden border-l border-line pl-5 md:block">
                  <p className="label-xs text-subtle">Demandas</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{a.demandas.map((d) => DEMANDA_MAP[d].label).join(" · ")}</p>
                </div>
                <div className="mt-4 flex items-center gap-4 md:mt-0 md:w-[9.5rem] md:flex-col md:items-end md:gap-2.5">
                  <span className="hidden md:block"><StatusTag status={a.status} /></span>
                  <PrioridadeTag prioridade={a.prioridade} />
                  <span className="label-xs ml-auto text-subtle md:ml-0">{formatarData(a.criadoEm)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-between border-b border-line py-5">
        <p className="text-[0.7rem] leading-relaxed text-subtle">Dados armazenados somente neste navegador.</p>
        <Link to="/novo" className="label-xs text-accent transition-colors hover:text-foreground">+ Novo atendimento</Link>
      </div>
    </Page>
  );
}

function Vazio({ categoria, busca }: { categoria: string; busca: string }) {
  return (
    <div className="grid border-b border-foreground py-12 md:grid-cols-[1.55fr_0.45fr]">
      <div>
        <p className="text-lg font-medium tracking-[-0.02em]">Nenhum registro em {categoria.toLowerCase()}</p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
          {busca ? "A busca atual não encontrou correspondências nesta categoria." : "Os atendimentos aparecerão aqui conforme avançarem no fluxo."}
        </p>
      </div>
      <div className="mt-6 md:mt-0 md:border-l md:border-line md:pl-5">
        <Link to="/novo" className="label-xs text-accent transition-colors hover:text-foreground">+ Novo atendimento →</Link>
      </div>
    </div>
  );
}
