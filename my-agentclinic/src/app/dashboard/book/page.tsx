import { db } from "@/lib/db";
import { createBooking } from "./actions";

export default async function BookPage(props: PageProps<"/dashboard/book">) {
  const searchParams = await props.searchParams;
  const name = typeof searchParams.name === "string" ? searchParams.name : "";
  const ailmentId =
    typeof searchParams.ailmentId === "string" ? searchParams.ailmentId : "";

  if (name && ailmentId) {
    const ailment = await db.ailment.findUnique({
      where: { id: ailmentId },
      include: { therapy: true },
    });

    if (ailment) {
      return (
        <section>
          <hgroup>
            <h1>Confirm your appointment</h1>
            <p>Hi {name}, here&rsquo;s your match.</p>
          </hgroup>
          <article>
            <h2>{ailment.name}</h2>
            <p>{ailment.description}</p>
            <p>
              <strong>Matched therapy:</strong> {ailment.therapy.name}
            </p>
            <p>{ailment.therapy.description}</p>
          </article>
          <form action={createBooking}>
            <input type="hidden" name="name" value={name} />
            <input type="hidden" name="ailmentId" value={ailment.id} />
            <label htmlFor="scheduledFor">Appointment time</label>
            <input
              type="datetime-local"
              id="scheduledFor"
              name="scheduledFor"
              required
            />
            <button type="submit">Confirm booking</button>
          </form>
        </section>
      );
    }
  }

  const ailments = await db.ailment.findMany({ orderBy: { name: "asc" } });

  return (
    <section>
      <hgroup>
        <h1>Book an appointment</h1>
        <p>Tell us who you are and what&rsquo;s bothering you.</p>
      </hgroup>
      <form action="/dashboard/book" method="GET">
        <label htmlFor="name">Your name</label>
        <input type="text" id="name" name="name" required />
        <label htmlFor="ailmentId">Ailment</label>
        <select id="ailmentId" name="ailmentId" required defaultValue="">
          <option value="" disabled>
            Select an ailment
          </option>
          {ailments.map((ailment) => (
            <option key={ailment.id} value={ailment.id}>
              {ailment.name}
            </option>
          ))}
        </select>
        <button type="submit">Continue</button>
      </form>
    </section>
  );
}
