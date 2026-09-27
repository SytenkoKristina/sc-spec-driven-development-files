import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ConfirmationBanner from "./ConfirmationBanner";

describe("ConfirmationBanner", () => {
  it("renders the given message as a status announcement", () => {
    render(<ConfirmationBanner message="Your appointment was cancelled." />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Your appointment was cancelled.",
    );
  });
});
