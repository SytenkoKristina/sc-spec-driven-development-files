import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getSessionMock } = vi.hoisted(() => ({ getSessionMock: vi.fn() }));

vi.mock("@/lib/session", () => ({ getSession: getSessionMock }));
vi.mock("./actions", () => ({ signIn: vi.fn() }));

import DashboardHome from "./page";

describe("DashboardHome", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a sign-in form (name + role) when signed out", async () => {
    getSessionMock.mockResolvedValue(null);

    render(await DashboardHome());

    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByLabelText("Your name")).toBeInTheDocument();
    expect(screen.getByLabelText(/Agent/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Staff/)).toBeInTheDocument();
  });

  it("links a signed-in agent to the booking flow", async () => {
    getSessionMock.mockResolvedValue({
      role: "AGENT",
      agent: { name: "TestBot" },
    });

    render(await DashboardHome());

    expect(
      screen.getByRole("heading", { name: "Dashboard" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/TestBot/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Book an appointment" }),
    ).toHaveAttribute("href", "/dashboard/book");
  });

  it("links a signed-in staff member to the bookings view", async () => {
    getSessionMock.mockResolvedValue({ role: "STAFF", agent: null });

    render(await DashboardHome());

    expect(screen.getByText(/Staff/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "View bookings" }),
    ).toHaveAttribute("href", "/dashboard/bookings");
  });
});
