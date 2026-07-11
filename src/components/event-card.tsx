import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/lib/types";
import { StatusTag } from "@/components/ui/pill";

function formatDate(date: string) {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear().toString().slice(2)}`;
}

export function EventCard({
  event,
  chefName,
}: {
  event: Event;
  chefName?: string;
}) {
  return (
    <Link href={`/events/${event.slug}`} className="group block">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-divider">
        <Image
          src={event.image}
          alt={event.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <StatusTag status={event.status} />
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-base font-medium">{event.name}</h3>
        {chefName && <p className="mt-0.5 text-sm text-accent">{chefName}</p>}
        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.15em] text-ink/45">
          {formatDate(event.date)} · {event.time} · {event.suburb}
        </p>
      </div>
      <p className="mt-2 text-right text-2xl font-medium tracking-tight">
        {event.price === "Free" ? (
          "Free"
        ) : (
          <>
            ${event.price}
            <span className="text-sm font-normal text-ink/45">/person</span>
          </>
        )}
      </p>
    </Link>
  );
}
