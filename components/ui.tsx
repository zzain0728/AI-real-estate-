import Link from "next/link";
import type {
  InputHTMLAttributes,
  PropsWithChildren,
  TextareaHTMLAttributes,
} from "react";

export type BadgeTone = "neutral" | "green" | "yellow" | "red" | "blue";

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={`rounded-2xl border bg-white p-4 shadow-sm ${className ?? ""}`}>{children}</div>;
}

export function H1({ children }: PropsWithChildren) {
  return <h1 className="text-2xl font-semibold tracking-tight">{children}</h1>;
}

export function H2({ children }: PropsWithChildren) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}

export function Muted({ children }: PropsWithChildren) {
  return <p className="text-sm text-neutral-600">{children}</p>;
}

export function Badge({
  children,
  tone = "neutral",
}: PropsWithChildren<{ tone?: BadgeTone }>) {
  const map: Record<BadgeTone, string> = {
    neutral: "bg-neutral-100 text-neutral-800 border-neutral-200",
    green: "bg-emerald-50 text-emerald-800 border-emerald-200",
    yellow: "bg-amber-50 text-amber-800 border-amber-200",
    red: "bg-rose-50 text-rose-800 border-rose-200",
    blue: "bg-sky-50 text-sky-800 border-sky-200",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${map[tone]}`}>
      {children}
    </span>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost";

export function Button({
  children,
  href,
  variant = "primary",
  onClick,
  type = "button",
}: PropsWithChildren<{
  href?: string;
  variant?: ButtonVariant;
  onClick?: () => void;
  type?: "button" | "submit";
}>) {
  const cls =
    variant === "primary"
      ? "bg-black text-white hover:bg-neutral-800"
      : variant === "secondary"
        ? "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
        : "bg-transparent text-neutral-900 hover:bg-neutral-100";

  const base = `inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition ${cls}`;

  if (href) {
    return (
      <Link className={base} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={base}>
      {children}
    </button>
  );
}

export function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full rounded-full bg-neutral-100">
      <div className="h-2 rounded-full bg-black" style={{ width: `${v}%` }} />
    </div>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-200 ${props.className ?? ""}`}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-200 ${props.className ?? ""}`}
    />
  );
}
