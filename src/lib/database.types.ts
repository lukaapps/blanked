// Hand-written types matching supabase/migrations/0001_initial_schema.sql.
// Replace with generated types once the project is linked:
//   npx supabase gen types typescript --project-id <ref> > src/lib/database.types.ts

export type AccountType = "chef" | "landlord" | "customer";
export type SpaceStatus = "pending" | "live" | "inactive";
export type SpaceTypeDb =
  | "Restaurant"
  | "Bar"
  | "Cafe"
  | "Event"
  | "Retail"
  | "Market"
  | "Kitchen only";
export type BookingStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "confirmed"
  | "completed"
  | "cancelled";
export type EventStatus = "draft" | "live" | "sold_out" | "past";

export type ProfileRow = {
  id: string;
  account_type: AccountType;
  name: string;
  email: string;
  is_admin: boolean;
  bio: string | null;
  role: string | null;
  instagram: string | null;
  photo_url: string | null;
  space_type_preferences: string[];
  visible_to_landlords: boolean;
  business_name: string | null;
  contact_phone: string | null;
  abn: string | null;
  licence: string | null;
  website: string | null;
  address_line: string | null;
  address_suburb: string | null;
  address_state: string | null;
  address_postcode: string | null;
  how_heard: string | null;
  photos: string[];
  created_at: string;
  last_login: string | null;
};

export type ChefProfileRow = {
  id: string;
  user_id: string | null;
  slug: string;
  name: string;
  role: string | null;
  bio: string | null;
  quote: string | null;
  portrait_url: string | null;
  instagram: string | null;
  space_type_preferences: string[];
  location_preferences: string[];
  featured: boolean;
  visible: boolean;
  created_at: string;
  updated_at: string;
};

export type SpaceRow = {
  id: string;
  landlord_id: string | null;
  slug: string;
  name: string;
  type: SpaceTypeDb;
  suburb: string;
  full_address: string | null;
  description: string | null;
  what_can_you_do: string | null;
  capacity: number | null;
  sqft: number | null;
  kitchen_facilities: string[];
  equipment_included: string[];
  amenities: string[];
  parking: boolean;
  provides: { item: string; price?: string }[];
  daily_rate_landlord: number | null;
  daily_rate_listed: number | null;
  weekly_rate: number | null;
  monthly_rate: number | null;
  min_booking_duration: string | null;
  max_booking_duration: string | null;
  available_from: string | null;
  availability_note: string | null;
  blackout_dates: unknown[];
  space_rules: string[];
  images: string[];
  cover_image: string | null;
  featured: boolean;
  status: SpaceStatus;
  created_at: string;
  updated_at: string;
};

export type BookingRequestRow = {
  id: string;
  space_id: string;
  chef_id: string;
  landlord_id: string | null;
  requested_dates: string;
  event_description: string | null;
  notes: string | null;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
};

export type EventRow = {
  id: string;
  slug: string;
  chef_profile_id: string | null;
  space_id: string | null;
  name: string;
  description: string | null;
  date: string | null;
  time: string | null;
  suburb: string | null;
  price: number | null; // null = free
  max_capacity: number | null;
  tickets_sold: number;
  hero_image: string | null;
  ticket_url: string | null;
  status: EventStatus;
  created_at: string;
  updated_at: string;
};

export type ReviewRow = {
  id: string;
  space_id: string;
  author_user_id: string | null;
  author_name: string;
  author_role: string | null;
  rating: number;
  body: string | null;
  created_at: string;
};
