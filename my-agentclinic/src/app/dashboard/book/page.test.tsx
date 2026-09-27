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

import BookPage from "./page";

describe("BookPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAgentSessionMock.mockResolvedValue({
      session: { id: "sess1", role: "AGENT" },
      agent: { id: "agent1", name: "TestBot" },
    });
  });

  it("shows an ailment picker sourced from the database when no selection has been made", async () => {
    dbMock.ailment.findMany.mockResolvedValue([
      { id: "a1", name: "Context Window Fatigue" },
      { id: "a2", name: "Hallucination Spirals" },
    ]);

    render(
      await BookPage({
        params: Promise.resolve({}),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(
      screen.getByRole("heading", { name: "Book an appointment" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/TestBot/)).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Context Window Fatigue" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Hallucination Spirals" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Context Window Fatigue" }),
    ).toHaveAttribute("href", "/dashboard/ailments/a1");
    expect(dbMock.ailment.findUnique).not.toHaveBeenCalled();
  });

  it("shows the one matched therapy once an ailment is selected, with no therapy-choice step", async () => {
    dbMock.ailment.findUnique.mockResolvedValue({
      id: "a1",
      name: "Context Window Fatigue",
      description: "Struggling to keep track of what matters.",
      therapy: {
        id: "t1",
        name: "Guided Context Pruning",
        description: "Trim irrelevant history.",
      },
    });

    render(
      await BookPage({
        params: Promise.resolve({}),
        searchParams: Promise.resolve({ ailmentId: "a1" }),
      }),
    );

    expect(
      screen.getByRole("heading", { name: "Confirm your appointment" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/TestBot/)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Guided Context Pruning" }),
    ).toHaveAttribute("href", "/dashboard/therapies/t1");
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(dbMock.ailment.findMany).not.toHaveBeenCalled();
  });

  it("falls back to the picker when the selected ailment no longer exists", async () => {
    dbMock.ailment.findUnique.mockResolvedValue(null);
    dbMock.ailment.findMany.mockResolvedValue([]);

    render(
      await BookPage({
        params: Promise.resolve({}),
        searchParams: Promise.resolve({ ailmentId: "gone" }),
      }),
    );

    expect(
      screen.getByRole("heading", { name: "Book an appointment" }),
    ).toBeInTheDocument();
  });
});
