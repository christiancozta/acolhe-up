import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { Prioridade, Status } from "@/lib/types";
import { PRIORIDADE_LABEL, STATUS_LABEL } from "@/lib/types";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
  size?: "md" | "lg";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 border text-sm font-medium transition-[background-color,color,border-color,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-35",
        size === "lg" ? "h-13 px-6 text-[0.9rem]" : "h-11 px-4",
        variant === "primary" && "border-accent bg-accent text-accent-foreground hover:border-foreground hover:bg-foreground",
        variant === "outline" && "border-line-strong bg-transparent text-foreground hover:border-foreground hover:bg-foreground hover:text-surface",
        variant === "ghost" && "border-transparent text-muted hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
});

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block border-t border-line pt-3">
      <span className="label-xs text-muted">{label}</span>
      {hint ? <span className="mt-1 block text-[0.7rem] text-subtle">{hint}</span> : null}
      <div className="mt-3">{children}</div>
    </label>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-12 w-full border-0 border-b border-line-strong bg-transparent px-0 text-[0.95rem] text-foreground placeholder:text-subtle transition-colors duration-150 hover:border-foreground focus:border-accent focus:outline-none",
          className,
        )}
        {...props}
      />
    );
  },
);

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full resize-none border-0 border-b border-line-strong bg-transparent px-0 py-3 text-[0.95rem] leading-relaxed text-foreground placeholder:text-subtle transition-colors duration-150 hover:border-foreground focus:border-accent focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}

export function ChoiceGroup({
  options,
  value,
  onChange,
  columns,
}: {
  options: string[];
  value?: string;
  onChange: (v: string) => void;
  columns?: boolean;
}) {
  return (
    <div className={cn("grid gap-px border border-line bg-line", columns ? "grid-cols-1" : "grid-cols-[repeat(auto-fit,minmax(96px,1fr))]")}>
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            aria-pressed={active}
            className={cn(
              "min-h-11 px-3 py-3 text-sm transition-colors duration-150",
              active
                ? "bg-foreground font-medium text-surface"
                : "bg-background text-muted hover:bg-accent-soft hover:text-foreground",
            )}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

export function StatusTag({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "label-xs inline-flex items-center border px-1.5 py-1",
        status === "concluido"
          ? "border-line-strong text-subtle"
          : status === "novo"
            ? "border-foreground text-foreground"
            : "border-accent text-accent",
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function PrioridadeTag({ prioridade }: { prioridade: Prioridade }) {
  if (prioridade === "normal") return <span className="label-xs text-subtle">Normal</span>;
  return (
    <span className={cn("label-xs", prioridade === "urgente" ? "text-urgent" : "text-foreground")}>
      {prioridade === "urgente" ? "● " : ""}{PRIORIDADE_LABEL[prioridade]}
    </span>
  );
}

export function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="min-w-0 border-t border-foreground py-4 md:py-5">
      <div className="num-display text-[2.65rem] leading-[0.85] md:text-[3.5rem]">
        {typeof value === "number" ? String(value).padStart(2, "0") : value}
      </div>
      <div className="label-xs mt-3 text-muted">{label}</div>
    </div>
  );
}
