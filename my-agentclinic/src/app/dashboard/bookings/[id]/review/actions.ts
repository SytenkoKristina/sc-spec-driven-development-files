"use server";

import { redirect } from "next/navigation";
import { createReview } from "@/lib/reviews";

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

export async function submitReview(formData: FormData) {
  const appointmentId = String(formData.get("appointmentId") ?? "");
  const ratingRaw = String(formData.get("rating") ?? "");
  const comment = String(formData.get("comment") ?? "").trim();

  if (!appointmentId || !ratingRaw) {
    throw new Error("Missing required review fields.");
  }

  try {
    await createReview(appointmentId, Number(ratingRaw), comment || null);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new Error("This appointment already has a review.");
    }
    throw error;
  }

  redirect("/dashboard/bookings");
}
