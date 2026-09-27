import { beforeEach, describe, expect, it, vi } from "vitest";

const { dbMock, requireStaffSessionMock, redirectMock } = await vi.hoisted(
  async () => {
    const { createDbMock } = await import("@/test/mock-db");
    return {
      dbMock: createDbMock(),
      requireStaffSessionMock: vi.fn(),
      redirectMock: vi.fn((url: string) => {
        throw new Error(`REDIRECT:${url}`);
      }),
    };
  },
);

vi.mock("@/lib/db", () => ({ db: dbMock }));
vi.mock("@/lib/session", () => ({
  requireStaffSession: requireStaffSessionMock,
}));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));

import { cancelBookingAsStaff } from "./actions";

function buildFormData(fields: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value);
  }
  return formData;
}

describe("cancelBookingAsStaff", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireStaffSessionMock.mockResolvedValue({ id: "sess1", role: "STAFF" });
  });

  it("cancels any upcoming appointment and redirects", async () => {
    dbMock.appointment.findUnique.mockResolvedValue({
      id: "appt1",
      cancelledAt: null,
    });

    await expect(
      cancelBookingAsStaff(buildFormData({ appointmentId: "appt1" })),
    ).rejects.toThrow("REDIRECT:/dashboard/bookings?notice=cancelled");

    expect(dbMock.appointment.update).toHaveBeenCalledWith({
      where: { id: "appt1" },
      data: { cancelledAt: expect.any(Date) },
    });
  });

  it("rejects cancelling an unknown appointment", async () => {
    dbMock.appointment.findUnique.mockResolvedValue(null);

    await expect(
      cancelBookingAsStaff(buildFormData({ appointmentId: "missing" })),
    ).rejects.toThrow("That appointment can't be cancelled.");
    expect(dbMock.appointment.update).not.toHaveBeenCalled();
  });

  it("rejects cancelling an already-cancelled appointment", async () => {
    dbMock.appointment.findUnique.mockResolvedValue({
      id: "appt1",
      cancelledAt: new Date("2026-01-01T10:00"),
    });

    await expect(
      cancelBookingAsStaff(buildFormData({ appointmentId: "appt1" })),
    ).rejects.toThrow("That appointment can't be cancelled.");
    expect(dbMock.appointment.update).not.toHaveBeenCalled();
  });

  it("only cancels for a staff session (guarded even if the page check is bypassed)", async () => {
    requireStaffSessionMock.mockRejectedValue(new Error("REDIRECT:/dashboard"));

    await expect(
      cancelBookingAsStaff(buildFormData({ appointmentId: "appt1" })),
    ).rejects.toThrow("REDIRECT:/dashboard");
    expect(dbMock.appointment.update).not.toHaveBeenCalled();
  });
});
