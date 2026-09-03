import { useEffect, useState } from "react";
import { SEED } from "./seed";
import type { Atendimento } from "./types";

const KEY = "kelvin.acolhimento.v1";

let cache: Atendimento[] | null = null;
const listeners = new Set<() => void>();

function read(): Atendimento[] {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      cache = JSON.parse(raw) as Atendimento[];
    } else {
      cache = SEED;
      localStorage.setItem(KEY, JSON.stringify(SEED));
    }
  } catch {
    cache = SEED;
  }
  return cache!;
}

function write(next: Atendimento[]) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function useAtendimentos() {
  const [data, setData] = useState<Atendimento[] | null>(null);

  useEffect(() => {
    const sync = () => setData([...read()]);
    sync();
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, []);

  return data;
}

export function criarAtendimento(a: Atendimento) {
  write([a, ...read()]);
}

export function atualizarAtendimento(id: string, patch: Partial<Atendimento>) {
  write(read().map((a) => (a.id === id ? { ...a, ...patch } : a)));
}

export function ordenar(list: Atendimento[]) {
  return [...list].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
}

export function novoId() {
  return `a-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
