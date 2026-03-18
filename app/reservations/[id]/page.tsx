import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ReservationActions } from "@/components/reservation-actions";
import { StatusBadge } from "@/components/status-badge";
import { getReservationById } from "@/lib/api";
import { toApiError } from "@/lib/api-error";
import { canManageReservations } from "@/lib/auth-shared";
import { formatDateTime } from "@/lib/format";
import { getSession } from "@/lib/session";

type ReservationDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ReservationDetailsPage({
  params,
}: ReservationDetailsPageProps) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  let reservation;

  try {
    reservation = await getReservationById(id);
  } catch (error) {
    if (toApiError(error).message.toLowerCase().includes("not found")) {
      notFound();
    }

    throw error;
  }

  return (
    <AppShell
      description="A visibilidade das acoes operacionais depende do papel lido do cookie, mas o backend continua validando permissao e transicoes para evitar bypass no cliente."
      title={`Reserva ${reservation.id}`}
      userName={session.name}
    >
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-zinc-500">Status atual</p>
                <div className="mt-3">
                  <StatusBadge
                    label={reservation.statusLabel}
                    status={reservation.status}
                  />
                </div>
              </div>
              <Link
                className="text-sm font-semibold text-zinc-700 underline-offset-4 hover:underline"
                href="/reservations"
              >
                Voltar para listagem
              </Link>
            </div>

            <dl className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-zinc-500">Passageiro</dt>
                <dd className="mt-2 text-base font-semibold text-zinc-950">
                  {reservation.passenger.name}
                </dd>
                <p className="mt-1 text-sm text-zinc-600">{reservation.passenger.email}</p>
                <p className="mt-1 text-sm text-zinc-600">
                  Documento: {reservation.passenger.document}
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Telefone: {reservation.passenger.phone ?? "Nao informado"}
                </p>
              </div>

              <div>
                <dt className="text-sm font-medium text-zinc-500">Slot</dt>
                <dd className="mt-2 text-base font-semibold text-zinc-950">
                  {reservation.slot.name}
                </dd>
                <p className="mt-1 text-sm text-zinc-600">{reservation.slot.code}</p>
                <p className="mt-1 text-sm text-zinc-600">{reservation.slot.type}</p>
                <p className="mt-1 text-sm text-zinc-600">
                  {reservation.slot.description ?? "Sem descricao adicional"}
                </p>
              </div>

              <div>
                <dt className="text-sm font-medium text-zinc-500">Inicio</dt>
                <dd className="mt-2 text-sm text-zinc-700">
                  {formatDateTime(reservation.startsAt)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-zinc-500">Observacoes</dt>
                <dd className="mt-2 text-sm text-zinc-700">
                  {reservation.notes ?? "Sem observacoes"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-zinc-500">Confirmada em</dt>
                <dd className="mt-2 text-sm text-zinc-700">
                  {reservation.confirmedAt ? formatDateTime(reservation.confirmedAt) : "Ainda nao"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-zinc-500">Check-in em</dt>
                <dd className="mt-2 text-sm text-zinc-700">
                  {reservation.checkedInAt ? formatDateTime(reservation.checkedInAt) : "Ainda nao"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="space-y-6">
          {canManageReservations(session.role) ? (
            <ReservationActions
              reservationId={reservation.id}
              status={reservation.status}
            />
          ) : (
            <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-zinc-950">Ações operacionais</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Apenas perfis AGENT e ADMIN podem confirmar ou fazer check-in de uma reserva.
              </p>
            </div>
          )}

          <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-950">Auditoria</h2>
            <dl className="mt-4 space-y-4 text-sm text-zinc-600">
              <div>
                <dt className="font-medium text-zinc-500">Criada em</dt>
                <dd className="mt-1">{formatDateTime(reservation.createdAt)}</dd>
              </div>
              <div>
                <dt className="font-medium text-zinc-500">Atualizada em</dt>
                <dd className="mt-1">{formatDateTime(reservation.updatedAt)}</dd>
              </div>
              <div>
                <dt className="font-medium text-zinc-500">Cancelada em</dt>
                <dd className="mt-1">
                  {reservation.cancelledAt ? formatDateTime(reservation.cancelledAt) : "Nao"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
