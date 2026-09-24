import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BookError from "./error";

describe("BookError", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows the error message and lets the user retry", () => {
    const reset = vi.fn();

    render(<BookError error={new Error("Unknown ailment.")} reset={reset} />);

    expect(
      screen.getByRole("heading", { name: "Something went wrong" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Unknown ailment.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it("falls back to a generic message when the error has no message", () => {
    render(<BookError error={new Error()} reset={vi.fn()} />);

    expect(
      screen.getByText("We couldn't complete that booking."),
    ).toBeInTheDocument();
  });
});
