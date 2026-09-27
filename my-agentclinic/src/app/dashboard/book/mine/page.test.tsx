import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { dbMock, requireAgentSessionMock } = await vi.hoisted(async () => {
  const { createDbMock } = await import("@/test/mock-db");
  return { dbMock: createDbMock(), requireAgentSessionMock: vi.fn() };
});

vi.mock("@/lib/db", () => ({ db: dbMock }));
vi.mock("@/lib/session", () => ({
  requireAgentSession: requireAgentSessionMock,
}));

import MyBookingsPage from "./page";

function renderPage(searchParams: Record<string, string> = {}) {
  return MyBookingsPage({
    params: Promise.resolve({}),
    searchParams: Promise.resolve(searchParams),
  });
}

describe("MyBookingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAgentSessionMock.mockResolvedValue({
      session: { id: "sess1", role: "AGENT" },
      agent: { id: "agent1", name: "TestBot" },
    });
  });

  it("lists the signed-in agent's upcoming appointments with cancel/reschedule controls", async () => {
    dbMock.appointment.findMany.mockResolvedValue([
      {
        id: "appt1",
        ailmentId: "a1",
        therapyId: "t1",
        scheduledFor: new Date("2099-01-01T10:00:00"),
        ailment: { name: "Context Window Fatigue" },
        therapy: { name: "Guided Context Pruning" },
      },
    ]);

    render(await renderPage());

    expect(
      screen.getByRole("heading", { name: "My bookings" }),
    ).toBeInTheDocument();
    expect(dbMock.appointment.findMany).toHaveBeenCalledWith({
      where: { agentId: "agent1", cancelledAt: null },
      orderBy: { scheduledFor: "asc" },
      include: { agent: true, ailment: true, therapy: true },
    });
    expect(
      screen.getByRole("button", { name: "Reschedule" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cancel appointment" }),
    ).toBeInTheDocument();
  });

  it("shows an empty state with no appointments", async () => {
    dbMock.appointment.findMany.mockResolvedValue([]);

    render(await renderPage());

    expect(
      screen.getByText("You have no upcoming appointments."),
    ).toBeInTheDocument();
  });

  it("shows a confirmation banner after a cancel/reschedule redirect", async () => {
    dbMock.appointment.findMany.mockResolvedValue([]);

    render(await renderPage({ notice: "rescheduled" }));

    expect(
      screen.getByText("Your appointment was rescheduled."),
    ).toBeInTheDocument();
  });
});
