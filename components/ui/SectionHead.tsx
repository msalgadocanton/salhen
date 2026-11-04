import type { ReactNode } from "react";

type Props = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  dark?: boolean;
  className?: string;
};

// Cabecera de lámina: número de sección del expediente + rubro + título.
export function SectionHead({ index, eyebrow, title, dark = false, className = "" }: Props) {
  return (
    <header className={`flex flex-col gap-4 sm:gap-5 ${className}`}>
      <p className={`flex items-center gap-3 sm:gap-4 ${dark ? "text-mist" : "text-ink-2"}`}>
        <span className="bg-lime px-2.5 pb-0.5 pt-1.5 font-display text-[2rem] font-bold leading-none text-ink sm:text-[2.4rem] lg:text-[2.9rem]">
          {index}
        </span>
        <span aria-hidden="true" className={`h-px w-6 shrink-0 sm:w-12 ${dark ? "bg-graphite-line" : "bg-line"}`} />
        <span className="font-mono text-[0.78rem] uppercase leading-tight tracking-[0.08em] sm:text-[0.95rem] sm:tracking-[0.1em] lg:text-[1.05rem]">{eyebrow}</span>
      </p>
      <h2 className={`text-[length:var(--text-display)] font-semibold uppercase ${dark ? "text-paper" : "text-ink"}`}>{title}</h2>
    </header>
  );
}
