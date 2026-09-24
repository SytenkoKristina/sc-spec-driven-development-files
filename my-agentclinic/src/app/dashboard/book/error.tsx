"use client";

import { useEffect } from "react";

type BookErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function BookError({ error, reset }: BookErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section>
      <hgroup>
        <h1>Something went wrong</h1>
        <p>{error.message || "We couldn't complete that booking."}</p>
      </hgroup>
      <button type="button" onClick={() => reset()}>
        Try again
      </button>
    </section>
  );
}
