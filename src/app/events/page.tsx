import { getChefs, getEvents } from "@/lib/data";
import { EventsClient } from "./events-client";
import { DotSlot, pickDotSlot } from "@/components/brand-dot";

export const metadata = {
  title: "Events | Blanked",
  description:
    "Melbourne's best pop-up dining, presented by Blanked. Discover and book upcoming events.",
};

export default async function EventsPage() {
  const [events, chefs] = await Promise.all([getEvents(), getChefs()]);
  const chefNames = Object.fromEntries(chefs.map((c) => [c.slug, c.name]));
  const dot = pickDotSlot(1);
  return (
    <>
      <EventsClient events={events} chefNames={chefNames} />
      <DotSlot at={0} chosen={dot} />
    </>
  );
}
