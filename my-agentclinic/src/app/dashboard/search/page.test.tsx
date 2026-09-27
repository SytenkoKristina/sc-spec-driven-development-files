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

import SearchPage from "./page";

function renderPage(searchParams: Record<string, string> = {}) {
  return SearchPage({
    params: Promise.resolve({}),
    searchParams: Promise.resolve(searchParams),
  });
}

describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireAnySessionMock.mockResolvedValue({ id: "sess1", role: "AGENT" });
  });

  it("prompts for a search term when none is given, without querying the db", async () => {
    render(await renderPage());

    expect(screen.getByText("Enter a search term above.")).toBeInTheDocument();
    expect(dbMock.ailment.findMany).not.toHaveBeenCalled();
    expect(dbMock.therapy.findMany).not.toHaveBeenCalled();
  });

  it("lists matching ailments and therapies", async () => {
    dbMock.ailment.findMany.mockResolvedValue([
      { id: "a1", name: "Context Window Fatigue" },
    ]);
    dbMock.therapy.findMany.mockResolvedValue([
      { id: "t1", name: "Guided Context Pruning" },
    ]);

    render(await renderPage({ q: "context" }));

    expect(dbMock.ailment.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { name: { contains: "context" } },
          { description: { contains: "context" } },
        ],
      },
      orderBy: { name: "asc" },
    });
    expect(
      screen.getByRole("link", { name: "Context Window Fatigue" }),
    ).toHaveAttribute("href", "/dashboard/ailments/a1");
    expect(
      screen.getByRole("link", { name: "Guided Context Pruning" }),
    ).toHaveAttribute("href", "/dashboard/therapies/t1");
  });

  it("shows a no-matches message when nothing is found", async () => {
    dbMock.ailment.findMany.mockResolvedValue([]);
    dbMock.therapy.findMany.mockResolvedValue([]);

    render(await renderPage({ q: "nothing matches this" }));

    expect(screen.getByText("No matches found.")).toBeInTheDocument();
  });
});
