"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export async function createBooking(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const ailmentId = String(formData.get("ailmentId") ?? "");
  const scheduledForRaw = String(formData.get("scheduledFor") ?? "");

  if (!name || !ailmentId || !scheduledForRaw) {
    throw new Error("Missing required booking fields.");
  }

  const scheduledFor = new Date(scheduledForRaw);
  if (Number.isNaN(scheduledFor.getTime())) {
    throw new Error("Invalid appointment time.");
  }

  const ailment = await db.ailment.findUnique({ where: { id: ailmentId } });
  if (!ailment) {
    throw new Error("Unknown ailment.");
  }

  const agent = await db.agent.upsert({
    where: { name },
    update: {},
    create: { name },
  });

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
