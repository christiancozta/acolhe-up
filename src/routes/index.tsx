import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/AppShell";
import { Stat } from "@/components/kit";
import { useAtendimentos } from "@/lib/store";
import { resumo } from "@/lib/stats";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Acolhimento · Projeto Kelvin v0.1" },
      {
        name: "description",
        content:
          "Registro e acompanhamento de demandas de pessoas migrantes durante ações presenciais de acolhimento.",
      },
      { property: "og:title", content: "Acolhimento · Projeto Kelvin v0.1" },
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

  return (
    <Page>
      <section className="pt-14 md:pt-24">
        <p className="label-xs text-subtle">Projeto Kelvin · v0.1</p>
        <h1 className="mt-4 text-[2.75rem] leading-[0.95] font-semibold tracking-[-0.035em] md:text-[4.5rem]">
          Acolhimento
        </h1>
        <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-muted md:text-base">
          Registro e acompanhamento de demandas de pessoas migrantes.
        </p>
      </section>

      <section className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 md:mt-20 md:grid-cols-4">
        <Stat value={r?.total ?? "—"} label="Atendimentos" />
        <Stat value={r?.demandas ?? "—"} label="Demandas" />
        <Stat value={r?.encaminhados ?? "—"} label="Encaminhados" />
        <Stat value={r?.urgentes ?? "—"} label="Atenção imediata" />
      </section>

      <section className="mt-12 md:mt-20">
        <Link
          to="/novo"
          className="flex min-h-16 w-full items-center justify-between border border-foreground bg-accent px-5 text-accent-foreground transition-colors duration-200 hover:bg-foreground md:max-w-md"
        >
          <span className="text-base font-medium tracking-[-0.01em]">+ Novo atendimento</span>
          <span aria-hidden className="text-lg">
            →
          </span>
        </Link>

        <div className="mt-6 flex gap-8 border-t border-line pt-5">
          <Link to="/atendimentos" className="label-xs text-muted transition-colors hover:text-foreground">
            Atendimentos
          </Link>
          <Link to="/visao-geral" className="label-xs text-muted transition-colors hover:text-foreground">
            Visão geral
          </Link>
        </div>
      </section>

      <div className="h-16 md:h-24" />
    </Page>
  );
}
