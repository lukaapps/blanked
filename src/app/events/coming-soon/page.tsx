import { PageHeader } from "@/components/page-header";

export const metadata = {
  title: "Event Coming Soon | Blanked",
};

export default function EventComingSoonPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-20 text-center">
      <PageHeader
        title="Event details"
        caption="Coming soon"
      />
      <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-ink/60">
        This event page is on its way. Check back soon.
      </p>
    </div>
  );
}
