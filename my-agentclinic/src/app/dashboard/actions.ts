"use server";

import { redirect } from "next/navigation";
import { upsertAgentByName } from "@/lib/agents";
import { createSession, destroySession } from "@/lib/session";

export async function signIn(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "");

  if (role === "AGENT") {
    if (!name) {
      throw new Error("Name is required to sign in as an agent.");
    }
    const agent = await upsertAgentByName(name);
    await createSession("AGENT", agent.id);
    redirect("/dashboard/book");
  } else if (role === "STAFF") {
    await createSession("STAFF");
    redirect("/dashboard/bookings");
  } else {
    throw new Error("Choose a role to sign in.");
  }
}

export async function signOut() {
  await destroySession();
  redirect("/dashboard");
}
