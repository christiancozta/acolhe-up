export type DemandaId =
  | "documentacao"
  | "refugio"
  | "trabalho"
  | "saude"
  | "assistencia"
  | "educacao"
  | "diploma"
  | "juridico"
  | "moradia"
  | "outro";

export type Prioridade = "normal" | "atencao" | "urgente";
export type Status = "novo" | "triado" | "concluido";

export interface Atendimento {
  id: string;
  nome: string;
  nacionalidade: string;
  idioma: string;
  contato?: string;
  acolhedor: string;
  situacaoDocumental: string;
  demandas: DemandaId[];
  respostas: Record<string, string>;
  prioridade: Prioridade;
  responsavel: string;
  observacoes?: string;
  status: Status;
  criadoEm: string;
  demo?: boolean;
}

export const STATUS_FLOW: Status[] = ["novo", "triado", "concluido"];

export const STATUS_LABEL: Record<Status, string> = {
  novo: "Novo",
  triado: "Triado",
  concluido: "Concluído",
};

export const PRIORIDADE_LABEL: Record<Prioridade, string> = {
  normal: "Normal",
  atencao: "Atenção",
  urgente: "Urgente",
};

export const SITUACOES_DOCUMENTAIS = [
  "Documentação regular",
  "Em processo de regularização",
  "Solicitação de refúgio",
  "Protocolo/documento provisório",
  "Sem documentação regular",
  "Não informado",
  "Outro",
];
