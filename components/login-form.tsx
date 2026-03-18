"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { persistSession } from "@/lib/auth-client";
import { loginRequest } from "@/lib/client-api";

const loginSchema = z.object({
  email: z.email("Informe um e-mail valido."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("agente@terminal-apex.com");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse({ email, password });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Credenciais invalidas.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await loginRequest(parsed.data.email, parsed.data.password);

      persistSession({
        token: response.accessToken,
        role: response.user.role,
        name: response.user.name,
      });

      router.replace("/reservations");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Falha ao autenticar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-700" htmlFor="email">
          E-mail
        </label>
        <input
          className="h-12 w-full rounded-2xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-zinc-400"
          id="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="agente@terminal-apex.com"
          type="email"
          value={email}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-zinc-700" htmlFor="password">
          Senha
        </label>
        <input
          className="h-12 w-full rounded-2xl border border-zinc-200 px-4 text-sm outline-none transition focus:border-zinc-400"
          id="password"
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          value={password}
        />
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <button
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
