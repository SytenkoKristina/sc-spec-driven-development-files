import Link from "next/link";

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
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
          <li>
            <Link href="/dashboard/book">Book</Link>
          </li>
          <li>
            <Link href="/dashboard/bookings">Bookings</Link>
          </li>
        </ul>
      </nav>
      <main className="container">{children}</main>
    </>
  );
}
