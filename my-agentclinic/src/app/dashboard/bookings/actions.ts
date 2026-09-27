"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireStaffSession } from "@/lib/session";

export async function cancelBookingAsStaff(formData: FormData) {
  await requireStaffSession();
  const appointmentId = String(formData.get("appointmentId") ?? "");

  const appointment = await db.appointment.findUnique({
    where: { id: appointmentId },
  });
  if (!appointment || appointment.cancelledAt) {
    throw new Error("That appointment can't be cancelled.");
  }

  await db.appointment.update({
    where: { id: appointmentId },
    data: { cancelledAt: new Date() },
  });

  redirect("/dashboard/bookings?notice=cancelled");
}
