import { describe, expect, it, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans" }),
  Geist_Mono: () => ({ variable: "--font-geist-mono" }),
}));

const { metadata } = await import("./layout");

describe("RootLayout metadata", () => {
  it("sets the AgentClinic title", () => {
    expect(metadata.title).toBe("AgentClinic");
  });

  it("sets a description mentioning AgentClinic's pitch", () => {
    expect(metadata.description).toMatch(/AI agents/);
    expect(metadata.description).toMatch(/therapy/);
  });
});
