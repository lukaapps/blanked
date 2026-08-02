import Image from "next/image";
import { notFound } from "next/navigation";
import { getSpace } from "@/lib/data";
import { BackButton } from "@/components/back-button";
import { RequestSpace } from "@/components/request-space";
import { SaveSpaceButton } from "@/components/save-space-button";
import { SpaceDetailAccordion } from "@/components/space-detail-accordion";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const space = await getSpace(slug);
  return {
    title: space ? `${space.name} | Blanked` : "Space Not Found | Blanked",
  };
}

export default async function SpaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const space = await getSpace(slug);
  if (!space) notFound();

  return (
    <div className="lg:flex lg:h-screen">
      <div className="relative lg:h-full lg:w-1/2 lg:overflow-y-auto">
        <BackButton
          fallbackHref="/browse-spaces"
          ariaLabel="Back to all spaces"
          className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center bg-white/90 text-ink transition-colors hover:bg-white"
        />
        <div className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto lg:flex-col lg:gap-px lg:overflow-x-visible lg:overflow-y-auto lg:snap-none">
          {space.images.map((src, i) => (
            <div
              key={src}
              className="relative aspect-square w-full shrink-0 snap-center overflow-hidden bg-divider"
            >
              <Image
                src={src}
                alt={i === 0 ? space.name : ""}
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
        <h1 className="text-4xl font-medium tracking-tight sm:text-4xl">
          {space.name}
        </h1>
        <p className="mt-3 text-sm text-ink/50">{space.suburb}, Melbourne</p>

        <div className="mt-8">
          <p className="text-3xl font-light tracking-tight">
            ${space.dailyRate.toLocaleString()}
            <span className="text-base font-normal text-ink/45"> /day</span>
          </p>
          {(space.weeklyRate || space.monthlyRate) && (
            <p className="mt-1 text-sm text-ink/50">
              {space.weeklyRate &&
                `$${space.weeklyRate.toLocaleString()} /week`}
              {space.weeklyRate && space.monthlyRate && " · "}
              {space.monthlyRate &&
                `$${space.monthlyRate.toLocaleString()} /month`}
            </p>
          )}
        </div>

        <div className="mt-4">
          <SaveSpaceButton spaceId={space.id} />
        </div>

        <div className="mt-6">
          <RequestSpace space={space} />
        </div>

        <SpaceDetailAccordion space={space} />
      </div>
    </div>
  );
}
