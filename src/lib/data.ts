import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import type { Chef, Event, EventStatus, Review, Space } from "@/lib/types";
import type {
  ChefProfileRow,
  EventRow,
  ReviewRow,
  SpaceRow,
} from "@/lib/database.types";
import {
  chefs as mockChefs,
  events as mockEvents,
  spaces as mockSpaces,
} from "@/lib/mock-data";

// Server-side data layer. Reads from Supabase when configured,
// falls back to mock data otherwise so the site always renders.

function monthYear(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    month: "long",
    year: "numeric",
  });
}

function mapReview(row: ReviewRow): Review {
  return {
    author: row.author_name,
    authorRole: row.author_role ?? "",
    rating: row.rating,
    date: monthYear(row.created_at),
    text: row.body ?? "",
  };
}

function mapSpace(row: SpaceRow, reviews: ReviewRow[]): Space {
  return {
    id: row.id,
    landlordId: row.landlord_id,
    slug: row.slug,
    name: row.name,
    suburb: row.suburb,
    type: row.type,
    capacity: row.capacity ?? 0,
    sqft: row.sqft ?? 0,
    dailyRate: Number(row.daily_rate_listed ?? 0),
    weeklyRate: row.weekly_rate ? Number(row.weekly_rate) : undefined,
    monthlyRate: row.monthly_rate ? Number(row.monthly_rate) : undefined,
    minBookingDuration: row.min_booking_duration ?? "1 day",
    description: row.description ?? "",
    whatCanYouDo: row.what_can_you_do ?? "",
    amenities: row.amenities,
    kitchenFacilities: row.kitchen_facilities,
    equipmentIncluded: row.equipment_included,
    images: row.images.length ? row.images : [row.cover_image ?? ""],
    featured: row.featured,
    spaceRules: row.space_rules,
    reviews: reviews
      .filter((r) => r.space_id === row.id)
      .map(mapReview),
  };
}

function mapChef(row: ChefProfileRow): Chef {
  return {
    slug: row.slug,
    name: row.name,
    role: row.role ?? "",
    bio: row.bio ?? "",
    quote: row.quote ?? "",
    portrait: row.portrait_url ?? "",
    instagram: row.instagram ?? "https://instagram.com",
    spaceTypePreferences: row.space_type_preferences,
    locationPreferences: row.location_preferences,
    featured: row.featured,
  };
}

function mapEventStatus(row: EventRow): EventStatus {
  if (row.status === "sold_out") return "Sold Out";
  if (
    row.max_capacity &&
    row.tickets_sold > 0 &&
    row.tickets_sold >= row.max_capacity * 0.7
  ) {
    return "Selling Fast";
  }
  return "Available";
}

function mapEvent(
  row: EventRow,
  chefSlugById: Map<string, string>,
  spaceSlugById: Map<string, string>
): Event {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    chefSlug: row.chef_profile_id
      ? chefSlugById.get(row.chef_profile_id) ?? ""
      : "",
    spaceSlug: row.space_id ? spaceSlugById.get(row.space_id) ?? "" : "",
    date: row.date ?? "",
    time: row.time ?? "",
    suburb: row.suburb ?? "",
    price: row.price === null ? "Free" : Number(row.price),
    status: mapEventStatus(row),
    images: row.hero_image ? [row.hero_image] : [],
    description: row.description ?? "",
    ticketUrl: row.ticket_url ?? "#",
  };
}

export async function getSpaces(): Promise<Space[]> {
  if (!isSupabaseConfigured()) return mockSpaces;
  const supabase = await createClient();
  const [{ data: spaces, error }, { data: reviews }] = await Promise.all([
    supabase
      .from("spaces")
      .select("*")
      .eq("status", "live")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: true }),
    supabase.from("reviews").select("*").order("created_at", { ascending: false }),
  ]);
  if (error || !spaces) {
    console.error("getSpaces failed, using mock data:", error?.message);
    return mockSpaces;
  }
  return (spaces as SpaceRow[]).map((s) =>
    mapSpace(s, (reviews ?? []) as ReviewRow[])
  );
}

export async function getSpace(slug: string): Promise<Space | null> {
  if (!isSupabaseConfigured())
    return mockSpaces.find((s) => s.slug === slug) ?? null;
  const supabase = await createClient();
  const { data: space, error } = await supabase
    .from("spaces")
    .select("*")
    .eq("slug", slug)
    .eq("status", "live")
    .maybeSingle();
  if (error || !space) return null;
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("space_id", (space as SpaceRow).id)
    .order("created_at", { ascending: false });
  return mapSpace(space as SpaceRow, (reviews ?? []) as ReviewRow[]);
}

export async function getChefs(): Promise<Chef[]> {
  if (!isSupabaseConfigured()) return mockChefs;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chef_profiles")
    .select("*")
    .eq("visible", true)
    .order("featured", { ascending: false })
    .order("name");
  if (error || !data) {
    console.error("getChefs failed, using mock data:", error?.message);
    return mockChefs;
  }
  return (data as ChefProfileRow[]).map(mapChef);
}

export async function getChef(slug: string): Promise<Chef | null> {
  if (!isSupabaseConfigured())
    return mockChefs.find((c) => c.slug === slug) ?? null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chef_profiles")
    .select("*")
    .eq("slug", slug)
    .eq("visible", true)
    .maybeSingle();
  if (error || !data) return null;
  return mapChef(data as ChefProfileRow);
}

async function slugMaps() {
  const supabase = await createClient();
  const [{ data: chefRows }, { data: spaceRows }] = await Promise.all([
    supabase.from("chef_profiles").select("id, slug"),
    supabase.from("spaces").select("id, slug"),
  ]);
  return {
    chefSlugById: new Map(
      (chefRows ?? []).map((r: { id: string; slug: string }) => [r.id, r.slug])
    ),
    spaceSlugById: new Map(
      (spaceRows ?? []).map((r: { id: string; slug: string }) => [r.id, r.slug])
    ),
  };
}

export async function getEvents(): Promise<Event[]> {
  if (!isSupabaseConfigured()) return mockEvents;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .neq("status", "draft")
    .order("date", { ascending: true });
  if (error || !data) {
    console.error("getEvents failed, using mock data:", error?.message);
    return mockEvents;
  }
  const { chefSlugById, spaceSlugById } = await slugMaps();
  return (data as EventRow[]).map((e) => mapEvent(e, chefSlugById, spaceSlugById));
}

export async function getEvent(slug: string): Promise<Event | null> {
  if (!isSupabaseConfigured())
    return mockEvents.find((e) => e.slug === slug) ?? null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .neq("status", "draft")
    .maybeSingle();
  if (error || !data) return null;
  const { chefSlugById, spaceSlugById } = await slugMaps();
  return mapEvent(data as EventRow, chefSlugById, spaceSlugById);
}
