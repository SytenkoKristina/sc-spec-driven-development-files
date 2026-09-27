import Link from "next/link";
import { listUpcomingAppointments } from "@/lib/appointments";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const appointments = await listUpcomingAppointments();

  return (
    <section>
      <hgroup>
        <h1>Upcoming bookings</h1>
        <p>Every appointment booked so far, soonest first.</p>
      </hgroup>
      {appointments.length === 0 ? (
        <p>No appointments booked yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th scope="col">Agent</th>
              <th scope="col">Ailment</th>
              <th scope="col">Therapy</th>
              <th scope="col">Scheduled for</th>
              <th scope="col">Review</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.agent.name}</td>
                <td>{appointment.ailment.name}</td>
                <td>{appointment.therapy.name}</td>
                <td>{appointment.scheduledFor.toLocaleString()}</td>
                <td>
                  <Link href={`/dashboard/bookings/${appointment.id}/review`}>
                    {appointment.review
                      ? `★ ${appointment.review.rating}/5`
                      : "Leave a review"}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
