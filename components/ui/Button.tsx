import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "lime" | "ghost" | "ghost-dark";

const base =
  "group relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden px-6 font-display text-[1.05rem] font-semibold uppercase tracking-[0.06em] transition-colors duration-300";

const variants: Record<Variant, string> = {
  // Negro con flecha lima; al pasar el cursor se rellena de lima.
  primary:
    "bg-ink text-paper [&>svg]:text-lime hover:text-ink hover:[&>svg]:text-ink before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-lime before:transition-transform before:duration-500 before:ease-[var(--ease-out-quart)] hover:before:scale-x-100",
  // Lima con texto oscuro; al pasar el cursor se rellena de negro con texto lima. Funciona sobre fondos claros y oscuros.
  lime:
    "bg-lime text-ink hover:text-lime before:absolute before:inset-0 before:origin-left before:scale-x-0 before:bg-ink before:transition-transform before:duration-500 before:ease-[var(--ease-out-quart)] hover:before:scale-x-100",
  ghost:
    "border border-ink/25 text-ink hover:border-ink",
  "ghost-dark":
    "border border-paper/30 text-paper hover:border-paper",
};

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 12"
      className={`relative h-3 w-5 transition-transform duration-300 ease-[var(--ease-out-quart)] group-hover:translate-x-1 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M0 6h18M13 1l5 5-5 5" />
    </svg>
  );
}

type ButtonLinkProps = { variant?: Variant; children: ReactNode; arrow?: boolean } & ComponentProps<typeof Link>;

export function ButtonLink({ variant = "primary", children, arrow = true, className = "", ...props }: ButtonLinkProps) {
  return (
    <Link {...props} className={`${base} ${variants[variant]} ${className}`}>
      <span className="relative">{children}</span>
      {arrow && <Arrow />}
    </Link>
  );
}

type ButtonProps = { variant?: Variant; children: ReactNode; arrow?: boolean } & ComponentProps<"button">;

export function Button({ variant = "primary", children, arrow = false, className = "", ...props }: ButtonProps) {
  return (
    <button {...props} className={`${base} ${variants[variant]} disabled:cursor-not-allowed disabled:opacity-70 ${className}`}>
      <span className="relative inline-flex items-center gap-3">{children}</span>
      {arrow && <Arrow />}
    </button>
  );
}
