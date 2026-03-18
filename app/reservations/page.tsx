import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Pagination } from "@/components/pagination";
import { StatusBadge } from "@/components/status-badge";
import { getReservations, getSlots } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { getSession } from "@/lib/session";
import type { ReservationStatus } from "@/lib/types";

const PAGE_SIZE = 8;

type ReservationsPageProps = {
  searchParams: Promise<{
    status?: ReservationStatus;
    date?: string;
    slotId?: string;
    page?: string;
  }>;
};

function createHref(filters: {
  status?: string;
  date?: string;
  slotId?: string;
  page?: number;
}) {
  const searchParams = new URLSearchParams();

  if (filters.status) {
    searchParams.set("status", filters.status);
  }

  if (filters.date) {
    searchParams.set("date", filters.date);
  }

  if (filters.slotId) {
    searchParams.set("slotId", filters.slotId);
  }

  if (filters.page && filters.page > 1) {
    searchParams.set("page", String(filters.page));
  }

  const query = searchParams.toString();
  return `/reservations${query ? `?${query}` : ""}`;
}

export default async function ReservationsPage({
  searchParams,
}: ReservationsPageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const filters = await searchParams;
  const [reservations, slots] = await Promise.all([
    getReservations({
      status: filters.status,
      date: filters.date,
      slotId: filters.slotId,
    }),
    getSlots(),
  ]);

  const page = Math.max(1, Number(filters.page ?? "1") || 1);
  const totalPages = Math.max(1, Math.ceil(reservations.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageReservations = reservations.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <AppShell
      ctaHref="/reservations/new"
      ctaLabel="Nova reserva"
      description="Filtros vivem na URL para manter navegacao previsivel e facilitar compartilhamento do estado da listagem. A paginacao e simples e orientada a operacao."
      title="Reservas"
      userName={session.name}
    >
      <div className="space-y-6">
        <form className="grid gap-4 rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm md:grid-cols-[1fr_1fr_1fr_auto]" method="GET">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700" htmlFor="status">
              Status
            </label>
            <select
              className="h-11 w-full rounded-2xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-zinc-400"
              defaultValue={filters.status ?? ""}
              id="status"
              name="status"
            >
              <option value="">Todos</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700" htmlFor="date">
              Data
            </label>
            <input
              className="h-11 w-full rounded-2xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-zinc-400"
              defaultValue={filters.date ?? ""}
              id="date"
              name="date"
              type="date"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700" htmlFor="slotId">
              Slot
            </label>
            <select
              className="h-11 w-full rounded-2xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-zinc-400"
              defaultValue={filters.slotId ?? ""}
              id="slotId"
              name="slotId"
            >
              <option value="">Todos</option>
              {slots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-3">
            <button
              className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800"
              type="submit"
            >
              Filtrar
            </button>
            <Link
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 px-5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
              href="/reservations"
            >
              Limpar
            </Link>
          </div>
        </form>

        <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-zinc-50">
              <tr className="text-left text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-6 py-4 font-semibold">Passageiro</th>
                <th className="px-6 py-4 font-semibold">Slot</th>
                <th className="px-6 py-4 font-semibold">Horario</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {pageReservations.length === 0 ? (
                <tr>
                  <td className="px-6 py-10 text-sm text-zinc-500" colSpan={5}>
                    Nenhuma reserva encontrada para os filtros atuais.
                  </td>
                </tr>
              ) : (
                pageReservations.map((reservation) => (
                  <tr key={reservation.id} className="text-sm text-zinc-700">
                    <td className="px-6 py-5">
                      <div className="font-medium text-zinc-950">{reservation.passenger.name}</div>
                      <div className="mt-1 text-zinc-500">{reservation.passenger.email}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-medium text-zinc-950">{reservation.slot.name}</div>
                      <div className="mt-1 text-zinc-500">{reservation.slot.code}</div>
                    </td>
                    <td className="px-6 py-5">{formatDateTime(reservation.startsAt)}</td>
                    <td className="px-6 py-5">
                      <StatusBadge
                        label={reservation.statusLabel}
                        status={reservation.status}
                      />
                    </td>
                    <td className="px-6 py-5">
                      <Link
                        className="font-semibold text-zinc-950 underline-offset-4 hover:underline"
                        href={`/reservations/${reservation.id}`}
                      >
                        Ver detalhes
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          createHref={(nextPage) =>
            createHref({
              status: filters.status,
              date: filters.date,
              slotId: filters.slotId,
              page: nextPage,
            })
          }
          page={currentPage}
          totalPages={totalPages}
        />
      </div>
    </AppShell>
  );
}
