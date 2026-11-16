export const metadata = {
  title: "by.Blanked | Blanked",
  description: "Our events brand — coming soon.",
};

import { DotSlot, pickDotSlot } from "@/components/brand-dot";

export default function ByBlankedPage() {
  // Only one grey spot on this page, below the paragraph.
  const dot = pickDotSlot(1);
  return (
    <div className="mx-auto max-w-5xl px-[27px] pb-24 pt-64 text-center">
      <p className="mx-auto max-w-md text-sm leading-relaxed text-ink/60">
        by.Blanked is on its way. Check back soon.
      </p>
      <DotSlot at={0} chosen={dot} />
    </div>
  );
}
