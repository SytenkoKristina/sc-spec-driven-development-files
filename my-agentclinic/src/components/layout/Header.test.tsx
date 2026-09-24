import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Header from "./Header";

describe("Header", () => {
  it("renders the AgentClinic wordmark", () => {
    render(<Header />);
    expect(screen.getByText("AgentClinic")).toBeInTheDocument();
  });
});
