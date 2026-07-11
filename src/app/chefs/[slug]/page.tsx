import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getChef, getEvents } from "@/lib/data";
import { Button } from "@/components/ui/button";

export default async function ChefDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chef = await getChef(slug);
  if (!chef) notFound();

  const allEvents = await getEvents();
  const pastEvents = allEvents.filter((e) => e.chefSlug === chef.slug);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-20">
      <Link
        href="/chefs"
        className="text-sm text-ink/50 transition-colors hover:text-accent"
      >
        ← Back to all chefs
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-divider">
          <Image
            src={chef.portrait}
            alt={chef.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-4xl font-medium tracking-tight sm:text-6xl">
            {chef.name}
          </h1>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-accent">
            {chef.role}
          </p>

          <p className="mt-8 text-base leading-relaxed text-ink/60">
            {chef.bio}
          </p>

          <p className="mt-6 border-l-2 border-accent pl-4 text-base italic text-ink/70">
            &ldquo;{chef.quote}&rdquo;
          </p>

          <div className="mt-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
              What they&rsquo;re looking for
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {chef.spaceTypePreferences.map((type) => (
                <span key={type} className="bg-white px-4 py-2 text-sm text-ink/70">
                  {type}
                </span>
              ))}
              {chef.locationPreferences.map((loc) => (
                <span key={loc} className="bg-white px-4 py-2 text-sm text-ink/45">
                  {loc}
                </span>
              ))}
            </div>
          </div>

          <a href={chef.instagram} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" className="mt-10">
              Follow This Chef
            </Button>
          </a>
        </div>
      </div>

      {pastEvents.length > 0 && (
        <div className="mt-24 border-t border-divider pt-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
            Past events
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <Link
                key={event.slug}
                href={`/events/${event.slug}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-divider">
                  <Image
                    src={event.image}
                    alt={event.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 font-medium">{event.name}</p>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.15em] text-ink/45">
                  {event.suburb}, Melbourne
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
