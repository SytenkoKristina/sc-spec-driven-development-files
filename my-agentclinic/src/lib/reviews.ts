import { db } from "@/lib/db";

export class InvalidRatingError extends Error {
  constructor() {
    super("Rating must be an integer between 1 and 5.");
    this.name = "InvalidRatingError";
  }
}

export function createReview(
  appointmentId: string,
  rating: number,
  comment: string | null,
) {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new InvalidRatingError();
  }

  return db.review.create({
    data: { appointmentId, rating, comment },
  });
}

export async function getTherapyRatingSummary(therapyId: string) {
  const reviews = await db.review.findMany({
    where: { appointment: { therapyId } },
    select: { rating: true },
  });

  if (reviews.length === 0) {
    return { average: null, count: 0 };
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return { average: total / reviews.length, count: reviews.length };
}
