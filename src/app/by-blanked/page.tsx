import { PageHeader } from "@/components/page-header";

export default function ByBlankedPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-20 text-center">
      <PageHeader
        title="by.Blanked"
        caption="Our events brand — coming soon"
      />
      <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-ink/60">
        by.Blanked is on its way. Check back soon.
      </p>
    </div>
  );
}
