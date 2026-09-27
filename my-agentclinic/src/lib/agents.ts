import { db } from "@/lib/db";

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

// `upsert` isn't atomic against another concurrent request creating the same
// new agent name between its internal read and write — that collision
// surfaces as a unique-constraint error on `Agent.name` rather than the
// upsert quietly succeeding. Treat it as "someone else just created this
// agent" and fetch the row they created instead of failing the caller.
export async function upsertAgentByName(name: string) {
  try {
    return await db.agent.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return db.agent.findUniqueOrThrow({ where: { name } });
    }
    throw error;
  }
}
