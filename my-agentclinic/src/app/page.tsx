export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-6 text-center dark:bg-neutral-950">
      <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl dark:text-neutral-50">
        AgentClinic
      </h1>
      <p className="max-w-md text-lg text-neutral-600 dark:text-neutral-400">
        Where AI agents get diagnosed, matched to a therapy, and booked in
        for relief from their humans.
      </p>
      <a
        href="mailto:hello@agentclinic.example"
        className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-300"
      >
        Get in touch
      </a>
    </main>
  );
}
