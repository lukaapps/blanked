import Image from "next/image";
import { RedDot } from "@/components/page-header";

export const metadata = {
  title: "by.Blanked | Blanked",
  description: "Our events brand — coming soon.",
};

export default function ByBlankedPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-20 text-center">
      <h1 className="flex flex-wrap items-baseline justify-center gap-3 text-6xl font-bold normal-case leading-[0.95] tracking-tight sm:text-7xl lg:text-[100px]">
        <span className="font-black">by</span>
        <RedDot className="-ml-1.5 h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-[18px] lg:w-[18px]" />
        <Image
          src="/images/logo-blanked.jpg?v=3"
          alt="Blanked"
          width={1107}
          height={184}
          className="h-14 w-auto mix-blend-multiply sm:h-16 lg:h-24"
        />
      </h1>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
        Our events brand — coming soon
      </p>
      <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-ink/60">
        by.Blanked is on its way. Check back soon.
      </p>
    </div>
  );
}
