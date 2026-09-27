import Link from "next/link";
import { db } from "@/lib/db";
import { getStringParam } from "@/lib/search-params";
import { requireAnySession } from "@/lib/session";

export default async function SearchPage(
  props: PageProps<"/dashboard/search">,
) {
  await requireAnySession();
  const searchParams = await props.searchParams;
  const q = getStringParam(searchParams, "q")?.trim() ?? "";

  const [ailments, therapies] = q
    ? await Promise.all([
        db.ailment.findMany({
          where: {
            OR: [{ name: { contains: q } }, { description: { contains: q } }],
          },
          orderBy: { name: "asc" },
        }),
        db.therapy.findMany({
          where: {
            OR: [{ name: { contains: q } }, { description: { contains: q } }],
          },
          orderBy: { name: "asc" },
        }),
      ])
    : [[], []];

  const hasResults = ailments.length > 0 || therapies.length > 0;

  return (
    <section>
      <hgroup>
        <h1>Search</h1>
        <p>{q ? `Results for “${q}”` : "Enter a search term above."}</p>
      </hgroup>
      {q && !hasResults && <p>No matches found.</p>}
      {ailments.length > 0 && (
        <>
          <h2>Ailments</h2>
          <ul>
            {ailments.map((ailment) => (
              <li key={ailment.id}>
                <Link href={`/dashboard/ailments/${ailment.id}`}>
                  {ailment.name}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
      {therapies.length > 0 && (
        <>
          <h2>Therapies</h2>
          <ul>
            {therapies.map((therapy) => (
              <li key={therapy.id}>
                <Link href={`/dashboard/therapies/${therapy.id}`}>
                  {therapy.name}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
