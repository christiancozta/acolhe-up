import type { Atendimento, DemandaId, Status } from "./types";

export function resumo(list: Atendimento[]) {
  const demandas = list.reduce((n, a) => n + a.demandas.length, 0);
  const encaminhados = list.filter((a) => a.status === "encaminhado").length;
  const urgentes = list.filter((a) => a.prioridade === "urgente").length;
  return { total: list.length, demandas, encaminhados, urgentes };
}

export function porDemanda(list: Atendimento[]) {
  const map = new Map<DemandaId, number>();
  list.forEach((a) => a.demandas.forEach((d) => map.set(d, (map.get(d) ?? 0) + 1)));
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

export function porStatus(list: Atendimento[]) {
  return list.reduce(
    (acc, a) => {
      acc[a.status] += 1;
      return acc;
    },
    { novo: 0, triado: 0, encaminhado: 0, concluido: 0 } as Record<Status, number>,
  );
}
