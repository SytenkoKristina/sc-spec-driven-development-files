import Link from "next/link";
import { getAppointmentById } from "@/lib/appointments";
import { getStringParam } from "@/lib/search-params";

export default async function BookingConfirmationPage(
  props: PageProps<"/dashboard/book/confirmation">,
) {
  const searchParams = await props.searchParams;
  const id = getStringParam(searchParams, "id");

  const appointment = id ? await getAppointmentById(id) : null;

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
