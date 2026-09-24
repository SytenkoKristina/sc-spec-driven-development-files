import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DashboardLayout from "./layout";

describe("DashboardLayout", () => {
  it("renders nav links and the page content", () => {
    render(
      <DashboardLayout params={Promise.resolve({})}>
        <p>Page content</p>
      </DashboardLayout>,
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "AgentClinic Dashboard" }),
    ).toHaveAttribute("href", "/dashboard");
    expect(screen.getByRole("link", { name: "Book" })).toHaveAttribute(
      "href",
      "/dashboard/book",
    );
    expect(screen.getByRole("link", { name: "Bookings" })).toHaveAttribute(
      "href",
      "/dashboard/bookings",
    );
    expect(screen.getByText("Page content")).toBeInTheDocument();
  });
});
