import { getSpaces } from "@/lib/data";
import { BrowseSpacesClient } from "./browse-client";
import { DotSlot } from "@/components/brand-dot";

export const metadata = {
  title: "Browse Spaces | Blanked",
  description:
    "Search and filter Melbourne's short-term hospitality spaces. Find your next pop-up venue.",
};

export default async function BrowseSpacesPage() {
  const spaces = await getSpaces();
  return (
    <>
      {/* Top right, above the search box */}
      <DotSlot at={0} chosen={0} position="right-[27px]" />
      <BrowseSpacesClient spaces={spaces} />
    </>
  );
}
