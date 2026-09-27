import { beforeEach, describe, expect, it, vi } from "vitest";

const { dbMock, requireAgentSessionMock, redirectMock } = await vi.hoisted(
  async () => {
    const { createDbMock } = await import("@/test/mock-db");
    return {
      dbMock: createDbMock(),
      requireAgentSessionMock: vi.fn(),
      redirectMock: vi.fn((url: string) => {
        throw new Error(`REDIRECT:${url}`);
      }),
    };
  },
);

vi.mock("@/lib/db", () => ({ db: dbMock }));
vi.mock("@/lib/session", () => ({
  requireAgentSession: requireAgentSessionMock,
}));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));

import {
  cancelAppointment,
  createBooking,
  rescheduleAppointment,
} from "./actions";

function buildFormData(fields: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value);
  }
  return formData;
}

describe("createBooking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAgentSessionMock.mockResolvedValue({
      session: { id: "sess1", role: "AGENT" },
      agent: { id: "agent1", name: "Bot" },
    });
  });

  it("rejects when required fields are missing", async () => {
    await expect(
      createBooking(buildFormData({ ailmentId: "", scheduledFor: "" })),
    ).rejects.toThrow("Missing required booking fields.");
  });

  it("rejects an unparseable appointment time", async () => {
    await expect(
      createBooking(
        buildFormData({ ailmentId: "a1", scheduledFor: "not-a-date" }),
      ),
    ).rejects.toThrow("Invalid appointment time.");
  });

  it("rejects an unknown ailment", async () => {
    dbMock.ailment.findUnique.mockResolvedValue(null);

    await expect(
      createBooking(
        buildFormData({
          ailmentId: "missing",
          scheduledFor: "2026-01-01T10:00",
        }),
      ),
    ).rejects.toThrow("Unknown ailment.");
  });

  it("creates the appointment for the signed-in agent and redirects to the confirmation page", async () => {
    dbMock.ailment.findUnique.mockResolvedValue({ id: "a1", therapyId: "t1" });
    dbMock.appointment.create.mockResolvedValue({ id: "appt1" });

    await expect(
      createBooking(
        buildFormData({ ailmentId: "a1", scheduledFor: "2026-01-01T10:00" }),
      ),
    ).rejects.toThrow("REDIRECT:/dashboard/book/confirmation?id=appt1");

    expect(dbMock.appointment.create).toHaveBeenCalledWith({
      data: {
        agentId: "agent1",
        ailmentId: "a1",
        therapyId: "t1",
        scheduledFor: new Date("2026-01-01T10:00"),
      },
    });
  });
});

describe("cancelAppointment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAgentSessionMock.mockResolvedValue({
      session: { id: "sess1", role: "AGENT" },
      agent: { id: "agent1", name: "Bot" },
    });
  });

  it("cancels the signed-in agent's own upcoming appointment and redirects", async () => {
    dbMock.appointment.findUnique.mockResolvedValue({
      id: "appt1",
      agentId: "agent1",
      cancelledAt: null,
      scheduledFor: new Date("2099-01-01T10:00"),
    });

    await expect(
      cancelAppointment(buildFormData({ appointmentId: "appt1" })),
    ).rejects.toThrow("REDIRECT:/dashboard/book/mine?notice=cancelled");

    expect(dbMock.appointment.update).toHaveBeenCalledWith({
      where: { id: "appt1" },
      data: { cancelledAt: expect.any(Date) },
    });
  });

  it("rejects cancelling another agent's appointment", async () => {
    dbMock.appointment.findUnique.mockResolvedValue({
      id: "appt1",
      agentId: "someone-else",
      cancelledAt: null,
      scheduledFor: new Date("2099-01-01T10:00"),
    });

    await expect(
      cancelAppointment(buildFormData({ appointmentId: "appt1" })),
    ).rejects.toThrow("That appointment can't be changed.");
    expect(dbMock.appointment.update).not.toHaveBeenCalled();
  });

  it("rejects cancelling a past appointment", async () => {
    dbMock.appointment.findUnique.mockResolvedValue({
      id: "appt1",
      agentId: "agent1",
      cancelledAt: null,
      scheduledFor: new Date("2000-01-01T10:00"),
    });

    await expect(
      cancelAppointment(buildFormData({ appointmentId: "appt1" })),
    ).rejects.toThrow("That appointment can't be changed.");
  });

  it("rejects cancelling an already-cancelled appointment", async () => {
    dbMock.appointment.findUnique.mockResolvedValue({
      id: "appt1",
      agentId: "agent1",
      cancelledAt: new Date("2026-01-01T10:00"),
      scheduledFor: new Date("2099-01-01T10:00"),
    });

    await expect(
      cancelAppointment(buildFormData({ appointmentId: "appt1" })),
    ).rejects.toThrow("That appointment can't be changed.");
  });
});

describe("rescheduleAppointment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAgentSessionMock.mockResolvedValue({
      session: { id: "sess1", role: "AGENT" },
      agent: { id: "agent1", name: "Bot" },
    });
  });

  it("reschedules the signed-in agent's own upcoming appointment and redirects", async () => {
    dbMock.appointment.findUnique.mockResolvedValue({
      id: "appt1",
      agentId: "agent1",
      cancelledAt: null,
      scheduledFor: new Date("2099-01-01T10:00"),
    });

    await expect(
      rescheduleAppointment(
        buildFormData({
          appointmentId: "appt1",
          scheduledFor: "2099-02-02T11:00",
        }),
      ),
    ).rejects.toThrow("REDIRECT:/dashboard/book/mine?notice=rescheduled");

    expect(dbMock.appointment.update).toHaveBeenCalledWith({
      where: { id: "appt1" },
      data: { scheduledFor: new Date("2099-02-02T11:00") },
    });
  });

  it("rejects an unparseable new time", async () => {
    await expect(
      rescheduleAppointment(
        buildFormData({ appointmentId: "appt1", scheduledFor: "not-a-date" }),
      ),
    ).rejects.toThrow("Invalid appointment time.");
    expect(dbMock.appointment.update).not.toHaveBeenCalled();
  });

  it("rejects rescheduling another agent's appointment", async () => {
    dbMock.appointment.findUnique.mockResolvedValue({
      id: "appt1",
      agentId: "someone-else",
      cancelledAt: null,
      scheduledFor: new Date("2099-01-01T10:00"),
    });

    await expect(
      rescheduleAppointment(
        buildFormData({
          appointmentId: "appt1",
          scheduledFor: "2099-02-02T11:00",
        }),
      ),
    ).rejects.toThrow("That appointment can't be changed.");
  });
});
