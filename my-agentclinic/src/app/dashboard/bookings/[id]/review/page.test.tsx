import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { dbMock } = await vi.hoisted(async () => {
  const { createDbMock } = await import("@/test/mock-db");
  return { dbMock: createDbMock() };
});

vi.mock("@/lib/db", () => ({ db: dbMock }));

import ReviewPage from "./page";

function renderPage(id = "appt1") {
  return ReviewPage({
    params: Promise.resolve({ id }),
    searchParams: Promise.resolve({}),
  });
}

describe("ReviewPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a not-found message when the appointment doesn't exist", async () => {
    dbMock.appointment.findUnique.mockResolvedValue(null);

    render(await renderPage());

    expect(
      screen.getByRole("heading", { name: "Appointment not found" }),
    ).toBeInTheDocument();
  });

  it("shows a review form when no review exists yet", async () => {
    dbMock.appointment.findUnique.mockResolvedValue({
      id: "appt1",
      agent: { name: "TestBot" },
      therapy: { name: "Guided Context Pruning" },
      review: null,
    });

    render(await renderPage());

    expect(
      screen.getByRole("heading", { name: "Leave a review" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Rating")).toBeInTheDocument();
    expect(screen.getByLabelText("Comment (optional)")).toBeInTheDocument();
  });

  it("shows the existing review instead of a form when one exists", async () => {
    dbMock.appointment.findUnique.mockResolvedValue({
      id: "appt1",
      agent: { name: "TestBot" },
      therapy: { name: "Guided Context Pruning" },
      review: { rating: 4, comment: "Helped a lot." },
    });

    render(await renderPage());

    expect(
      screen.getByRole("heading", { name: "Your review" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Helped a lot.")).toBeInTheDocument();
    expect(screen.queryByLabelText("Rating")).not.toBeInTheDocument();
  });
});
