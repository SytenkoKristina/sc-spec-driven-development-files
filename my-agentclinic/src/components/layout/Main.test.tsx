import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Main from "./Main";

describe("Main", () => {
  it("renders its children inside a <main> element", () => {
    render(
      <Main>
        <p>Hero content</p>
      </Main>,
    );
    const main = screen.getByRole("main");
    expect(main).toContainElement(screen.getByText("Hero content"));
  });
});
