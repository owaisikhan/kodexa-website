import Button from "@/app/_components/ui/Button";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70svh] items-center overflow-hidden pt-[72px]">
      <div className="absolute inset-0 grid-bg" aria-hidden />
      <div className="container-x relative text-center">
        <p className="kicker mb-4">404</p>
        <h1 className="text-[clamp(2.2rem,6vw,3.6rem)]">This page does not exist</h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-[var(--color-muted)]">
          The link may be old, or we may have moved something.
        </p>
        <div className="mt-9 flex justify-center">
          <Button href="/">Back to the home page</Button>
        </div>
      </div>
    </section>
  );
}
