import Link from "next/link";
import { getSession } from "@/lib/session";
import { signOut } from "./actions";

export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const session = await getSession();

  return (
    <>
      <nav className="container">
        <ul>
          <li>
            <strong>
              <Link href="/dashboard">AgentClinic Dashboard</Link>
            </strong>
          </li>
        </ul>
        <ul>
          {session?.role === "AGENT" && (
            <li>
              <Link href="/dashboard/book">Book</Link>
            </li>
          )}
          {session?.role === "STAFF" && (
            <li>
              <Link href="/dashboard/bookings">Bookings</Link>
            </li>
          )}
          {session && (
            <li>
              <form action={signOut}>
                <button type="submit" className="secondary">
                  Sign out
                </button>
              </form>
            </li>
          )}
        </ul>
      </nav>
      <main className="container">{children}</main>
    </>
  );
}
