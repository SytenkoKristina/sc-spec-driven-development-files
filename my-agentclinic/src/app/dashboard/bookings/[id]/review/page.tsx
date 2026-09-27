import Link from "next/link";
import SubmitButton from "@/components/forms/SubmitButton";
import { getAppointmentById } from "@/lib/appointments";
import { submitReview } from "./actions";

const RATING_OPTIONS = [
  { value: 1, label: "1 - Poor" },
  { value: 2, label: "2 - Fair" },
  { value: 3, label: "3 - Good" },
  { value: 4, label: "4 - Great" },
  { value: 5, label: "5 - Excellent" },
];

export default async function ReviewPage(
  props: PageProps<"/dashboard/bookings/[id]/review">,
) {
  const { id } = await props.params;
  const appointment = await getAppointmentById(id);

  if (!appointment) {
    return (
      <section>
        <h1>Appointment not found</h1>
        <p>We couldn&rsquo;t find that appointment.</p>
        <Link href="/dashboard/bookings" role="button">
          View all bookings
        </Link>
      </section>
    );
  }

  if (appointment.review) {
    return (
      <section>
        <hgroup>
          <h1>Your review</h1>
          <p>
            {appointment.agent.name}&rsquo;s review of{" "}
            {appointment.therapy.name}.
          </p>
        </hgroup>
        <article>
          <p>
            <strong>Rating:</strong> {appointment.review.rating}/5
          </p>
          {appointment.review.comment && <p>{appointment.review.comment}</p>}
        </article>
        <Link href="/dashboard/bookings" role="button" className="secondary">
          Back to bookings
        </Link>
      </section>
    );
  }

  return (
    <section>
      <hgroup>
        <h1>Leave a review</h1>
        <p>
          How was {appointment.therapy.name} for {appointment.agent.name}?
        </p>
      </hgroup>
      <form action={submitReview}>
        <input type="hidden" name="appointmentId" value={appointment.id} />
        <label htmlFor="rating">Rating</label>
        <select id="rating" name="rating" required defaultValue="">
          <option value="" disabled>
            Select a rating
          </option>
          {RATING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label htmlFor="comment">Comment (optional)</label>
        <textarea id="comment" name="comment" />
        <SubmitButton pendingLabel="Submitting…">Submit review</SubmitButton>
      </form>
    </section>
  );
}
