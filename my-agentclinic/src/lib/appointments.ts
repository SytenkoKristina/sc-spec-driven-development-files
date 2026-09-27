import { db } from "@/lib/db";

const appointmentWithRelations = {
  include: { agent: true, ailment: true, therapy: true, review: true },
} as const;

export function listUpcomingAppointments() {
  return db.appointment.findMany({
    orderBy: { scheduledFor: "asc" },
    ...appointmentWithRelations,
  });
}

export function getAppointmentById(id: string) {
  return db.appointment.findUnique({
    where: { id },
    ...appointmentWithRelations,
  });
}
