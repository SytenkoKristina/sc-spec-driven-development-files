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

import AilmentDetailPage from "./page";

describe("AilmentDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAnySessionMock.mockResolvedValue({ id: "sess1", role: "AGENT" });
  });

  it("shows the ailment's full description and matched therapy", async () => {
    dbMock.ailment.findUnique.mockResolvedValue({
      id: "a1",
      name: "Context Window Fatigue",
      description: "Short description.",
      longDescription: "The full, longer description.",
      therapy: { name: "Guided Context Pruning" },
    });

    render(
      await AilmentDetailPage({
        params: Promise.resolve({ id: "a1" }),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(
      screen.getByRole("heading", { name: "Context Window Fatigue" }),
    ).toBeInTheDocument();
    expect(screen.getByText("The full, longer description.")).toBeInTheDocument();
    expect(screen.getByText("Guided Context Pruning")).toBeInTheDocument();
  });

  it("shows a not-found message for an unknown ailment", async () => {
    dbMock.ailment.findUnique.mockResolvedValue(null);

    render(
      await AilmentDetailPage({
        params: Promise.resolve({ id: "missing" }),
        searchParams: Promise.resolve({}),
      }),
    );

    expect(
      screen.getByRole("heading", { name: "Ailment not found" }),
    ).toBeInTheDocument();
  });
});
