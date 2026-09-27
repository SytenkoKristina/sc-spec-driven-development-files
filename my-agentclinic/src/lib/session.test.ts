import { beforeEach, describe, expect, it, vi } from "vitest";

const { dbMock, cookieStoreMock, redirectMock } = await vi.hoisted(
  async () => {
    const { createDbMock } = await import("@/test/mock-db");
    return {
      dbMock: createDbMock(),
      cookieStoreMock: {
        get: vi.fn(),
        set: vi.fn(),
        delete: vi.fn(),
      },
      redirectMock: vi.fn((url: string) => {
        throw new Error(`REDIRECT:${url}`);
      }),
    };
  },
);

vi.mock("@/lib/db", () => ({ db: dbMock }));
vi.mock("next/headers", () => ({ cookies: () => cookieStoreMock }));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));

import {
  createSession,
  destroySession,
  getSession,
  requireAgentSession,
  requireStaffSession,
} from "./session";

describe("session", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const store = new Map<string, string>();
    cookieStoreMock.get.mockImplementation((name: string) => {
      const value = store.get(name);
      return value === undefined ? undefined : { name, value };
    });
    cookieStoreMock.set.mockImplementation((name: string, value: string) => {
      store.set(name, value);
    });
    cookieStoreMock.delete.mockImplementation((name: string) => {
      store.delete(name);
    });
  });

  describe("createSession", () => {
    it("creates an AGENT session linked to the given agent and sets an httpOnly cookie", async () => {
      dbMock.session.create.mockResolvedValue({
        id: "sess1",
        role: "AGENT",
        agentId: "agent1",
      });

      await createSession("AGENT", "agent1");

      expect(dbMock.session.create).toHaveBeenCalledWith({
        data: { role: "AGENT", agentId: "agent1" },
      });
      expect(cookieStoreMock.set).toHaveBeenCalledWith(
        "session_token",
        "sess1",
        expect.objectContaining({ httpOnly: true, path: "/" }),
      );
    });

    it("creates a STAFF session with no linked agent", async () => {
      dbMock.session.create.mockResolvedValue({
        id: "sess2",
        role: "STAFF",
        agentId: null,
      });

      await createSession("STAFF");

      expect(dbMock.session.create).toHaveBeenCalledWith({
        data: { role: "STAFF", agentId: undefined },
      });
    });
  });

  describe("getSession", () => {
    it("returns null when there is no session cookie", async () => {
      expect(await getSession()).toBeNull();
      expect(dbMock.session.findUnique).not.toHaveBeenCalled();
    });

    it("looks up the session by the cookie's token, including the linked agent", async () => {
      cookieStoreMock.set("session_token", "sess1");
      dbMock.session.findUnique.mockResolvedValue({
        id: "sess1",
        role: "AGENT",
        agent: { id: "agent1", name: "Bot" },
      });

      const session = await getSession();

      expect(dbMock.session.findUnique).toHaveBeenCalledWith({
        where: { id: "sess1" },
        include: { agent: true },
      });
      expect(session?.agent?.name).toBe("Bot");
    });

    it("returns null for a cookie with no matching session row (e.g. a forged token)", async () => {
      cookieStoreMock.set("session_token", "does-not-exist");
      dbMock.session.findUnique.mockResolvedValue(null);

      expect(await getSession()).toBeNull();
    });
  });

  describe("destroySession", () => {
    it("deletes the session row and clears the cookie", async () => {
      cookieStoreMock.set("session_token", "sess1");
      dbMock.session.delete.mockResolvedValue({ id: "sess1" });

      await destroySession();

      expect(dbMock.session.delete).toHaveBeenCalledWith({
        where: { id: "sess1" },
      });
      expect(cookieStoreMock.delete).toHaveBeenCalledWith("session_token");
    });

    it("is a no-op (beyond clearing the cookie) when there's no session cookie", async () => {
      await destroySession();

      expect(dbMock.session.delete).not.toHaveBeenCalled();
      expect(cookieStoreMock.delete).toHaveBeenCalledWith("session_token");
    });
  });

  describe("requireAgentSession", () => {
    it("returns the session and agent for a valid AGENT session", async () => {
      cookieStoreMock.set("session_token", "sess1");
      dbMock.session.findUnique.mockResolvedValue({
        id: "sess1",
        role: "AGENT",
        agent: { id: "agent1", name: "Bot" },
      });

      const { agent } = await requireAgentSession();

      expect(agent).toEqual({ id: "agent1", name: "Bot" });
    });

    it("redirects to /dashboard when there is no session", async () => {
      await expect(requireAgentSession()).rejects.toThrow(
        "REDIRECT:/dashboard",
      );
    });

    it("redirects to /dashboard when the session role is STAFF", async () => {
      cookieStoreMock.set("session_token", "sess1");
      dbMock.session.findUnique.mockResolvedValue({
        id: "sess1",
        role: "STAFF",
        agent: null,
      });

      await expect(requireAgentSession()).rejects.toThrow(
        "REDIRECT:/dashboard",
      );
    });
  });

  describe("requireStaffSession", () => {
    it("returns the session for a valid STAFF session", async () => {
      cookieStoreMock.set("session_token", "sess1");
      dbMock.session.findUnique.mockResolvedValue({
        id: "sess1",
        role: "STAFF",
        agent: null,
      });

      const session = await requireStaffSession();

      expect(session.role).toBe("STAFF");
    });

    it("redirects to /dashboard when the session role is AGENT", async () => {
      cookieStoreMock.set("session_token", "sess1");
      dbMock.session.findUnique.mockResolvedValue({
        id: "sess1",
        role: "AGENT",
        agent: { id: "agent1", name: "Bot" },
      });

      await expect(requireStaffSession()).rejects.toThrow(
        "REDIRECT:/dashboard",
      );
    });
  });
});
