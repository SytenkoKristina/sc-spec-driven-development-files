import ConfirmationBanner from "@/components/forms/ConfirmationBanner";
import SubmitButton from "@/components/forms/SubmitButton";
import { listUpcomingAppointments } from "@/lib/appointments";
import { getStringParam } from "@/lib/search-params";
import { requireStaffSession } from "@/lib/session";
import { cancelBookingAsStaff } from "./actions";

export const dynamic = "force-dynamic";

export default async function BookingsPage(
  props: PageProps<"/dashboard/bookings">,
) {
  const session = await requireStaffSession();
  const searchParams = await props.searchParams;
  const agentNameFilter = getStringParam(searchParams, "agent")?.trim() ?? "";
  const notice = getStringParam(searchParams, "notice");

  const appointments = await listUpcomingAppointments(
    agentNameFilter || undefined,
  );

  return (
    <section>
      <hgroup>
        <h1>Upcoming bookings</h1>
        <p>Every appointment booked so far, soonest first.</p>
      </hgroup>
      {notice === "cancelled" && (
        <ConfirmationBanner message="The appointment was cancelled." />
      )}
      <form action="/dashboard/bookings" method="GET">
        <label htmlFor="agent">Filter by agent name</label>
        <input
          type="search"
          id="agent"
          name="agent"
          defaultValue={agentNameFilter}
        />
        <button type="submit">Filter</button>
      </form>
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
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => {
              const isNew = appointment.createdAt > session.createdAt;
              return (
                <tr key={appointment.id}>
                  <td>
                    {appointment.agent.name}
                    {isNew && <mark> New</mark>}
                  </td>
                  <td>{appointment.ailment.name}</td>
                  <td>{appointment.therapy.name}</td>
                  <td>{appointment.scheduledFor.toLocaleString()}</td>
                  <td>
                    <form action={cancelBookingAsStaff}>
                      <input
                        type="hidden"
                        name="appointmentId"
                        value={appointment.id}
                      />
                      <SubmitButton
                        pendingLabel="Cancelling…"
                        className="secondary"
                      >
                        Cancel
                      </SubmitButton>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}
