"use client";

import { useEffect } from "react";

type ReviewErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ReviewError({ error, reset }: ReviewErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section>
      <hgroup>
        <h1>Something went wrong</h1>
        <p>{error.message || "We couldn't submit that review."}</p>
      </hgroup>
      <button type="button" onClick={() => reset()}>
        Try again
      </button>
    </section>
  );
}
