import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DashboardHome from "./page";

describe("DashboardHome", () => {
  it("links to the booking flow and the staff bookings view", () => {
    render(<DashboardHome />);

    expect(
      screen.getByRole("heading", { name: "Dashboard" }),
    ).toBeInTheDocument();

    const bookLink = screen.getByRole("button", {
      name: "Book an appointment",
    });
    expect(bookLink).toHaveAttribute("href", "/dashboard/book");

    const bookingsLink = screen.getByRole("button", { name: "View bookings" });
    expect(bookingsLink).toHaveAttribute("href", "/dashboard/bookings");
  });
});
