import Image from "next/image";
import { PageHeader, RedDot } from "@/components/page-header";
import { heroImages } from "@/lib/mock-data";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-20">
      <PageHeader
        title="About Blanked"
        caption="Melbourne — pop-ups, spaces, community"
      />

      <div className="mt-16 grid grid-cols-1 gap-14 lg:grid-cols-2">
        <div>
          <p className="text-base leading-relaxed text-ink/60 sm:text-lg">
            Blanked is a marketplace for short-term hospitality space — aka a
            pop-up. Venues list their space. Chefs and food brands find and
            book it. Customers discover what&rsquo;s on. The whole thing
            happens in one place — browsing, booking, legals, payment, and
            promotion. No back-and-forth. No middlemen. No wasted time.
          </p>
          <p className="mt-6 text-base leading-relaxed text-ink/60 sm:text-lg">
            Create a profile, browse available spaces by location, type, and
            price, and submit a booking request in minutes. Once confirmed,
            Blanked handles the agreement and payment. If you&rsquo;re a
            venue, list your space in under ten minutes and start receiving
            booking requests from vetted chefs and brands. If you&rsquo;re a
            customer, find what&rsquo;s on, pick your date, and follow the
            links to book your spot — all on Blanked.
          </p>
          <p className="mt-6 text-base leading-relaxed text-ink/60 sm:text-lg">
            We exist because the infrastructure didn&rsquo;t. Every pop-up in
            this city has been built on Instagram DMs and word of mouth.
            Blanked is what comes next — a platform that gives chefs the
            tools to trade independently, gives venues a simple way to
            activate their space, and gives Melbourne somewhere to find out
            what&rsquo;s happening and book a seat at the table.
          </p>

          <div className="mt-12 flex items-center gap-3">
            <RedDot />
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
              Get in touch
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <a
              href="mailto:hello@blanked.melbourne"
              className="text-sm transition-colors hover:text-accent"
            >
              hello@blanked.melbourne
            </a>
            <a
              href="https://www.instagram.com/by.blanked/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors hover:text-accent"
            >
              Instagram
            </a>
          </div>
        </div>

        <div className="relative aspect-[4/5] w-full overflow-hidden bg-divider">
          <Image
            src={heroImages[1]}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
