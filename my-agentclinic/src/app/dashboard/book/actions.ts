"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAgentSession } from "@/lib/session";

export async function createBooking(formData: FormData) {
  const { agent } = await requireAgentSession();

  const ailmentId = String(formData.get("ailmentId") ?? "");
  const scheduledForRaw = String(formData.get("scheduledFor") ?? "");

  if (!ailmentId || !scheduledForRaw) {
    throw new Error("Missing required booking fields.");
  }

  // The <input type="datetime-local"> value has no timezone offset, so this
  // is parsed in the server's local timezone. Storage and display
  // (`toLocaleString()` in the confirmation/bookings pages) both happen on
  // this same server process, so the round-trip is consistent as long as
  // this stays a single-instance deployment.
  const scheduledFor = new Date(scheduledForRaw);
  if (Number.isNaN(scheduledFor.getTime())) {
    throw new Error("Invalid appointment time.");
  }

  const ailment = await db.ailment.findUnique({ where: { id: ailmentId } });
  if (!ailment) {
    throw new Error("Unknown ailment.");
  }

  const appointment = await db.appointment.create({
    data: {
      agentId: agent.id,
      ailmentId: ailment.id,
      therapyId: ailment.therapyId,
      scheduledFor,
    },
  });

  redirect(`/dashboard/book/confirmation?id=${appointment.id}`);
}
