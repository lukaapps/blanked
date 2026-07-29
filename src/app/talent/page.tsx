import Image from "next/image";
import Link from "next/link";
import { ChefCard } from "@/components/chef-card";
import { getChefs } from "@/lib/data";

export const metadata = {
  title: "Talent | Blanked",
  description:
    "The people behind Melbourne's pop-ups. Meet the hospitality talent behind Blanked.",
};

export default async function ChefsPage() {
  const chefs = await getChefs();
  const featured = chefs.filter((c) => c.featured);

  return (
    <>
      <div className="flex min-h-screen flex-col-reverse lg:flex-row">
        <div className="relative min-h-[50vh] w-full flex-1 lg:min-h-0 lg:w-1/2">
          <Image
            src="/images/space-brick-loft.jpg?v=3"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-center gap-6 px-1.5 py-16 lg:w-1/2 lg:py-0">
          <h1 className="text-6xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-[100px]">
            Talent
          </h1>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
            The people behind Melbourne&rsquo;s pop-ups
          </p>

          <div>
            <p className="text-base leading-relaxed text-ink/60">
              Blanked works with an ever-growing community of hospitality
              talent, food brands, and supper club hosts who&rsquo;d rather
              cook than chase landlords. Some are testing a concept for the
              first time. Others are running residencies. And the rest are
              somewhere in between.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink/60">
              Pop-ups matter because they allow good food to move faster than a
              lease ever could. No five-year commitment, no fit-out debt —
              just a kitchen, a room, and a night to prove the idea works.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink/60">
              Everyone on Blanked is vetted before they can book. Landlords
              get to see exactly who they&rsquo;re letting into their space,
              and what they&rsquo;ve done before.
            </p>
            <Link
              href="#directory"
              className="mt-8 inline-block w-fit bg-[#442220] px-10 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
            >
              Meet All Our Talent
            </Link>
          </div>
        </div>
      </div>

      <div className="pt-24">
        <div className="no-scrollbar -mx-6 flex gap-1 overflow-x-auto px-6 sm:gap-1.5">
          {featured.map((chef) => (
            <div key={chef.slug} className="shrink-0">
              <ChefCard chef={chef} />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="mt-16 flex flex-col items-center gap-6 border-t border-divider pt-16 text-center">
          <h2 className="text-2xl font-medium tracking-tight sm:text-4xl">
            Enquire about profiles and availability of Melbourne&rsquo;s
            best food talents
          </h2>
          <Link
            href="/contact#contact-form"
            className="bg-[#442220] px-10 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
          >
            Get in touch
          </Link>
        </div>
      </div>

      <div id="directory" className="mt-24 bg-[#442220] py-10 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-left text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">
            Collaborators
          </h2>
          <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 justify-items-center gap-x-8 gap-y-4 sm:grid-cols-3">
            {chefs.map((chef) => (
              <Link
                key={chef.slug}
                href="/events/coming-soon"
                className="text-sm font-medium uppercase tracking-tight text-white/50 transition-colors hover:text-white"
              >
                {chef.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
