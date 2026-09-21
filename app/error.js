"use client";

import Button from "@/app/_components/ui/Button";

export default function Error({ reset }) {
  return (
    <section className="flex min-h-[70svh] items-center pt-[72px]">
      <div className="container-x text-center">
        <h1 className="text-[clamp(2rem,5vw,3rem)]">Something went wrong</h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-[var(--color-muted)]">
          That is on us. Try again, and if it keeps happening send us a message.
        </p>
        <div className="mt-9 flex justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button href="/" variant="ghost">
            Home
          </Button>
        </div>
      </div>
    </section>
  );
}
