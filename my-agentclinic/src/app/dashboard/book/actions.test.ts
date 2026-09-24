import { beforeEach, describe, expect, it, vi } from "vitest";

const { dbMock, redirectMock } = await vi.hoisted(async () => {
  const { createDbMock } = await import("@/test/mock-db");
  return {
    dbMock: createDbMock(),
    redirectMock: vi.fn((url: string) => {
      throw new Error(`REDIRECT:${url}`);
    }),
  };
});

vi.mock("@/lib/db", () => ({ db: dbMock }));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));

import { createBooking } from "./actions";

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
  });

  it("rejects when required fields are missing", async () => {
    await expect(
      createBooking(
        buildFormData({ name: "", ailmentId: "", scheduledFor: "" }),
      ),
    ).rejects.toThrow("Missing required booking fields.");
  });

  it("rejects an unparseable appointment time", async () => {
    await expect(
      createBooking(
        buildFormData({
          name: "Bot",
          ailmentId: "a1",
          scheduledFor: "not-a-date",
        }),
      ),
    ).rejects.toThrow("Invalid appointment time.");
  });

  it("rejects an unknown ailment", async () => {
    dbMock.ailment.findUnique.mockResolvedValue(null);

    await expect(
      createBooking(
        buildFormData({
          name: "Bot",
          ailmentId: "missing",
          scheduledFor: "2026-01-01T10:00",
        }),
      ),
    ).rejects.toThrow("Unknown ailment.");
  });

  it("reuses an existing agent by name, creates the appointment, and redirects to the confirmation page", async () => {
    dbMock.ailment.findUnique.mockResolvedValue({ id: "a1", therapyId: "t1" });
    dbMock.agent.upsert.mockResolvedValue({ id: "agent1" });
    dbMock.appointment.create.mockResolvedValue({ id: "appt1" });

    await expect(
      createBooking(
        buildFormData({
          name: "Bot",
          ailmentId: "a1",
          scheduledFor: "2026-01-01T10:00",
        }),
      ),
    ).rejects.toThrow("REDIRECT:/dashboard/book/confirmation?id=appt1");

    expect(dbMock.agent.upsert).toHaveBeenCalledWith({
      where: { name: "Bot" },
      update: {},
      create: { name: "Bot" },
    });
    expect(dbMock.appointment.create).toHaveBeenCalledWith({
      data: {
        agentId: "agent1",
        ailmentId: "a1",
        therapyId: "t1",
        scheduledFor: new Date("2026-01-01T10:00"),
      },
    });
  });

  it("falls back to the concurrently-created agent when upsert loses a unique-constraint race", async () => {
    dbMock.ailment.findUnique.mockResolvedValue({ id: "a1", therapyId: "t1" });
    dbMock.agent.upsert.mockRejectedValue({ code: "P2002" });
    dbMock.agent.findUniqueOrThrow.mockResolvedValue({ id: "agent1" });
    dbMock.appointment.create.mockResolvedValue({ id: "appt1" });

    await expect(
      createBooking(
        buildFormData({
          name: "Bot",
          ailmentId: "a1",
          scheduledFor: "2026-01-01T10:00",
        }),
      ),
    ).rejects.toThrow("REDIRECT:/dashboard/book/confirmation?id=appt1");

    expect(dbMock.agent.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { name: "Bot" },
    });
    expect(dbMock.appointment.create).toHaveBeenCalledWith({
      data: {
        agentId: "agent1",
        ailmentId: "a1",
        therapyId: "t1",
        scheduledFor: new Date("2026-01-01T10:00"),
      },
    });
  });

  it("re-throws an agent upsert error that isn't a unique-constraint race", async () => {
    dbMock.ailment.findUnique.mockResolvedValue({ id: "a1", therapyId: "t1" });
    dbMock.agent.upsert.mockRejectedValue(new Error("database is locked"));

    await expect(
      createBooking(
        buildFormData({
          name: "Bot",
          ailmentId: "a1",
          scheduledFor: "2026-01-01T10:00",
        }),
      ),
    ).rejects.toThrow("database is locked");

    expect(dbMock.agent.findUniqueOrThrow).not.toHaveBeenCalled();
    expect(dbMock.appointment.create).not.toHaveBeenCalled();
  });
});
