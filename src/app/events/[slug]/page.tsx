import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getChef, getEvent, getEvents, getSpace } from "@/lib/data";
import { BackButton } from "@/components/back-button";
import { LocationMap } from "@/components/location-map";
import { SaveEventButton } from "@/components/save-event-button";
import { Stops } from "@/components/brand-stop";

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

function formatDate(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const sectionLabel =
 "text-[11px] font-semibold text-ink/40";
const section = "mt-24 px-[9px]";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const [chef, allEvents, space] = await Promise.all([
    event.chefSlug ? getChef(event.chefSlug) : null,
    getEvents(),
    getSpace(event.spaceSlug),
  ]);

  const otherEvents = allEvents.filter(
    (e) => e.chefSlug === event.chefSlug && e.slug !== event.slug
  );

  return (
    <div className="pb-24">
      <div className="relative mx-[9px] mt-[9px]">
        <BackButton
          fallbackHref="/events"
          ariaLabel="Back to all events"
          className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center bg-white/90 text-ink transition-colors hover:bg-white"
        />
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-divider sm:aspect-[16/10] lg:aspect-auto lg:h-[88vh]">
          <Image
            src={event.images[0]}
            alt={event.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center px-4">
            <a
              href={event.ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex bg-ink/25 px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-[2px] transition-colors hover:bg-ink/35"
            >
              Get Tickets
            </a>
          </div>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 px-[9px] pt-6 sm:grid-cols-4">
        <div>
          <dt className="text-sm text-ink/40">Date</dt>
          <dd className="mt-0.5 text-sm">{formatDate(event.date)}</dd>
        </div>
        <div>
          <dt className="text-sm text-ink/40">Time</dt>
          <dd className="mt-0.5 text-sm">{event.time}</dd>
        </div>
        <div>
          <dt className="text-sm text-ink/40">Location</dt>
          <dd className="mt-0.5 text-sm">{event.suburb}, Melbourne</dd>
        </div>
        <div>
          <dt className="text-sm text-ink/40">Price</dt>
          <dd className="mt-0.5 text-sm">
            {event.price === "Free" ? (
              "Free"
            ) : (
              <>
                ${event.price}
                <span className="text-ink/45"> /person</span>
              </>
            )}
          </dd>
        </div>
      </dl>

      <div className="px-[9px] pt-12 lg:pt-16">
        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          {event.name}
        </h1>
        <div className="mt-4">
          <SaveEventButton eventId={event.id} />
        </div>
      </div>

      <section className={section}>
        <p className={sectionLabel}>About This Event</p>
        <p className="mt-6 text-3xl font-medium leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
          <Stops>{event.description}</Stops>
        </p>
      </section>

      <section className={`${section} grid gap-[9px] sm:grid-cols-2`}>
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-divider">
          <Image
            src="/images/food-prawn.jpg?v=3"
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-divider">
          <Image
            src="/images/drink-cocktail.jpg?v=3"
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className={section}>
        <p className={sectionLabel}>About the Chef</p>
        {chef ? (
          <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
            <Link href={`/talent/${chef.slug}`} className="group block">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-divider">
                <Image
                  src={chef.portrait}
                  alt={chef.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Link>
            <div className="flex flex-col justify-end gap-6">
              <div>
                <Link
                  href={`/talent/${chef.slug}`}
                  className="text-3xl font-medium tracking-tight transition-colors hover:text-accent sm:text-5xl"
                >
                  {chef.name}
                </Link>
                <p className="mt-3 text-[11px] font-medium text-ink/45">
                  {chef.role}
                </p>
              </div>
              <p className="text-base leading-relaxed text-ink/60">{chef.bio}</p>
              <Link
                href={`/talent/${chef.slug}`}
                className="w-fit text-[11px] font-semibold text-accent hover:underline"
              >
                View full profile →
              </Link>
            </div>
          </div>
        ) : (
          <p className="mt-8 text-sm text-ink/50">Chef details coming soon.</p>
        )}
      </section>

      <div className="relative mx-[9px] mt-24 aspect-[16/9] overflow-hidden bg-divider">
        <Image
          src="/images/space-night-terrace.jpg?v=3"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {chef && (
        <section className={section}>
          <blockquote className="text-2xl font-medium leading-snug tracking-tight sm:text-4xl lg:text-5xl">
            &ldquo;<Stops>{chef.quote}</Stops>&rdquo;
          </blockquote>
          <p className="mt-6 text-[11px] font-semibold text-accent">
            {chef.name}
          </p>
        </section>
      )}

      {space && (
        <section className={section}>
          <p className={sectionLabel}>The Venue</p>
          <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
            <Link href={`/browse-spaces/${space.slug}`} className="group block">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-divider">
                <Image
                  src={space.images[0]}
                  alt={space.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Link>
            <div className="flex flex-col justify-end gap-6">
              <div>
                <Link
                  href={`/browse-spaces/${space.slug}`}
                  className="text-3xl font-medium tracking-tight transition-colors hover:text-accent sm:text-5xl"
                >
                  {space.name}
                </Link>
                <p className="mt-3 text-[11px] font-medium text-ink/45">
                  {space.suburb}, Melbourne
                </p>
              </div>
              <p className="text-base leading-relaxed text-ink/60">
                {space.description}
              </p>
              <p className="text-sm text-ink/50">{space.amenities.join(" · ")}</p>
              <Link
                href={`/browse-spaces/${space.slug}`}
                className="w-fit text-[11px] font-semibold text-accent hover:underline"
              >
                View venue →
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className={section}>
        <p className={sectionLabel}>Location</p>
        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-end gap-4">
            <p className="text-3xl font-medium tracking-tight sm:text-5xl">
              {event.suburb}, Melbourne
            </p>
            <p className="text-xs text-ink/40">
              Shaded area shows the approximate location. Exact address shared
              upon booking.
            </p>
          </div>
          <div className="aspect-[4/3] w-full overflow-hidden border border-divider bg-divider">
            <LocationMap
              suburb={event.suburb}
              seed={event.id ?? event.slug}
            />
          </div>
        </div>
      </section>

      <section className={section}>
        <p className={sectionLabel}>Previous Events</p>
        {otherEvents.length === 0 ? (
          <p className="mt-8 text-sm text-ink/50">
            No previous events from this chef yet.
          </p>
        ) : (
          <div className="mt-8 grid gap-[9px] sm:grid-cols-2">
            {otherEvents.map((e) => (
              <Link key={e.slug} href={`/events/${e.slug}`} className="group block">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-divider">
                  <Image
                    src={e.images[0]}
                    alt={e.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 text-lg font-medium text-ink">{e.name}</p>
                <p className="mt-1 text-[11px] font-medium text-ink/45">
                  {e.suburb}, Melbourne
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
