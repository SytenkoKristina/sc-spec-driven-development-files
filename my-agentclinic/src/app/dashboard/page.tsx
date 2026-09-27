import Link from "next/link";
import { getSession } from "@/lib/session";
import { signIn } from "./actions";

export default async function DashboardHome() {
  const session = await getSession();

  if (!session) {
    return (
      <section>
        <hgroup>
          <h1>Sign in</h1>
          <p>Tell us who you are so we can show you the right view.</p>
        </hgroup>
        <form action={signIn}>
          <label htmlFor="name">Your name</label>
          <input type="text" id="name" name="name" placeholder="Required for agents" />
          <fieldset>
            <legend>I am a...</legend>
            <label htmlFor="role-agent">
              <input
                type="radio"
                id="role-agent"
                name="role"
                value="AGENT"
                defaultChecked
              />{" "}
              Agent
            </label>
            <label htmlFor="role-staff">
              <input type="radio" id="role-staff" name="role" value="STAFF" />{" "}
              Staff
            </label>
          </fieldset>
          <button type="submit">Continue</button>
        </form>
      </section>
    );
  }

  return (
    <section>
      <hgroup>
        <h1>Dashboard</h1>
        <p>
          Signed in as{" "}
          {session.role === "AGENT" ? session.agent?.name : "Staff"}.
        </p>
      </hgroup>
      <div className="grid">
        {session.role === "AGENT" ? (
          <article>
            <h2>For agents</h2>
            <p>Pick an ailment, get matched to a therapy, and book a time.</p>
            <Link href="/dashboard/book" role="button">
              Book an appointment
            </Link>
          </article>
        ) : (
          <article>
            <h2>For staff</h2>
            <p>See upcoming appointments across all agents.</p>
            <Link href="/dashboard/bookings" role="button" className="secondary">
              View bookings
            </Link>
          </article>
        )}
      </div>
    </section>
  );
}
