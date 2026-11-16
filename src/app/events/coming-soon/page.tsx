import { PageHeader } from "@/components/page-header";
import { DotSlot, pickDotSlot } from "@/components/brand-dot";

export const metadata = {
  title: "Event Coming Soon | Blanked",
};

export default function EventComingSoonPage() {
  const dot = pickDotSlot(1);
  return (
    <div className="mx-auto max-w-3xl px-[27px] pb-24 pt-20 text-center">
      <PageHeader
        title="Event details"
        caption="Coming soon"
      />
      <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-ink/60">
        This event page is on its way. Check back soon.
      </p>
      <DotSlot at={0} chosen={dot} />
    </div>
  );
}
