import Image from "next/image";
import Link from "next/link";
import { TalentIndex } from "@/components/talent-index";
import { Stops } from "@/components/brand-stop";
import { getChefs } from "@/lib/data";

export const metadata = {
  title: "Talent | Blanked",
  description:
    "The people behind Melbourne's pop-ups. Meet the hospitality chefs behind Blanked.",
};

const label =
 "text-[11px] font-semibold text-ink/40";
const statement =
  "font-bold tracking-tight leading-[1.1] text-3xl sm:text-5xl lg:text-6xl";
const bodyText = "text-lg font-light leading-relaxed text-ink/70 lg:text-xl";

export default async function TalentPage() {
  const chefs = await getChefs();
  const featured = chefs.filter((c) => c.featured).slice(0, 3);

  return (
    <div className="pb-24">
      {/* Opening statement */}
      <section className="px-[9px] pt-12 lg:pt-20">
        <p className={label}>Talent</p>
        <h1 className={`mt-6 max-w-6xl ${statement}`}>
          <Stops>The people behind Melbourne’s pop-ups.</Stops>
        </h1>
      </section>

      {/* Portraits scroll on the left while the copy pins on the right */}
      <section className="mt-16 grid gap-y-10 px-[9px] lg:mt-24 lg:grid-cols-2 lg:gap-x-[9px]">
        <div className="flex flex-col gap-[9px]">
          {featured.map((chef) => (
            <div
              key={chef.slug}
              className="relative aspect-[4/5] w-full overflow-hidden bg-divider"
            >
              <Image
                src={chef.portrait}
                alt={chef.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-32 lg:self-start lg:pl-10">
          <p className={label}>Who we work with</p>
          <p className={bodyText}>
            Blanked works with an ever-growing community of chefs,
            food brands, and supper club hosts who&rsquo;d rather cook than
            chase landlords. Some are testing a concept for the first time.
            Others are running residencies. And the rest are somewhere in
            between.
          </p>
          <p className={bodyText}>
            Everyone on Blanked is vetted before they can book. Landlords get
            to see exactly who they&rsquo;re letting into their space, and
            what they&rsquo;ve done before.
          </p>
        </div>
      </section>

      {/* Editorial index with a sticky preview on desktop */}
      <section className="mt-40 px-[9px]">
        <p className={label}>The community</p>
        <div className="mt-6">
          <TalentIndex chefs={chefs} />
        </div>
      </section>

      {/* Closing enquiry */}
      <section className="mt-40 flex flex-col items-start gap-8 border-t border-divider px-[9px] pt-10">
        <p className={`max-w-4xl ${statement}`}>
          <Stops>Enquire about profiles and availability of Melbourne’s best chefs.</Stops>
        </p>
        <Link
          href="/contact#contact-form"
          className="inline-flex w-fit bg-[#442220] px-10 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
        >
          Get in touch
        </Link>
      </section>
    </div>
  );
}
