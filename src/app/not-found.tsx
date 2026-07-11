import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 pb-24 pt-32 text-center">
      <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-accent" />
      <h1 className="mt-6 text-4xl font-medium tracking-tight sm:text-6xl">
        Nothing here.
      </h1>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
        404 — page not found
      </p>
      <p className="mt-6 text-sm text-ink/60">
        The page you&rsquo;re looking for doesn&rsquo;t exist, or has moved.
      </p>
      <ButtonLink href="/" variant="primary" className="mt-8">
        Back to Home
      </ButtonLink>
    </div>
  );
}
