import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { ProfileDemo } from "./profile-demo";
import {
  ChefProfileLive,
  CustomerProfileLive,
  LandlordProfileLive,
  type ChefBooking,
  type LandlordRequest,
  type LandlordSpace,
  type ProfileData,
  type SavedEvent,
  type SavedSpace,
} from "./profile-live";

export const metadata = { title: "My Profile | Blanked" };

export default async function MyProfilePage() {
  if (!isSupabaseConfigured()) return <ProfileDemo />;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/profile");

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (!profileRow) redirect("/login?next=/profile");

  const profile: ProfileData = {
    id: profileRow.id,
    name: profileRow.name || user.email || "Your name",
    email: profileRow.email,
    accountType: profileRow.account_type,
    photoUrl: profileRow.photo_url,
    visibleToLandlords: profileRow.visible_to_landlords,
  };

  if (profile.accountType === "customer") {
    const { data: savedRows } = await supabase
      .from("saved_events")
      .select("events(slug, name, suburb, date, hero_image)")
      .eq("user_id", user.id);

    const savedEvents: SavedEvent[] = (savedRows ?? []).flatMap((row) => {
      const e = row.events as unknown as {
        slug: string;
        name: string;
        suburb: string | null;
        date: string | null;
        hero_image: string | null;
      } | null;
      if (!e) return [];
      return [
        {
          slug: e.slug,
          name: e.name,
          suburb: e.suburb ?? "",
          date: e.date ?? "",
          image: e.hero_image ?? "",
        },
      ];
    });

    return <CustomerProfileLive profile={profile} savedEvents={savedEvents} />;
  }

  if (profile.accountType === "chef") {
    const [{ data: bookingRows }, { data: savedRows }] = await Promise.all([
      supabase
        .from("booking_requests")
        .select("id, requested_dates, status, spaces(name, slug)")
        .eq("chef_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("saved_spaces")
        .select("spaces(slug, name, suburb, cover_image, images)")
        .eq("user_id", user.id),
    ]);

    const bookings: ChefBooking[] = (bookingRows ?? []).map((b) => {
      const space = b.spaces as unknown as { name: string; slug: string } | null;
      return {
        id: b.id,
        spaceName: space?.name ?? "Space",
        spaceSlug: space?.slug ?? "",
        dates: b.requested_dates,
        status: b.status,
      };
    });

    const savedSpaces: SavedSpace[] = (savedRows ?? []).flatMap((row) => {
      const s = row.spaces as unknown as {
        slug: string;
        name: string;
        suburb: string;
        cover_image: string | null;
        images: string[];
      } | null;
      if (!s) return [];
      return [
        {
          slug: s.slug,
          name: s.name,
          suburb: s.suburb,
          image: s.cover_image ?? s.images[0] ?? "",
        },
      ];
    });

    return (
      <ChefProfileLive
        profile={profile}
        bookings={bookings}
        savedSpaces={savedSpaces}
      />
    );
  }

  // Landlord view
  const [{ data: spaceRows }, { data: requestRows }] = await Promise.all([
    supabase
      .from("spaces")
      .select("id, slug, name, status, daily_rate_listed, daily_rate_landlord")
      .eq("landlord_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("booking_requests")
      .select(
        "id, requested_dates, event_description, status, spaces(name), chef:profiles!booking_requests_chef_id_fkey(name)"
      )
      .eq("landlord_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const requestCounts = new Map<string, number>();
  for (const r of requestRows ?? []) {
    const spaceName = (r.spaces as unknown as { name: string } | null)?.name;
    if (spaceName) {
      requestCounts.set(spaceName, (requestCounts.get(spaceName) ?? 0) + 1);
    }
  }

  const spaces: LandlordSpace[] = (spaceRows ?? []).map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    status: s.status,
    dailyRate: s.daily_rate_listed
      ? Number(s.daily_rate_listed)
      : s.daily_rate_landlord
      ? Number(s.daily_rate_landlord)
      : null,
    requestCount: requestCounts.get(s.name) ?? 0,
  }));

  const requests: LandlordRequest[] = (requestRows ?? []).map((r) => ({
    id: r.id,
    chefName:
      (r.chef as unknown as { name: string } | null)?.name ?? "A Blanked chef",
    spaceName: (r.spaces as unknown as { name: string } | null)?.name ?? "your space",
    dates: r.requested_dates,
    message: r.event_description ?? "",
    status: r.status,
  }));

  return (
    <LandlordProfileLive
      profile={profile}
      spaces={spaces}
      requests={requests}
    />
  );
}
