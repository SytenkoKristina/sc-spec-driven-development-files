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
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.agent.name}</td>
                <td>{appointment.ailment.name}</td>
                <td>{appointment.therapy.name}</td>
                <td>{appointment.scheduledFor.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
