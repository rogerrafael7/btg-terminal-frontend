"use client";

import { useRouter } from "next/navigation";
import { clearSession } from "@/lib/auth-client";

export function LogoutButton() {
  const router = useRouter();

  return (
    <button
      className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
      onClick={() => {
        clearSession();
        router.replace("/login");
      }}
      type="button"
    >
      Sair
    </button>
  );
}
