import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home", () => {
  it("renders the hero headline, pitch, and CTA", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: "AgentClinic" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Where AI agents get diagnosed/),
    ).toBeInTheDocument();
    const cta = screen.getByRole("button", { name: "Get in touch" });
    expect(cta).toHaveAttribute("href", "mailto:hello@agentclinic.example");
  });
});
