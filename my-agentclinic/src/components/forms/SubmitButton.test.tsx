import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SubmitButton from "./SubmitButton";

describe("SubmitButton", () => {
  it("renders its label and is enabled outside of a pending submission", () => {
    render(
      <form>
        <SubmitButton pendingLabel="Booking…">Confirm booking</SubmitButton>
      </form>,
    );

    const button = screen.getByRole("button", { name: "Confirm booking" });
    expect(button).toBeEnabled();
  });
});
