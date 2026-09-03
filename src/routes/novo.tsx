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
      {
        property: "og:description",
        content: "Registre um acolhimento em três etapas curtas.",
      },
    ],
  }),
  component: NovoAtendimento;
});

function NovoAtendimento() {
  return null;
}
