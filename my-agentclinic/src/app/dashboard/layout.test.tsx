import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getSessionMock } = vi.hoisted(() => ({ getSessionMock: vi.fn() }));

vi.mock("@/lib/session", () => ({ getSession: getSessionMock }));
vi.mock("./actions", () => ({ signOut: vi.fn() }));

import DashboardLayout from "./layout";

describe("DashboardLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows no role-gated links or sign-out when signed out", async () => {
    getSessionMock.mockResolvedValue(null);

    render(
      await DashboardLayout({
        params: Promise.resolve({}),
        children: <p>Page content</p>,
      }),
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "AgentClinic Dashboard" }),
    ).toHaveAttribute("href", "/dashboard");
    expect(screen.queryByRole("link", { name: "Book" })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Bookings" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Sign out" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });

  it("shows the Book link and sign-out for an AGENT session, not Bookings", async () => {
    getSessionMock.mockResolvedValue({ id: "sess1", role: "AGENT" });

    render(
      await DashboardLayout({
        params: Promise.resolve({}),
        children: <p>Page content</p>,
      }),
    );

    expect(screen.getByRole("link", { name: "Book" })).toHaveAttribute(
      "href",
      "/dashboard/book",
    );
    expect(
      screen.queryByRole("link", { name: "Bookings" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
  });

  it("shows the Bookings link and sign-out for a STAFF session, not Book", async () => {
    getSessionMock.mockResolvedValue({ id: "sess1", role: "STAFF" });

    render(
      await DashboardLayout({
        params: Promise.resolve({}),
        children: <p>Page content</p>,
      }),
    );

    expect(screen.getByRole("link", { name: "Bookings" })).toHaveAttribute(
      "href",
      "/dashboard/bookings",
    );
    expect(screen.queryByRole("link", { name: "Book" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
  });
});
