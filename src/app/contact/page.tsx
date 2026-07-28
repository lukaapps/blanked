import Image from "next/image";
import { ContactForm } from "./contact-form";

export const metadata = {
  title: "Contact Us | Blanked",
  description:
    "Get in touch with the Blanked team — questions about listing a space, booking a pop-up, or anything else.",
};

export default function ContactPage() {
  return (
    <>
      <div className="flex min-h-screen flex-col lg:flex-row">
        <div className="flex flex-col justify-center gap-6 px-1.5 py-16 lg:w-1/2 lg:py-0">
          <h1 className="text-6xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-[100px]">
            Contact
            <br />
            us
          </h1>
          <p className="max-w-sm text-lg text-ink/60">
            We&rsquo;re here to help.
          </p>
          <a
            href="#contact-form"
            className="w-fit bg-[#442220] px-10 py-4 text-xs font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
          >
            Email Us
          </a>
        </div>

        <div className="relative w-full flex-1 lg:w-1/2">
          <Image
            src="/images/space-timber-lounge.jpg?v=3"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>

      <div id="contact-form" className="mx-auto max-w-2xl px-6 py-24">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
          Get in touch
        </p>
        <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-5xl">
          Send us a message
        </h2>
        <ContactForm />
      </div>
    </>
  );
}
