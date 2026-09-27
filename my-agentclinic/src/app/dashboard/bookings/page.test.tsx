import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { dbMock } = await vi.hoisted(async () => {
  const { createDbMock } = await import("@/test/mock-db");
  return { dbMock: createDbMock() };
});

vi.mock("@/lib/db", () => ({ db: dbMock }));

import BookingsPage from "./page";

describe("BookingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists every appointment with agent, ailment, therapy, and time", async () => {
    dbMock.appointment.findMany.mockResolvedValue([
      {
        id: "appt1",
        scheduledFor: new Date("2026-10-05T14:30:00"),
        agent: { name: "TestBot" },
        ailment: { name: "Context Window Fatigue" },
        therapy: { name: "Guided Context Pruning" },
        review: null,
      },
    ]);

    render(await BookingsPage());

    expect(
      screen.getByRole("heading", { name: "Upcoming bookings" }),
    ).toBeInTheDocument();
    const row = screen.getByRole("row", { name: /TestBot/ });
    expect(row).toHaveTextContent("Context Window Fatigue");
    expect(row).toHaveTextContent("Guided Context Pruning");
    expect(row).toHaveTextContent("Leave a review");
    expect(dbMock.appointment.findMany).toHaveBeenCalledWith({
      orderBy: { scheduledFor: "asc" },
      include: { agent: true, ailment: true, therapy: true, review: true },
    });
  });

  it("shows the rating instead of a prompt once an appointment has been reviewed", async () => {
    dbMock.appointment.findMany.mockResolvedValue([
      {
        id: "appt1",
        scheduledFor: new Date("2026-10-05T14:30:00"),
        agent: { name: "TestBot" },
        ailment: { name: "Context Window Fatigue" },
        therapy: { name: "Guided Context Pruning" },
        review: { rating: 4 },
      },
    ]);

    render(await BookingsPage());

    const row = screen.getByRole("row", { name: /TestBot/ });
    expect(row).toHaveTextContent("★ 4/5");
  });

  it("shows an empty state with no table when there are no appointments yet", async () => {
    dbMock.appointment.findMany.mockResolvedValue([]);

    render(await BookingsPage());

    expect(screen.getByText("No appointments booked yet.")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
