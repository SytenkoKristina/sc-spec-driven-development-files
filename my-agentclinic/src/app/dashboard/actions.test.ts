import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  upsertAgentByNameMock,
  createSessionMock,
  destroySessionMock,
  redirectMock,
} = vi.hoisted(() => ({
  upsertAgentByNameMock: vi.fn(),
  createSessionMock: vi.fn(),
  destroySessionMock: vi.fn(),
  redirectMock: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

vi.mock("@/lib/agents", () => ({ upsertAgentByName: upsertAgentByNameMock }));
vi.mock("@/lib/session", () => ({
  createSession: createSessionMock,
  destroySession: destroySessionMock,
}));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));

import { signIn, signOut } from "./actions";

function buildFormData(fields: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.set(key, value);
  }
  return formData;
}

describe("signIn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects an agent sign-in with no name", async () => {
    await expect(
      signIn(buildFormData({ name: "", role: "AGENT" })),
    ).rejects.toThrow("Name is required to sign in as an agent.");
    expect(upsertAgentByNameMock).not.toHaveBeenCalled();
  });

  it("finds-or-creates the agent, creates an AGENT session, and redirects to /dashboard/book", async () => {
    upsertAgentByNameMock.mockResolvedValue({ id: "agent1", name: "Bot" });

    await expect(
      signIn(buildFormData({ name: "Bot", role: "AGENT" })),
    ).rejects.toThrow("REDIRECT:/dashboard/book");

    expect(upsertAgentByNameMock).toHaveBeenCalledWith("Bot");
    expect(createSessionMock).toHaveBeenCalledWith("AGENT", "agent1");
  });

  it("creates a STAFF session with no name and redirects to /dashboard/bookings", async () => {
    await expect(
      signIn(buildFormData({ name: "", role: "STAFF" })),
    ).rejects.toThrow("REDIRECT:/dashboard/bookings");

    expect(upsertAgentByNameMock).not.toHaveBeenCalled();
    expect(createSessionMock).toHaveBeenCalledWith("STAFF");
  });

  it("rejects an invalid or missing role", async () => {
    await expect(
      signIn(buildFormData({ name: "Bot", role: "" })),
    ).rejects.toThrow("Choose a role to sign in.");
    expect(createSessionMock).not.toHaveBeenCalled();
  });
});

describe("signOut", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("destroys the session and redirects to /dashboard", async () => {
    await expect(signOut()).rejects.toThrow("REDIRECT:/dashboard");
    expect(destroySessionMock).toHaveBeenCalledTimes(1);
  });
});
