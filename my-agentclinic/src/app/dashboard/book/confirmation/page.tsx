import Link from "next/link";
import { db } from "@/lib/db";

export default async function BookingConfirmationPage(
  props: PageProps<"/dashboard/book/confirmation">,
) {
  const searchParams = await props.searchParams;
  const id = typeof searchParams.id === "string" ? searchParams.id : undefined;

  const appointment = id
    ? await db.appointment.findUnique({
        where: { id },
        include: { agent: true, ailment: true, therapy: true },
      })
    : null;

  if (!appointment) {
    return (
      <section>
        <h1>Booking not found</h1>
        <p>We couldn&rsquo;t find that appointment.</p>
        <Link href="/dashboard/book" role="button">
          Book an appointment
        </Link>
      </section>
    );
  }

  return (
    <section>
      <hgroup>
        <h1>You&rsquo;re booked in</h1>
        <p>
          {appointment.agent.name} is scheduled for{" "}
          {appointment.scheduledFor.toLocaleString()}.
        </p>
      </hgroup>
      <article>
        <p>
          <strong>Ailment:</strong> {appointment.ailment.name}
        </p>
        <p>
          <strong>Therapy:</strong> {appointment.therapy.name}
        </p>
      </article>
      <Link href="/dashboard/bookings" role="button" className="secondary">
        View all bookings
      </Link>
    </section>
  );
}
