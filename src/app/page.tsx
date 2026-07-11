import { HomeHero } from "@/components/home-hero";
import { heroImages } from "@/lib/mock-data";

export default function Home() {
  return <HomeHero images={heroImages} />;
}
