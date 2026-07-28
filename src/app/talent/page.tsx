import Image from "next/image";
import Link from "next/link";
import { ChefCard } from "@/components/chef-card";
import { ButtonLink } from "@/components/ui/button";
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
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-20">
      <div>
        <h1 className="text-6xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-[100px]">
          Talent
        </h1>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
          The people behind Melbourne&rsquo;s pop-ups
        </p>
      </div>

      <div className="mt-24 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-divider">
          <Image
            src="/images/space-brick-loft.jpg?v=3"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-medium tracking-tight sm:text-4xl">
            The talent behind Blanked
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ink/60">
            Blanked works with an ever-growing community of hospitality
            talent, food brands, and supper club hosts who&rsquo;d rather
            cook than chase landlords. Some are testing a concept for the
            first time. Others are running their fourth residency this year.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink/60">
            Pop-ups matter because they let good food move faster than a
            lease ever could. No five-year commitment, no fit-out debt — just
            a kitchen, a room, and a night to prove the idea works.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink/60">
            Everyone on Blanked is vetted before they can book. Landlords
            get to see exactly who they&rsquo;re letting into their space,
            and what they&rsquo;ve done before.
          </p>
          <ButtonLink href="#directory" variant="primary" className="mt-8">
            Meet All Our Talent
          </ButtonLink>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((chef) => (
          <ChefCard key={chef.slug} chef={chef} large />
        ))}
      </div>

      <div id="directory" className="mt-24 border-t border-divider pt-8">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
          Directory — All talent
        </h2>
        <div className="mt-6 flex flex-col gap-1">
          {chefs.map((chef) => (
            <Link
              key={chef.slug}
              href={`/talent/${chef.slug}`}
              className="group flex items-center justify-between bg-white px-6 py-5 transition-colors hover:text-accent"
            >
              <span className="text-lg font-medium tracking-tight sm:text-2xl">
                {chef.name}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/40 transition-colors group-hover:text-accent">
                {chef.role}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
