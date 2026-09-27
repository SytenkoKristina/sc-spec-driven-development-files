import { beforeEach, describe, expect, it, vi } from "vitest";

const { dbMock } = await vi.hoisted(async () => {
  const { createDbMock } = await import("@/test/mock-db");
  return { dbMock: createDbMock() };
});

vi.mock("@/lib/db", () => ({ db: dbMock }));

import { upsertAgentByName } from "./agents";

describe("upsertAgentByName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates or reuses an agent by name", async () => {
    dbMock.agent.upsert.mockResolvedValue({ id: "agent1", name: "Bot" });

    const agent = await upsertAgentByName("Bot");

    expect(agent).toEqual({ id: "agent1", name: "Bot" });
    expect(dbMock.agent.upsert).toHaveBeenCalledWith({
      where: { name: "Bot" },
      update: {},
      create: { name: "Bot" },
    });
  });

  it("falls back to the concurrently-created agent when upsert loses a unique-constraint race", async () => {
    dbMock.agent.upsert.mockRejectedValue({ code: "P2002" });
    dbMock.agent.findUniqueOrThrow.mockResolvedValue({
      id: "agent1",
      name: "Bot",
    });

    const agent = await upsertAgentByName("Bot");

    expect(agent).toEqual({ id: "agent1", name: "Bot" });
    expect(dbMock.agent.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { name: "Bot" },
    });
  });

  it("re-throws an upsert error that isn't a unique-constraint race", async () => {
    dbMock.agent.upsert.mockRejectedValue(new Error("database is locked"));

    await expect(upsertAgentByName("Bot")).rejects.toThrow(
      "database is locked",
    );
    expect(dbMock.agent.findUniqueOrThrow).not.toHaveBeenCalled();
  });
});
