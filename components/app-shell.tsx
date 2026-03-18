import Link from "next/link";
import { LogoutButton } from "./logout-button";

type AppShellProps = {
  title: string;
  description: string;
  userName?: string | null;
  children: React.ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
};

export function AppShell({
  title,
  description,
  userName,
  children,
  ctaHref,
  ctaLabel,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <Link className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500" href="/reservations">
              Apex Terminal
            </Link>
            <p className="mt-1 text-sm text-zinc-500">
              {userName ? `Sessao ativa: ${userName}` : "Modulo de reservas"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
              href="/reservations"
            >
              Reservas
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-950">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">{description}</p>
          </div>
          {ctaHref && ctaLabel ? (
            <Link
              className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800"
              href={ctaHref}
            >
              {ctaLabel}
            </Link>
          ) : null}
        </div>

        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}
