import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSpace } from "@/lib/data";
import { RequestSpace } from "@/components/request-space";
import { averageRating, RatingBadge, Stars } from "@/components/rating";

const statIcon = {
  stroke: "#CA0000",
  strokeWidth: 1.5,
  fill: "none",
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
};

export default async function SpaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const space = await getSpace(slug);
  if (!space) notFound();

  const stats = [
    {
      label: "space type",
      value: space.type,
      icon: (
        <svg {...statIcon}>
          <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" />
        </svg>
      ),
    },
    {
      label: "min. days",
      value: space.minBookingDuration,
      icon: (
        <svg {...statIcon}>
          <rect x="3" y="5" width="18" height="16" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      ),
    },
    {
      label: "max guests",
      value: String(space.capacity),
      icon: (
        <svg {...statIcon}>
          <circle cx="9" cy="8" r="3.5" />
          <path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5M16 5a3.5 3.5 0 010 7M18 15c2 .8 3.5 2.4 3.5 5" />
        </svg>
      ),
    },
    {
      label: "sq ft",
      value: space.sqft.toLocaleString(),
      icon: (
        <svg {...statIcon}>
          <path d="M4 20L20 4M4 20v-5m0 5h5M20 4v5m0-5h-5" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-20">
      <Link
        href="/browse-spaces"
        className="text-sm text-ink/50 transition-colors hover:text-accent"
      >
        ← Back to all spaces
      </Link>

      <div className="relative mt-6 aspect-[21/10] w-full overflow-hidden bg-divider">
        <Image
          src={space.images[0]}
          alt={space.name}
          fill
          priority
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="object-cover"
        />
      </div>

      {space.images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {space.images.slice(1).map((src) => (
            <div key={src} className="relative h-20 w-28 overflow-hidden bg-divider">
              <Image src={src} alt="" fill sizes="112px" className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_340px]">
        <div>
          <h1 className="text-3xl font-medium tracking-tight sm:text-5xl">
            {space.name}
          </h1>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-ink/50">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 21s-6-5.3-6-10a6 6 0 1112 0c0 4.7-6 10-6 10z" />
              <circle cx="12" cy="11" r="2" />
            </svg>
            {space.suburb}, Melbourne
            {space.reviews.length > 0 && (
              <>
                <span className="text-ink/20">|</span>
                <RatingBadge reviews={space.reviews} />
              </>
            )}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 bg-white px-3 py-6 text-center"
              >
                {stat.icon}
                <span className="text-sm font-semibold leading-tight">
                  {stat.value}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-ink/40">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <h2 className="mt-12 text-lg font-semibold">About this space</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/60">
            {space.description}
          </p>

          <h2 className="mt-10 text-lg font-semibold">What can you do here</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/60">
            {space.whatCanYouDo}
          </p>

          <h2 className="mt-10 text-lg font-semibold">Amenities</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {[...space.amenities, ...space.kitchenFacilities, ...space.equipmentIncluded]
              .filter((item, i, arr) => item !== "None" && arr.indexOf(item) === i)
              .map((item) => (
                <span
                  key={item}
                  className="bg-white px-4 py-2 text-sm text-ink/70"
                >
                  {item}
                </span>
              ))}
          </div>

          <h2 className="mt-10 text-lg font-semibold">Space rules</h2>
          <ul className="mt-3 space-y-1.5 text-sm text-ink/60">
            {space.spaceRules.map((rule) => (
              <li key={rule} className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 bg-accent" />
                {rule}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-lg font-semibold">Reviews</h2>
            {space.reviews.length > 0 && (
              <p className="flex items-center gap-2 text-sm text-ink/50">
                <Stars value={averageRating(space.reviews)} />
                {averageRating(space.reviews).toFixed(1)} ·{" "}
                {space.reviews.length} review
                {space.reviews.length === 1 ? "" : "s"}
              </p>
            )}
          </div>
          {space.reviews.length === 0 ? (
            <p className="mt-3 text-sm text-ink/50">
              No reviews yet — this space is new to Blanked.
            </p>
          ) : (
            <div className="mt-4 flex flex-col gap-1">
              {space.reviews.map((review) => (
                <div key={review.author + review.date} className="bg-white p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Stars value={review.rating} />
                    <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-ink/35">
                      {review.date}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink/60">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <p className="mt-3 text-sm font-medium">
                    {review.author}
                    <span className="ml-2 text-[10px] font-medium uppercase tracking-[0.15em] text-ink/40">
                      {review.authorRole}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}

          <h2 className="mt-10 text-lg font-semibold">Location</h2>
          <div className="mt-4 flex h-64 items-center justify-center bg-white">
            <div className="flex flex-col items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-accent" />
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink/40">
                {space.suburb}, Melbourne
              </span>
            </div>
          </div>
          <p className="mt-2 text-xs text-ink/40">
            Approximate location shown. Exact address shared upon booking.
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <div className="bg-white p-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
              From
            </p>
            <p className="mt-1 text-4xl font-medium tracking-tight">
              ${space.dailyRate.toLocaleString()}
              <span className="text-base font-normal text-ink/45"> /day</span>
            </p>
            {(space.weeklyRate || space.monthlyRate) && (
              <p className="mt-2 text-sm text-ink/50">
                {space.weeklyRate &&
                  `$${space.weeklyRate.toLocaleString()} /week`}
                {space.weeklyRate && space.monthlyRate && " · "}
                {space.monthlyRate &&
                  `$${space.monthlyRate.toLocaleString()} /month`}
              </p>
            )}
          </div>

          <div className="bg-white p-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
              Availability
            </p>
            <p className="mt-2 text-sm text-ink/70">
              Minimum booking: {space.minBookingDuration}
            </p>
            <div className="mt-6">
              <RequestSpace space={space} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
