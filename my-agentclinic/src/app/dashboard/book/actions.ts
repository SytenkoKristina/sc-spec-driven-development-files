"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireAgentSession } from "@/lib/session";

// The <input type="datetime-local"> value has no timezone offset, so this
// is parsed in the server's local timezone. Storage and display
// (`toLocaleString()` in the confirmation/bookings pages) both happen on
// this same server process, so the round-trip is consistent as long as
// this stays a single-instance deployment.
function parseScheduledFor(raw: string): Date {
  const scheduledFor = new Date(raw);
  if (Number.isNaN(scheduledFor.getTime())) {
    throw new Error("Invalid appointment time.");
  }
  return scheduledFor;
}

async function getOwnUpcomingAppointment(agentId: string, appointmentId: string) {
  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (
    !appointment ||
    appointment.agentId !== agentId ||
    appointment.cancelledAt ||
    appointment.scheduledFor.getTime() < Date.now()
  ) {
    throw new Error("That appointment can't be changed.");
  }

  return appointment;
}

export async function createBooking(formData: FormData) {
  const { agent } = await requireAgentSession();

  const ailmentId = String(formData.get("ailmentId") ?? "");
  const scheduledForRaw = String(formData.get("scheduledFor") ?? "");

  if (!ailmentId || !scheduledForRaw) {
    throw new Error("Missing required booking fields.");
  }

  const scheduledFor = parseScheduledFor(scheduledForRaw);

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

export async function cancelAppointment(formData: FormData) {
  const { agent } = await requireAgentSession();
  const appointmentId = String(formData.get("appointmentId") ?? "");

  const appointment = await getOwnUpcomingAppointment(agent.id, appointmentId);

  await db.appointment.update({
    where: { id: appointment.id },
    data: { cancelledAt: new Date() },
  });

  redirect("/dashboard/book/mine?notice=cancelled");
}

export async function rescheduleAppointment(formData: FormData) {
  const { agent } = await requireAgentSession();
  const appointmentId = String(formData.get("appointmentId") ?? "");
  const scheduledForRaw = String(formData.get("scheduledFor") ?? "");

  if (!scheduledForRaw) {
    throw new Error("Missing required booking fields.");
  }
  const scheduledFor = parseScheduledFor(scheduledForRaw);

  const appointment = await getOwnUpcomingAppointment(agent.id, appointmentId);

  await db.appointment.update({
    where: { id: appointment.id },
    data: { scheduledFor },
  });

  redirect("/dashboard/book/mine?notice=rescheduled");
}
