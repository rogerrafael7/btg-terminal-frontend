"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { browserApiRequest } from "@/lib/browser-api";
import { toApiError } from "@/lib/api-error";
import type { Reservation } from "@/lib/types";

type ReservationActionsProps = {
  reservationId: string;
  status: Reservation["status"];
};

export function ReservationActions({
  reservationId,
  status,
}: ReservationActionsProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function runAction(path: string, method: "PATCH" | "DELETE", confirmMessage?: string) {
    if (confirmMessage && !window.confirm(confirmMessage)) {
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        await browserApiRequest(`/reservations/${reservationId}${path}`, {
          method,
        });

        if (method === "DELETE") {
          router.replace("/reservations");
          router.refresh();
          return;
        }

        router.refresh();
      } catch (requestError) {
        setError(toApiError(requestError).message);
      }
    });
  }

  return (
    <div className="space-y-4 rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-zinc-950">Ações operacionais</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Confirmacao, check-in e cancelamento respeitam as regras do backend.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {status === "PENDING" ? (
          <button
            className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
            disabled={isPending}
            onClick={() => runAction("/confirm", "PATCH")}
            type="button"
          >
            Confirmar
          </button>
        ) : null}

        {status === "CONFIRMED" ? (
          <button
            className="inline-flex h-11 items-center justify-center rounded-full bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-violet-300"
            disabled={isPending}
            onClick={() => runAction("/checkin", "PATCH")}
            type="button"
          >
            Fazer check-in
          </button>
        ) : null}

        {status !== "COMPLETED" && status !== "CANCELLED" ? (
          <button
            className="inline-flex h-11 items-center justify-center rounded-full border border-rose-200 px-5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-rose-100 disabled:text-rose-300"
            disabled={isPending}
            onClick={() =>
              runAction(
                "",
                "DELETE",
                "Tem certeza de que deseja cancelar esta reserva?",
              )
            }
            type="button"
          >
            Cancelar
          </button>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}
    </div>
  );
}
