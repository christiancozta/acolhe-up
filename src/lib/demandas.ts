import type { DemandaId } from "./types";

export interface CampoCondicional {
  key: string;
  label: string;
  type: "text" | "choice";
  options?: string[];
}

export interface Demanda {
  id: DemandaId;
  label: string;
  campos: CampoCondicional[];
}

const documental: CampoCondicional[] = [
  { key: "situacao", label: "Situação principal", type: "text" },
  {
    key: "prazo",
    label: "Existe prazo ou urgência identificada?",
    type: "choice",
    options: ["Sim", "Não", "Não sabe"],
  },
];

export const DEMANDAS: Demanda[] = [
  { id: "documentacao", label: "Documentação", campos: documental },
  { id: "refugio", label: "Refúgio / Residência", campos: documental },
  {
    id: "trabalho",
    label: "Trabalho",
    campos: [
      { key: "trabalhando", label: "Está trabalhando atualmente?", type: "choice", options: ["Sim", "Não"] },
      { key: "necessidade", label: "Principal necessidade", type: "text" },
    ],
  },
  {
    id: "saude",
    label: "Saúde",
    campos: [
      {
        key: "acesso",
        label: "Precisa de atendimento ou orientação de acesso?",
        type: "choice",
        options: ["Sim", "Não"],
      },
      { key: "obs", label: "Observação", type: "text" },
    ],
  },
  {
    id: "assistencia",
    label: "Assistência social",
    campos: [
      {
        key: "servico",
        label: "Já possui atendimento pelo CRAS, CREAS ou outro serviço?",
        type: "choice",
        options: ["Sim", "Não", "Não sabe"],
      },
    ],
  },
  {
    id: "educacao",
    label: "Educação",
    campos: [
      {
        key: "nivel",
        label: "Nível relacionado à demanda",
        type: "choice",
        options: ["Básico", "Médio", "Superior", "Outro"],
      },
      { key: "necessidade", label: "Necessidade", type: "text" },
    ],
  },
  {
    id: "diploma",
    label: "Diploma / Formação",
    campos: [
      { key: "pais", label: "País de emissão", type: "text" },
      { key: "nivel", label: "Nível", type: "choice", options: ["Graduação", "Pós-graduação", "Outro"] },
      {
        key: "possui",
        label: "Possui diploma/documentação?",
        type: "choice",
        options: ["Sim", "Parcialmente", "Não"],
      },
      {
        key: "objetivo",
        label: "Objetivo",
        type: "choice",
        options: ["Revalidação", "Reconhecimento", "Informação", "Outro"],
      },
    ],
  },
  {
    id: "juridico",
    label: "Jurídico",
    campos: [{ key: "area", label: "Área ou problema principal", type: "text" }],
  },
  {
    id: "moradia",
    label: "Moradia",
    campos: [{ key: "necessidade", label: "Necessidade principal", type: "text" }],
  },
  {
    id: "outro",
    label: "Outro",
    campos: [{ key: "descricao", label: "Descrição", type: "text" }],
  },
];

export const DEMANDA_MAP: Record<DemandaId, Demanda> = Object.fromEntries(
  DEMANDAS.map((d) => [d.id, d]),
) as Record<DemandaId, Demanda>;

export function campoKey(demanda: DemandaId, key: string) {
  return `${demanda}.${key}`;
}
