import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getChef, getEvent, getEvents } from "@/lib/data";
import { StatusTag } from "@/components/ui/pill";
import { Button } from "@/components/ui/button";
import { EventDetailAccordion } from "@/components/event-detail-accordion";
import { SaveEventButton } from "@/components/save-event-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);
  return {
    title: event ? `${event.name} | Blanked` : "Event Not Found | Blanked",
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const [chef, allEvents] = await Promise.all([
    event.chefSlug ? getChef(event.chefSlug) : null,
    getEvents(),
  ]);

  const otherEvents = allEvents.filter(
    (e) => e.chefSlug === event.chefSlug && e.slug !== event.slug
  );

  return (
    <div className="lg:flex lg:h-screen">
      <div className="relative lg:h-full lg:w-1/2 lg:overflow-y-auto">
        <Link
          href="/events"
          aria-label="Back to all events"
          className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center bg-white/90 text-ink transition-colors hover:bg-white"
        >
          ←
        </Link>
        <div className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto lg:flex-col lg:gap-px lg:overflow-x-visible lg:overflow-y-auto lg:snap-none">
          {event.images.map((src, i) => (
            <div
              key={src}
              className="relative aspect-square w-full shrink-0 snap-center overflow-hidden bg-divider"
            >
              <Image
                src={src}
                alt={i === 0 ? event.name : ""}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-12 sm:px-10 lg:h-full lg:w-1/2 lg:overflow-y-auto lg:px-8 lg:py-16">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-4xl font-medium tracking-tight sm:text-4xl">
            {event.name}
          </h1>
          <StatusTag status={event.status} />
        </div>
        <p className="mt-3 text-sm text-ink/50">{event.suburb}, Melbourne</p>

        <div className="mt-4">
          <SaveEventButton eventId={event.id} />
        </div>

        <div className="mt-8">
          <p className="text-3xl font-light tracking-tight">
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
        </div>

        <div className="mt-6">
          <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="secondary"
              className="w-full !bg-[#442220] py-4 hover:!bg-[#442220]/90"
            >
              Get Tickets
            </Button>
          </a>
          <p className="mt-3 text-center text-xs text-ink/40">
            Ticketing handled externally at launch.
          </p>
        </div>

        <EventDetailAccordion
          event={event}
          chef={chef}
          otherEvents={otherEvents}
        />
      </div>
    </div>
  );
}
