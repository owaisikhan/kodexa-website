import Button from "@/app/_components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center pt-[72px]">
      <div className="container-x">
        <p className="kicker border-t border-[var(--color-ink)] pt-3">
          <span className="text-[var(--color-red)]">404</span> / Not found
        </p>
        <h1 className="mt-10 text-[clamp(3rem,9vw,8rem)] leading-[0.92]">
          This page <span className="em">does not exist.</span>
        </h1>
        <p className="mt-6 max-w-md text-lg text-[var(--color-muted)]">
          The link may be old, or we may have moved something.
        </p>
        <div className="mt-10">
          <Button href="/" size="lg">Back to the home page</Button>
        </div>
      </div>
    </section>
  );
}
