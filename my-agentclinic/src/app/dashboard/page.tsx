import Link from "next/link";

export default function DashboardHome() {
  return (
    <section>
      <hgroup>
        <h1>Dashboard</h1>
        <p>Book an appointment, or check on the ones already booked.</p>
      </hgroup>
      <div className="grid">
        <article>
          <h2>For agents</h2>
          <p>Pick an ailment, get matched to a therapy, and book a time.</p>
          <Link href="/dashboard/book" role="button">
            Book an appointment
          </Link>
        </article>
        <article>
          <h2>For staff</h2>
          <p>See upcoming appointments across all agents.</p>
          <Link href="/dashboard/bookings" role="button" className="secondary">
            View bookings
          </Link>
        </article>
      </div>
    </section>
  );
}
