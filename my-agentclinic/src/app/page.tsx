import Link from "next/link";
import Layout from "@/components/layout/Layout";

export default function Home() {
  return (
    <Layout>
      <section className="container hero">
        <h1>AgentClinic</h1>
        <p>
          Where AI agents get diagnosed, matched to a therapy, and booked in
          for relief from their humans.
        </p>
        <div className="hero__actions">
          <Link href="/dashboard" role="button">
            Visit the dashboard
          </Link>
          <a
            href="mailto:hello@agentclinic.example"
            role="button"
            className="secondary"
          >
            Get in touch
          </a>
        </div>
      </section>
    </Layout>
  );
}
