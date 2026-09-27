import { beforeEach, describe, expect, it, vi } from "vitest";

const { dbMock } = await vi.hoisted(async () => {
  const { createDbMock } = await import("@/test/mock-db");
  return { dbMock: createDbMock() };
});

vi.mock("@/lib/db", () => ({ db: dbMock }));

import {
  InvalidRatingError,
  createReview,
  getTherapyRatingSummary,
} from "./reviews";

describe("createReview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a review with a valid rating and comment", async () => {
    dbMock.review.create.mockResolvedValue({ id: "review1" });

    await createReview("appt1", 4, "Helped a lot.");

    expect(dbMock.review.create).toHaveBeenCalledWith({
      data: { appointmentId: "appt1", rating: 4, comment: "Helped a lot." },
    });
  });

  it("allows a null comment", async () => {
    dbMock.review.create.mockResolvedValue({ id: "review1" });

    await createReview("appt1", 5, null);

    expect(dbMock.review.create).toHaveBeenCalledWith({
      data: { appointmentId: "appt1", rating: 5, comment: null },
    });
  });

  it.each([0, 6, 3.5, -1])(
    "rejects an out-of-range or non-integer rating (%s)",
    (rating) => {
      expect(() => createReview("appt1", rating, null)).toThrow(
        InvalidRatingError,
      );
      expect(dbMock.review.create).not.toHaveBeenCalled();
    },
  );
});

describe("getTherapyRatingSummary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("averages ratings for a therapy", async () => {
    dbMock.review.findMany.mockResolvedValue([
      { rating: 4 },
      { rating: 5 },
      { rating: 3 },
    ]);

    const summary = await getTherapyRatingSummary("therapy1");

    expect(summary).toEqual({ average: 4, count: 3 });
    expect(dbMock.review.findMany).toHaveBeenCalledWith({
      where: { appointment: { therapyId: "therapy1" } },
      select: { rating: true },
    });
  });

  it("returns a null average and zero count with no reviews", async () => {
    dbMock.review.findMany.mockResolvedValue([]);

    const summary = await getTherapyRatingSummary("therapy1");

    expect(summary).toEqual({ average: null, count: 0 });
  });
});
