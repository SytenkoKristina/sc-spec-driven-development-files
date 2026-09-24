"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

// `upsert` isn't atomic against another concurrent request creating the same
// new agent name between its internal read and write — that collision
// surfaces as a unique-constraint error on `Agent.name` rather than the
// upsert quietly succeeding. Treat it as "someone else just created this
// agent" and fetch the row they created instead of failing the booking.
async function upsertAgentByName(name: string) {
  try {
    return await db.agent.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return db.agent.findUniqueOrThrow({ where: { name } });
    }
    throw error;
  }
}

export async function createBooking(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const ailmentId = String(formData.get("ailmentId") ?? "");
  const scheduledForRaw = String(formData.get("scheduledFor") ?? "");

  if (!name || !ailmentId || !scheduledForRaw) {
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

  const agent = await upsertAgentByName(name);

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
