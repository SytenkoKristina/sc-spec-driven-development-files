import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const SESSION_COOKIE = "session_token";

export type SessionRole = "AGENT" | "STAFF";

export async function createSession(role: SessionRole, agentId?: string) {
  const session = await db.session.create({ data: { role, agentId } });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return session;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) {
    return null;
  }

  return db.session.findUnique({
    where: { id: token },
    include: { agent: true },
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.session.delete({ where: { id: token } }).catch(() => {
      // Already gone (e.g. a stale/forged cookie) — nothing left to clean up.
    });
  }
  cookieStore.delete(SESSION_COOKIE);
}

async function requireSession(role: SessionRole) {
  const session = await getSession();
  if (!session || session.role !== role) {
    redirect("/dashboard");
  }
  return session;
}

export async function requireAgentSession() {
  const session = await requireSession("AGENT");
  if (!session.agent) {
    // An AGENT session always has a linked Agent row (see createSession's
    // callers) — this only trips if that invariant is ever broken.
    redirect("/dashboard");
  }
  return { session, agent: session.agent };
}

export async function requireStaffSession() {
  return requireSession("STAFF");
}
