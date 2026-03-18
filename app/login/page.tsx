import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { getSession } from "@/lib/session";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/reservations");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-16">
      <div className="grid w-full max-w-5xl gap-8 rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Apex Terminal
            </p>
            <h1 className="text-4xl font-semibold text-zinc-950">
              Operacao premium para reservas, embarque e solo.
            </h1>
            <p className="max-w-xl text-base text-zinc-600">
              Acesso rapido ao modulo interno de reservas do terminal de aviacao
              executiva. Entre com um usuario seed para validar os diferentes papeis.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Administrador
              </p>
              <p className="mt-2 text-sm text-zinc-700">administrador@terminal-apex.com</p>
            </div>
            <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Agente
              </p>
              <p className="mt-2 text-sm text-zinc-700">agente@terminal-apex.com</p>
            </div>
            <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Visualizador
              </p>
              <p className="mt-2 text-sm text-zinc-700">visualizador@terminal-apex.com</p>
            </div>
          </div>

          <p className="text-sm text-zinc-500">Senha seed para todos os usuarios: Password123!</p>
        </div>

        <div className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-6">
          <h2 className="text-2xl font-semibold text-zinc-950">Entrar</h2>
          <p className="mt-2 text-sm text-zinc-600">
            O token JWT e o papel do usuario sao persistidos em cookie para o middleware
            proteger as rotas do App Router.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
