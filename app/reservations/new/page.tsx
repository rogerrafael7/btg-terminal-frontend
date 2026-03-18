import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { NewReservationForm } from "@/components/new-reservation-form";
import { getSlots } from "@/lib/api";
import { getSession } from "@/lib/session";

export default async function NewReservationPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const slots = await getSlots();

  return (
    <AppShell
      description="A validacao principal acontece no cliente com Zod 4 para feedback imediato, enquanto o backend continua sendo a fonte de verdade para regras de negocio."
      title="Nova reserva"
      userName={session.name}
    >
      <NewReservationForm slots={slots} />
    </AppShell>
  );
}
