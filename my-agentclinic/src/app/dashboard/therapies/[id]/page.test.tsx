import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { dbMock, requireAnySessionMock } = await vi.hoisted(async () => {
  const { createDbMock } = await import("@/test/mock-db");
  return { dbMock: createDbMock(), requireAnySessionMock: vi.fn() };
});

vi.mock("@/lib/db", () => ({ db: dbMock }));
vi.mock("@/lib/session", () => ({
  requireAnySession: requireAnySessionMock,
}));

import TherapyDetailPage from "./page";

describe("TherapyDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAnySessionMock.mockResolvedValue({ id: "sess1", role: "STAFF" });
  });

  it("shows the therapy's full description and matched ailment", async () => {
    dbMock.therapy.findUnique.mockResolvedValue({
      id: "t1",
      name: "Guided Context Pruning",
      description: "Short description.",
      longDescription: "The full, longer description.",
      ailment: { name: "Context Window Fatigue" },
    });

    render(
      await TherapyDetailPage({
        params: Promise.resolve({ id: "t1" }),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(
      screen.getByRole("heading", { name: "Guided Context Pruning" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("The full, longer description."),
    ).toBeInTheDocument();
    expect(screen.getByText("Context Window Fatigue")).toBeInTheDocument();
  });

  it("shows a not-found message for an unknown therapy", async () => {
    dbMock.therapy.findUnique.mockResolvedValue(null);

    render(
      await TherapyDetailPage({
        params: Promise.resolve({ id: "missing" }),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(
      screen.getByRole("heading", { name: "Therapy not found" }),
    ).toBeInTheDocument();
  });
});
