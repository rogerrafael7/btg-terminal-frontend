import { getBackendUrl } from "./config";
import { getClientToken } from "./auth-client";

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

export async function browserApiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = getClientToken();

  if (!token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const response = await fetch(`${getBackendUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${decodeURIComponent(token)}`,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
