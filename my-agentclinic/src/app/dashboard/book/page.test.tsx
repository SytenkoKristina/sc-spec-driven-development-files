import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { dbMock } = await vi.hoisted(async () => {
  const { createDbMock } = await import("@/test/mock-db");
  return { dbMock: createDbMock() };
});

vi.mock("@/lib/db", () => ({ db: dbMock }));

import BookPage from "./page";

describe("BookPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a name + ailment picker sourced from the database when no selection has been made", async () => {
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
    expect(screen.getByLabelText("Your name")).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Context Window Fatigue" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Hallucination Spirals" }),
    ).toBeInTheDocument();
    expect(dbMock.ailment.findUnique).not.toHaveBeenCalled();
  });

  it("shows the one matched therapy once a name and ailment are selected, with no therapy-choice step", async () => {
    dbMock.ailment.findUnique.mockResolvedValue({
      id: "a1",
      name: "Context Window Fatigue",
      description: "Struggling to keep track of what matters.",
      therapyId: "t1",
      therapy: {
        name: "Guided Context Pruning",
        description: "Trim irrelevant history.",
      },
    });
    dbMock.review.findMany.mockResolvedValue([]);

    render(
      await BookPage({
        params: Promise.resolve({}),
        searchParams: Promise.resolve({ name: "TestBot", ailmentId: "a1" }),
      }),
    );

    expect(
      screen.getByRole("heading", { name: "Confirm your appointment" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/TestBot/)).toBeInTheDocument();
    expect(screen.getByText("Guided Context Pruning")).toBeInTheDocument();
    expect(screen.getByText("No reviews yet")).toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(dbMock.ailment.findMany).not.toHaveBeenCalled();
  });

  it("shows the aggregate rating for the matched therapy when reviews exist", async () => {
    dbMock.ailment.findUnique.mockResolvedValue({
      id: "a1",
      name: "Context Window Fatigue",
      description: "Struggling to keep track of what matters.",
      therapyId: "t1",
      therapy: {
        name: "Guided Context Pruning",
        description: "Trim irrelevant history.",
      },
    });
    dbMock.review.findMany.mockResolvedValue([{ rating: 4 }, { rating: 5 }]);

    render(
      await BookPage({
        params: Promise.resolve({}),
        searchParams: Promise.resolve({ name: "TestBot", ailmentId: "a1" }),
      }),
    );

    expect(screen.getByText("★ 4.5 average (2 reviews)")).toBeInTheDocument();
  });

  it("falls back to the picker when the selected ailment no longer exists", async () => {
    dbMock.ailment.findUnique.mockResolvedValue(null);
    dbMock.ailment.findMany.mockResolvedValue([]);

    render(
      await BookPage({
        params: Promise.resolve({}),
        searchParams: Promise.resolve({ name: "TestBot", ailmentId: "gone" }),
      }),
    );

    expect(
      screen.getByRole("heading", { name: "Book an appointment" }),
    ).toBeInTheDocument();
  });
});
