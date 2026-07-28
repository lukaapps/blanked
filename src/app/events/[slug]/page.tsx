import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getChef, getEvent, getSpace } from "@/lib/data";
import { StatusTag } from "@/components/ui/pill";
import { Button } from "@/components/ui/button";

function formatDate(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const [chef, space] = await Promise.all([
    event.chefSlug ? getChef(event.chefSlug) : null,
    event.spaceSlug ? getSpace(event.spaceSlug) : null,
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-20">
      <Link
        href="/events"
        className="text-sm text-ink/50 transition-colors hover:text-accent"
      >
        ← Back to all events
      </Link>

      <div className="relative mt-6 aspect-[21/10] w-full overflow-hidden bg-divider">
        <Image
          src={event.image}
          alt={event.name}
          fill
          priority
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="object-cover"
        />
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-3xl font-medium tracking-tight sm:text-5xl">
              {event.name}
            </h1>
            <StatusTag status={event.status} />
          </div>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
            {formatDate(event.date)} · {event.time} · {event.suburb}
          </p>

          <h2 className="mt-10 text-lg font-semibold">About this event</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/60">
            {event.description}
          </p>

          {chef && (
            <>
              <h2 className="mt-10 text-lg font-semibold">The talent</h2>
              <Link
                href={`/talent/${chef.slug}`}
                className="mt-4 flex items-center gap-4 bg-white p-4 transition-colors hover:text-accent"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-divider">
                  <Image
                    src={chef.portrait}
                    alt={chef.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{chef.name}</p>
                  <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink/45">
                    {chef.role}
                  </p>
                </div>
              </Link>
            </>
          )}

          {space && (
            <>
              <h2 className="mt-10 text-lg font-semibold">The space</h2>
              <Link
                href={`/browse-spaces/${space.slug}`}
                className="mt-4 flex items-center gap-4 bg-white p-4 transition-colors hover:text-accent"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-divider">
                  <Image
                    src={space.images[0]}
                    alt={space.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{space.name}</p>
                  <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink/45">
                    {space.suburb}, Melbourne
                  </p>
                </div>
              </Link>
            </>
          )}
        </div>

        <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <div className="bg-white p-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
              Tickets
            </p>
            <p className="mt-1 text-4xl font-medium tracking-tight">
              {event.price === "Free" ? (
                "Free"
              ) : (
                <>
                  ${event.price}
                  <span className="text-base font-normal text-ink/45">
                    {" "}
                    /person
                  </span>
                </>
              )}
            </p>
            <a
              href={event.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="secondary" className="mt-6 w-full py-4">
                Get Tickets
              </Button>
            </a>
            <p className="mt-3 text-center text-xs text-ink/40">
              Ticketing handled externally at launch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
