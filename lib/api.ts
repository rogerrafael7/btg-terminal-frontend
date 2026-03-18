import { cache } from "react";
import { getBackendUrl } from "./config";
import { requireSession } from "./session";
import type { Reservation, ReservationStatus, Slot } from "./types";

type RequestInitWithNext = RequestInit & {
  next?: {
    tags?: string[];
  };
};

async function readErrorMessage(response: Response) {
  try {
    const body = (await response.json()) as {
      message?: string | string[];
    };

    if (Array.isArray(body.message)) {
      return body.message.join(", ");
    }

    return body.message ?? "Unexpected API error.";
  } catch {
    return "Unexpected API error.";
  }
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInitWithNext,
): Promise<T> {
  const session = await requireSession();

  const response = await fetch(`${getBackendUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.token}`,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as T;
}

export const getSlots = cache(async () => {
  return apiRequest<Slot[]>("/slots", {
    cache: "force-cache",
    next: { tags: ["slots"] },
  });
});

export async function getReservations(filters: {
  status?: ReservationStatus;
  date?: string;
  slotId?: string;
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

  const query = searchParams.toString();

  return apiRequest<Reservation[]>(`/reservations${query ? `?${query}` : ""}`, {
    cache: "no-store",
  });
}

export async function getReservationById(id: string) {
  return apiRequest<Reservation>(`/reservations/${id}`, {
    cache: "no-store",
  });
}
