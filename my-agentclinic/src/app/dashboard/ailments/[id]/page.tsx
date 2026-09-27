import { db } from "@/lib/db";
import { requireAnySession } from "@/lib/session";

export default async function AilmentDetailPage(
  props: PageProps<"/dashboard/ailments/[id]">,
) {
  await requireAnySession();
  const { id } = await props.params;

  const ailment = await db.ailment.findUnique({
    where: { id },
    include: { therapy: true },
  });

  if (!ailment) {
    return (
      <section>
        <h1>Ailment not found</h1>
        <p>We couldn&rsquo;t find that ailment.</p>
      </section>
    );
  }

  return (
    <article>
      <hgroup>
        <h1>{ailment.name}</h1>
        <p>{ailment.description}</p>
      </hgroup>
      <p>{ailment.longDescription}</p>
      <p>
        <strong>Matched therapy:</strong> {ailment.therapy.name}
      </p>
    </article>
  );
}
