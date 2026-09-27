import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { dbMock, requireStaffSessionMock } = await vi.hoisted(async () => {
  const { createDbMock } = await import("@/test/mock-db");
  return { dbMock: createDbMock(), requireStaffSessionMock: vi.fn() };
});

vi.mock("@/lib/db", () => ({ db: dbMock }));
vi.mock("@/lib/session", () => ({
  requireStaffSession: requireStaffSessionMock,
}));

import BookingsPage from "./page";

function renderPage(searchParams: Record<string, string> = {}) {
  return BookingsPage({
    params: Promise.resolve({}),
    searchParams: Promise.resolve(searchParams),
  });
}

describe("BookingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireStaffSessionMock.mockResolvedValue({
      id: "sess1",
      role: "STAFF",
      createdAt: new Date("2026-01-01T00:00:00"),
    });
  });

  it("lists every appointment with agent, ailment, therapy, and time", async () => {
    dbMock.appointment.findMany.mockResolvedValue([
      {
        id: "appt1",
        scheduledFor: new Date("2026-10-05T14:30:00"),
        createdAt: new Date("2026-01-01T00:00:00"),
        agent: { name: "TestBot" },
        ailment: { name: "Context Window Fatigue" },
        therapy: { name: "Guided Context Pruning" },
      },
    ]);

    render(await renderPage());

    expect(
      screen.getByRole("heading", { name: "Upcoming bookings" }),
    ).toBeInTheDocument();
    const row = screen.getByRole("row", { name: /TestBot/ });
    expect(row).toHaveTextContent("Context Window Fatigue");
    expect(row).toHaveTextContent("Guided Context Pruning");
    expect(dbMock.appointment.findMany).toHaveBeenCalledWith({
      where: { cancelledAt: null },
      orderBy: { scheduledFor: "asc" },
      include: { agent: true, ailment: true, therapy: true },
    });
  });

  it("shows an empty state with no table when there are no appointments yet", async () => {
    dbMock.appointment.findMany.mockResolvedValue([]);

    render(await renderPage());

    expect(
      screen.getByText("No appointments booked yet."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("badges an appointment created after the staff session started as New", async () => {
    dbMock.appointment.findMany.mockResolvedValue([
      {
        id: "appt1",
        scheduledFor: new Date("2026-10-05T14:30:00"),
        createdAt: new Date("2026-06-01T00:00:00"),
        agent: { name: "TestBot" },
        ailment: { name: "Context Window Fatigue" },
        therapy: { name: "Guided Context Pruning" },
      },
    ]);

    render(await renderPage());

    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("filters by agent name via a query param", async () => {
    dbMock.appointment.findMany.mockResolvedValue([]);

    render(await renderPage({ agent: "Test" }));

    expect(dbMock.appointment.findMany).toHaveBeenCalledWith({
      where: {
        cancelledAt: null,
        agent: { name: { contains: "Test" } },
      },
      orderBy: { scheduledFor: "asc" },
      include: { agent: true, ailment: true, therapy: true },
    });
  });

  it("shows a confirmation banner after cancelling", async () => {
    dbMock.appointment.findMany.mockResolvedValue([]);

    render(await renderPage({ notice: "cancelled" }));

    expect(
      screen.getByText("The appointment was cancelled."),
    ).toBeInTheDocument();
  });
});
