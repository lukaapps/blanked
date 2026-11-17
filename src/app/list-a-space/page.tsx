import Image from "next/image";
import Link from "next/link";
import { RedDot } from "@/components/page-header";
import { Stops } from "@/components/brand-stop";

export const metadata = {
  title: "List a Space | Blanked",
  description:
    "List your venue on Blanked and start receiving booking requests from vetted chefs.",
};

const label =
 "text-[11px] font-semibold text-ink/40";

const steps = [
  {
    n: "01",
    title: "Submit your space",
    body: "Tell us the basics — name, address, and what makes it work for chefs.",
    image: "/images/space-brick-loft.jpg?v=3",
  },
  {
    n: "02",
    title: "We review & publish",
    body: "We review your listing, get in touch and get it live, usually within 3 business days.",
    image: "/images/space-timber-lounge.jpg?v=3",
  },
  {
    n: "03",
    title: "Chefs find and book",
    body: "Vetted chefs browse, filter, and send you booking requests. You approve every one. You get to meet everyone.",
    image: "/images/space-dark-dining.jpg?v=3",
  },
  {
    n: "04",
    title: "Agreement & payment, handled",
    body: "Once you accept, Blanked generates the agreement and processes payment. Rent earned is deposited into your bank account every week.",
    image: "/images/space-bar-shelves.jpg?v=3",
  },
];

const advantages = [
  {
    title: "Extra income and earn more",
    body: "Turn empty hours and quiet weeks into paid bookings instead of downtime.",
  },
  {
    title: "Full control",
    body: "Set your own daily rate and choose exactly when your space is available.",
  },
  {
    title: "Find new partners",
    body: "Meet chefs you’d never cross paths with on Instagram DMs.",
  },
  {
    title: "Fast to list",
    body: "Submit your space in under ten minutes.",
  },
];

const trust = [
  {
    group: "before",
    title: "You approve every request",
    body: "Nothing books automatically — you accept or decline each request before it’s confirmed.",
  },
  {
    group: "before",
    title: "Vetted chefs",
    body: "Everyone requesting to book has been vetted before they can send a request.",
  },
  {
    group: "before",
    title: "Address kept private",
    body: "Your full address is internal only, and isn’t shown publicly until a booking is confirmed.",
  },
  {
    group: "after",
    title: "Agreements & payment handled",
    body: "Once confirmed, Blanked generates the agreement and processes payment — no invoices to chase.",
  },
  {
    group: "after",
    title: "Deposits held by Blanked",
    body: "Set your own damage deposit — Blanked holds it and it’s there if something goes wrong.",
  },
  {
    group: "after",
    title: "Service",
    body: "Blanked is always on hand to make sure you are fully supported and making the most out of the platform.",
  },
];

const trustGroups = [
  { label: "Before you accept", items: trust.filter((t) => t.group === "before") },
  { label: "Once it's booked", items: trust.filter((t) => t.group === "after") },
];

export default function ListASpacePage() {
  return (
    <>
      <div className="flex min-h-screen flex-col lg:flex-row">
        <div className="flex flex-col justify-center gap-6 px-[9px] py-16 lg:w-1/2 lg:py-0">
          <h1 className="text-6xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-[100px]">
            List your
            <br />
            space
          </h1>
          <p className="text-[11px] font-semibold text-ink/40">
            <Stops>The city has space. Let’s use it.</Stops>
          </p>
          <Link
            href="/list-a-space/apply"
            className="w-fit bg-[#442220] px-10 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
          >
            List Space
          </Link>
        </div>

        <div className="relative w-full flex-1 lg:w-1/2">
          <Image
            src="/images/list-space-hero.jpg?v=4"
            alt="Shopfront available to list on Blanked"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-8 border-y border-divider bg-white">
        <div className="flex flex-col items-start gap-2 px-[27px] py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className={label}>What it costs</p>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            Free to list until January 2027
          </p>
        </div>
      </div>

      <div className="px-[27px] py-24">
        <p className={label}>How it works</p>
        <h2 className="mt-3 font-bold tracking-tight leading-[1.1] text-3xl sm:text-5xl lg:text-6xl">
          Listing and booking
        </h2>

        <div className="mt-16 flex flex-col gap-16">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className={`flex flex-col gap-8 lg:items-center lg:gap-16 ${
                i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
              }`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-divider lg:w-1/2">
                <Image
                  src={step.image}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="lg:w-1/2">
                <span className={label}>{step.n}</span>
                <h3 className="mt-2 text-2xl font-medium tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-md text-base leading-relaxed text-ink/60">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-[27px] py-24">
        <p className={label}>Why list with Blanked</p>
        <h2 className="mt-3 font-bold tracking-tight leading-[1.1] text-3xl sm:text-5xl lg:text-6xl">
          Built for landlords
        </h2>

        <div className="mt-16 grid grid-cols-1 border-t border-divider sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((a, i) => (
            <div
              key={a.title}
              className="flex flex-col gap-4 border-b border-divider py-8 sm:odd:pr-8 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
            >
              <span className={label}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-2xl font-bold leading-tight tracking-tight">
                {a.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink/60">{a.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Full-width tagline: the type itself is the texture */}
      <div className="px-[27px] pb-24">
        <p className="text-center text-[12vw] font-bold leading-[1.05] tracking-tight lg:whitespace-nowrap lg:text-[5.6vw]">
          <Stops>The city has space. Let’s use it.</Stops>
        </p>
      </div>

      <div className="px-[27px] py-24">
        <p className={label}>Safety & trust</p>
        <h2 className="mt-3 font-bold tracking-tight leading-[1.1] text-3xl sm:text-5xl lg:text-6xl">
          You stay in control
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-16 lg:grid-cols-2">
          {trustGroups.map((group) => (
            <div key={group.label}>
              <p className={label}>{group.label}</p>
              <div className="mt-8 flex flex-col gap-8 border-t border-divider pt-8">
                {group.items.map((t) => (
                  <div key={t.title} className="flex gap-3">
                    <RedDot className="mt-2 shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold">{t.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink/60">
                        {t.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Closing: call to action beside the three steps */}
      <div className="border-t border-divider px-[27px] py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-x-16">
          <div className="flex flex-col items-start gap-8">
            <h2 className="font-bold tracking-tight leading-[1.1] text-3xl sm:text-5xl lg:text-6xl">
              Ready to list your space?
            </h2>
            <Link
              href="/list-a-space/apply"
              className="inline-flex w-fit bg-[#442220] px-10 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
            >
              List Space
            </Link>
          </div>

          <ol className="border-t border-divider">
            {steps.slice(0, 3).map((step) => (
              <li
                key={step.n}
                className="flex items-baseline gap-6 border-b border-divider py-5"
              >
                <span className={label}>{step.n}</span>
                <span className="text-lg font-bold tracking-tight">
                  {step.title}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}
