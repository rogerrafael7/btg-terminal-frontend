"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { browserApiRequest } from "@/lib/browser-api";
import { toApiError } from "@/lib/api-error";
import type { Reservation, Slot } from "@/lib/types";

const createReservationSchema = z.object({
  slotId: z.string().min(1, "Selecione um slot."),
  startsAt: z.string().min(1, "Informe a data e hora da reserva."),
  notes: z.string().max(500).optional(),
  passenger: z.object({
    name: z.string().min(2, "Informe o nome do passageiro."),
    email: z.email("Informe um e-mail valido."),
    document: z.string().min(3, "Informe um documento valido."),
    phone: z.string().min(8, "Informe um telefone valido.").optional().or(z.literal("")),
  }),
});

type NewReservationFormProps = {
  slots: Slot[];
};

export function NewReservationForm({ slots }: NewReservationFormProps) {
  const router = useRouter();
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    slotId: slots[0]?.id ?? "",
    startsAt: "",
    notes: "",
    passenger: {
      name: "",
      email: "",
      document: "",
      phone: "",
    },
  });

  function updateField(
    path: "slotId" | "startsAt" | "notes" | "passenger.name" | "passenger.email" | "passenger.document" | "passenger.phone",
    value: string,
  ) {
    if (path === "slotId" || path === "startsAt" || path === "notes") {
      setFormData((current) => ({ ...current, [path]: value }));
      return;
    }

    const passengerKey = path.replace("passenger.", "") as keyof typeof formData.passenger;

    setFormData((current) => ({
      ...current,
      passenger: {
        ...current.passenger,
        [passengerKey]: value,
      },
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldError(null);
    setApiError(null);

    const parsed = createReservationSchema.safeParse(formData);

    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? "Revise os campos obrigatorios.");
      return;
    }

    setIsSubmitting(true);

    try {
      const reservation = await browserApiRequest<Reservation>("/reservations", {
        method: "POST",
        body: JSON.stringify({
          ...parsed.data,
          startsAt: new Date(parsed.data.startsAt).toISOString(),
          notes: parsed.data.notes || null,
          passenger: {
            ...parsed.data.passenger,
            phone: parsed.data.passenger.phone || null,
          },
        }),
      });

      router.replace(`/reservations/${reservation.id}`);
      router.refresh();
    } catch (error) {
      setApiError(toApiError(error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-6 rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700" htmlFor="slotId">
            Slot
          </label>
          <select
            className="h-12 w-full rounded-2xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-zinc-400"
            id="slotId"
            onChange={(event) => updateField("slotId", event.target.value)}
            value={formData.slotId}
          >
            {slots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.name} · {slot.code}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700" htmlFor="startsAt">
            Data e hora
          </label>
          <input
            className="h-12 w-full rounded-2xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-zinc-400"
            id="startsAt"
            onChange={(event) => updateField("startsAt", event.target.value)}
            type="datetime-local"
            value={formData.startsAt}
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700" htmlFor="passengerName">
            Passageiro
          </label>
          <input
            className="h-12 w-full rounded-2xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-zinc-400"
            id="passengerName"
            onChange={(event) => updateField("passenger.name", event.target.value)}
            value={formData.passenger.name}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700" htmlFor="passengerEmail">
            E-mail
          </label>
          <input
            className="h-12 w-full rounded-2xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-zinc-400"
            id="passengerEmail"
            onChange={(event) => updateField("passenger.email", event.target.value)}
            type="email"
            value={formData.passenger.email}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700" htmlFor="passengerDocument">
            Documento
          </label>
          <input
            className="h-12 w-full rounded-2xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-zinc-400"
            id="passengerDocument"
            onChange={(event) => updateField("passenger.document", event.target.value)}
            value={formData.passenger.document}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-zinc-700" htmlFor="passengerPhone">
            Telefone
          </label>
          <input
            className="h-12 w-full rounded-2xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-zinc-400"
            id="passengerPhone"
            onChange={(event) => updateField("passenger.phone", event.target.value)}
            value={formData.passenger.phone}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-700" htmlFor="notes">
          Observacoes
        </label>
        <textarea
          className="min-h-28 w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-zinc-400"
          id="notes"
          onChange={(event) => updateField("notes", event.target.value)}
          value={formData.notes}
        />
      </div>

      {fieldError ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {fieldError}
        </div>
      ) : null}

      {apiError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {apiError}
        </div>
      ) : null}

      <button
        className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Criando..." : "Criar reserva"}
      </button>
    </form>
  );
}
