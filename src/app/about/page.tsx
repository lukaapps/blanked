import Image from "next/image";
import { heroImages } from "@/lib/mock-data";
import { Stops } from "@/components/brand-stop";

export const metadata = {
  title: "About | Blanked",
  description:
    "Blanked is a marketplace for hospitality space in Melbourne — pop-ups, residencies, and long term.",
};

const label =
  "text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40";
const statement =
  "font-bold tracking-tight leading-[1.1] text-3xl sm:text-5xl lg:text-6xl";
const bodyText = "text-lg font-light leading-relaxed text-ink/70 lg:text-xl";

export default function AboutPage() {
  return (
    <div className="pb-24">
      {/* Opening statement, full width */}
      <section className="px-[9px] pt-12 lg:pt-20">
        <p className={label}>About</p>
        <h1 className={`mt-6 max-w-6xl ${statement}`}>
          <Stops>Blanked is a marketplace for hospitality space.</Stops>
        </h1>
      </section>

      {/* The one photo. Left column on desktop, scrolls past while the copy pins */}
      <section className="mt-16 grid gap-y-10 px-[9px] lg:mt-24 lg:grid-cols-2 lg:gap-x-[9px]">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-divider lg:aspect-[7/10]">
          <Image
            src={heroImages[1]}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-32 lg:self-start lg:pl-10">
          <p className={label}>How it works</p>
          <p className={bodyText}>
            Create a profile, browse available spaces by location, type,
            price, and submit a booking request in minutes. Once confirmed,
            Blanked handles the agreement and payment. If you&rsquo;re a
            venue, list your space in under ten minutes and start receiving
            booking requests from vetted hospitality talent. If you&rsquo;re a
            customer, find what&rsquo;s on, pick your date, and follow the
            links to book your spot — all on Blanked.
          </p>

          <div className="flex flex-col gap-8 pt-4">
            <div>
              <p className={label}>Contact</p>
              <a
                href="mailto:Jamie@blanked.melbourne"
                className="mt-3 block text-xl font-bold tracking-tight transition-colors hover:text-accent sm:text-2xl"
              >
                Jamie@blanked.melbourne
              </a>
            </div>
            <div>
              <p className={label}>Socials</p>
              <a
                href="https://www.instagram.com/by.blanked/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block text-xl font-bold tracking-tight transition-colors hover:text-accent sm:text-2xl"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Statement after the pinned block */}
      <section className="mt-40 px-[9px]">
        <p className={label}>Why now</p>
        <p className={`mt-6 max-w-6xl ${statement}`}>
          <Stops>Every pop-up in this city has been built on Instagram DMs and word of mouth.</Stops>
        </p>
      </section>

      {/* Closing paragraph, offset to the right on desktop */}
      <section className="mt-40 px-[9px] lg:flex lg:justify-end">
        <div className="flex flex-col gap-6 lg:w-1/2 lg:pl-10">
          <p className={label}>What&rsquo;s next</p>
          <p className={bodyText}>
            Blanked is what comes next. A platform that gives hospitality
            talent the tools to trade independently, gives venues a simple way
            to activate their space, and gives Melbourne somewhere to find out
            what&rsquo;s on and get a seat at it.
          </p>
        </div>
      </section>

      {/* Closing tagline */}
      <section className="mt-40 px-[9px]">
        <p className={`max-w-6xl ${statement}`}>
          <Stops>The city has space. Let’s use it.</Stops>
        </p>
      </section>

    </div>
  );
}
