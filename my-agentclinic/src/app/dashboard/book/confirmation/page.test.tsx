import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { dbMock } = await vi.hoisted(async () => {
  const { createDbMock } = await import("@/test/mock-db");
  return { dbMock: createDbMock() };
});

vi.mock("@/lib/db", () => ({ db: dbMock }));

import BookingConfirmationPage from "./page";

describe("BookingConfirmationPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the booked appointment's agent, ailment, therapy, and time", async () => {
    dbMock.appointment.findUnique.mockResolvedValue({
      id: "appt1",
      scheduledFor: new Date("2026-10-05T14:30:00"),
      agent: { name: "TestBot" },
      ailment: { name: "Context Window Fatigue" },
      therapy: { name: "Guided Context Pruning" },
    });

    render(
      await BookingConfirmationPage({
        params: Promise.resolve({}),
        searchParams: Promise.resolve({ id: "appt1" }),
      }),
    );

    expect(
      screen.getByRole("heading", { name: "You’re booked in" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/TestBot/)).toBeInTheDocument();
    expect(screen.getByText("Context Window Fatigue")).toBeInTheDocument();
    expect(screen.getByText("Guided Context Pruning")).toBeInTheDocument();
    expect(dbMock.appointment.findUnique).toHaveBeenCalledWith({
      where: { id: "appt1" },
      include: { agent: true, ailment: true, therapy: true },
    });
  });

  it("shows a not-found message when there is no id or the appointment doesn't exist", async () => {
    dbMock.appointment.findUnique.mockResolvedValue(null);

    render(
      await BookingConfirmationPage({
        params: Promise.resolve({}),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(
      screen.getByRole("heading", { name: "Booking not found" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Book an appointment" }),
    ).toHaveAttribute("href", "/dashboard/book");
    expect(dbMock.appointment.findUnique).not.toHaveBeenCalled();
  });
});
