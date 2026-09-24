import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Layout from "./Layout";

describe("Layout", () => {
  it("renders the header, the children inside main, and the footer", () => {
    render(
      <Layout>
        <p>Page content</p>
      </Layout>,
    );
    expect(screen.getByText("AgentClinic")).toBeInTheDocument();
    expect(screen.getByRole("main")).toContainElement(
      screen.getByText("Page content"),
    );
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
