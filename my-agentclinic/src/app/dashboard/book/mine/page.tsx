import Link from "next/link";
import ConfirmationBanner from "@/components/forms/ConfirmationBanner";
import SubmitButton from "@/components/forms/SubmitButton";
import { listUpcomingAppointmentsForAgent } from "@/lib/appointments";
import { getStringParam } from "@/lib/search-params";
import { requireAgentSession } from "@/lib/session";
import { cancelAppointment, rescheduleAppointment } from "../actions";

export const dynamic = "force-dynamic";

const NOTICE_MESSAGES: Record<string, string> = {
  cancelled: "Your appointment was cancelled.",
  rescheduled: "Your appointment was rescheduled.",
};

export default async function MyBookingsPage(
  props: PageProps<"/dashboard/book/mine">,
) {
  const { agent } = await requireAgentSession();
  const searchParams = await props.searchParams;
  const notice = getStringParam(searchParams, "notice");
  const appointments = await listUpcomingAppointmentsForAgent(agent.id);

  return (
    <section>
      <hgroup>
        <h1>My bookings</h1>
        <p>Your upcoming appointments, {agent.name}.</p>
      </hgroup>
      {notice && NOTICE_MESSAGES[notice] && (
        <ConfirmationBanner message={NOTICE_MESSAGES[notice]} />
      )}
      <p>
        <Link href="/dashboard/book" role="button">
          Book another appointment
        </Link>
      </p>
      {appointments.length === 0 ? (
        <p>You have no upcoming appointments.</p>
      ) : (
        appointments.map((appointment) => (
          <article key={appointment.id}>
            <h2>
              <Link href={`/dashboard/ailments/${appointment.ailmentId}`}>
                {appointment.ailment.name}
              </Link>
            </h2>
            <p>
              <strong>Therapy:</strong>{" "}
              <Link href={`/dashboard/therapies/${appointment.therapyId}`}>
                {appointment.therapy.name}
              </Link>
            </p>
            <p>{appointment.scheduledFor.toLocaleString()}</p>
            <form action={rescheduleAppointment}>
              <input
                type="hidden"
                name="appointmentId"
                value={appointment.id}
              />
              <label htmlFor={`reschedule-${appointment.id}`}>New time</label>
              <input
                type="datetime-local"
                id={`reschedule-${appointment.id}`}
                name="scheduledFor"
                required
              />
              <SubmitButton pendingLabel="Rescheduling…">
                Reschedule
              </SubmitButton>
            </form>
            <form action={cancelAppointment}>
              <input
                type="hidden"
                name="appointmentId"
                value={appointment.id}
              />
              <SubmitButton pendingLabel="Cancelling…" className="secondary">
                Cancel appointment
              </SubmitButton>
            </form>
          </article>
        ))
      )}
    </section>
  );
}
