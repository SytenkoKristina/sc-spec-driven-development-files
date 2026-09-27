import { db } from "@/lib/db";

const appointmentWithRelations = {
  include: { agent: true, ailment: true, therapy: true },
} as const;

export function listUpcomingAppointments(agentNameContains?: string) {
  return db.appointment.findMany({
    where: {
      cancelledAt: null,
      ...(agentNameContains
        ? { agent: { name: { contains: agentNameContains } } }
        : {}),
    },
    orderBy: { scheduledFor: "asc" },
    ...appointmentWithRelations,
  });
}

export function listUpcomingAppointmentsForAgent(agentId: string) {
  return db.appointment.findMany({
    where: { agentId, cancelledAt: null },
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
