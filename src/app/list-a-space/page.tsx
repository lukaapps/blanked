import Image from "next/image";
import Link from "next/link";
import { RedDot } from "@/components/page-header";

export const metadata = {
  title: "List a Space | Blanked",
  description:
    "List your venue on Blanked and start receiving booking requests from vetted hospitality talent.",
};

const steps = [
  {
    n: "01",
    title: "Submit your space",
    body: "Tell us the basics — name, address, and what makes it work for hospitality talent.",
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
    title: "Hospitality talent find and book",
    body: "Vetted hospitality talent browse, filter, and send you booking requests. You approve every one. You get to meet everyone.",
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
    body: "Meet hospitality talent you’d never cross paths with on Instagram DMs.",
  },
  {
    title: "Fast to list",
    body: "Submit your space in under ten minutes.",
  },
];

const trust = [
  {
    title: "You approve every request",
    body: "Nothing books automatically — you accept or decline each request before it’s confirmed.",
  },
  {
    title: "Address kept private",
    body: "Your full address is internal only, and isn’t shown publicly until a booking is confirmed.",
  },
  {
    title: "Agreements & payment handled",
    body: "Once confirmed, Blanked generates the agreement and processes payment — no invoices to chase.",
  },
  {
    title: "Deposits held by Blanked",
    body: "Set your own damage deposit — Blanked holds it and it’s there if something goes wrong.",
  },
  {
    title: "Vetted hospitality talent",
    body: "Everyone requesting to book has been vetted before they can send a request.",
  },
  {
    title: "Service",
    body: "Blanked is always on hand to make sure you are fully supported and making the most out of the platform.",
  },
];

export default function ListASpacePage() {
  return (
    <>
      <div className="flex min-h-screen flex-col lg:flex-row">
        <div className="flex flex-col justify-center gap-6 px-1.5 py-16 lg:w-1/2 lg:py-0">
          <h1 className="text-6xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-[100px]">
            List your
            <br />
            space
          </h1>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
            Share your space.
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

      <div className="px-6 py-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
          How it works
        </p>
        <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-5xl">
          List your space in four steps
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
                <span className="text-xs font-semibold text-accent">
                  {step.n}
                </span>
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

      <div className="border-y border-divider bg-white">
        <div className="flex flex-col items-start gap-2 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
            What it costs
          </p>
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">
            Free to list until January 2027
          </p>
        </div>
      </div>

      <div className="px-6 py-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
          Why list with Blanked
        </p>
        <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-5xl">
          Built for landlords
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((a) => (
            <div key={a.title} className="bg-white p-6">
              <h3 className="text-sm font-semibold">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/50">
                {a.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
          Safety & trust
        </p>
        <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-5xl">
          You stay in control
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {trust.map((t) => (
            <div key={t.title} className="flex gap-3">
              <RedDot className="mt-2 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold">{t.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/50">
                  {t.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
        <Image
          src="/images/space-night-terrace.jpg?v=3"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative flex flex-col items-center gap-6 px-6 text-center">
          <h2 className="text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl">
            Ready to list your space?
          </h2>
          <Link
            href="/list-a-space/apply"
            className="bg-[#442220] px-10 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
          >
            List Space
          </Link>
        </div>
      </div>
    </>
  );
}
