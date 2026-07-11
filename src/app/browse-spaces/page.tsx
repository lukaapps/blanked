import { getSpaces } from "@/lib/data";
import { BrowseSpacesClient } from "./browse-client";

export const metadata = {
  title: "Browse Spaces | Blanked",
  description:
    "Search and filter Melbourne's short-term hospitality spaces. Find your next pop-up venue.",
};

export default async function BrowseSpacesPage() {
  const spaces = await getSpaces();
  return <BrowseSpacesClient spaces={spaces} />;
}
