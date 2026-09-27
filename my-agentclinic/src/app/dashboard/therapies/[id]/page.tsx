import { db } from "@/lib/db";
import { requireAnySession } from "@/lib/session";

export default async function TherapyDetailPage(
  props: PageProps<"/dashboard/therapies/[id]">,
) {
  await requireAnySession();
  const { id } = await props.params;

  const therapy = await db.therapy.findUnique({
    where: { id },
    include: { ailment: true },
  });

  if (!therapy) {
    return (
      <section>
        <h1>Therapy not found</h1>
        <p>We couldn&rsquo;t find that therapy.</p>
      </section>
    );
  }

  return (
    <article>
      <hgroup>
        <h1>{therapy.name}</h1>
        <p>{therapy.description}</p>
      </hgroup>
      <p>{therapy.longDescription}</p>
      {therapy.ailment && (
        <p>
          <strong>Matched ailment:</strong> {therapy.ailment.name}
        </p>
      )}
    </article>
  );
}
