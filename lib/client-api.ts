import { getBackendUrl } from "./config";

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

export type LoginResponse = {
  accessToken: string;
  user: {
    sub: string;
    role: "ADMIN" | "AGENT" | "VIEWER";
    email: string;
    name: string;
  };
};

export async function loginRequest(email: string, password: string) {
  const response = await fetch(`${getBackendUrl()}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as LoginResponse;
}
