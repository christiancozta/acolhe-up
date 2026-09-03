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
        "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-[background-color,color,border-color,transform] duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-40",
        size === "lg" ? "h-13 px-6 text-[0.9375rem]" : "h-11 px-4",
        variant === "primary" && "bg-accent text-accent-foreground hover:bg-foreground",
        variant === "outline" && "border border-line-strong bg-transparent text-foreground hover:border-foreground hover:bg-surface",
        variant === "ghost" && "text-muted hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
});

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="label-xs text-muted">{label}</span>
      {hint ? <span className="mt-1 block text-xs text-subtle">{hint}</span> : null}
      <div className="mt-2">{children}</div>
    </label>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-12 w-full rounded-md border border-line bg-surface px-3 text-[0.9375rem] text-foreground placeholder:text-subtle transition-colors duration-150 hover:border-line-strong focus:border-accent focus:outline-none",
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
        "min-h-24 w-full resize-none rounded-md border border-line bg-surface p-3 text-[0.9375rem] leading-relaxed text-foreground placeholder:text-subtle transition-colors duration-150 hover:border-line-strong focus:border-accent focus:outline-none",
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
    <div className={cn("grid gap-px overflow-hidden rounded-md border border-line bg-line", columns ? "grid-cols-1" : "grid-cols-[repeat(auto-fit,minmax(96px,1fr))]")}>
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
                ? "bg-accent font-medium text-accent-foreground"
                : "bg-surface text-muted hover:bg-background hover:text-foreground",
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
  if (prioridade === "normal") {
    return <span className="label-xs text-subtle">Normal</span>;
  }
  return (
    <span
      className={cn(
        "label-xs",
        prioridade === "urgente" ? "text-urgent" : "text-foreground",
      )}
    >
      {prioridade === "urgente" ? "• " : ""}
      {PRIORIDADE_LABEL[prioridade]}
    </span>
  );
}

export function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="border-t border-foreground pt-3">
      <div className="num-display text-[2.25rem] leading-none">
        {typeof value === "number" ? String(value).padStart(2, "0") : value}
      </div>
      <div className="label-xs mt-2 text-muted">{label}</div>
    </div>
  );
}
