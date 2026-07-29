export type SpaceType =
  | "Restaurant"
  | "Bar"
  | "Cafe"
  | "Event"
  | "Retail"
  | "Market"
  | "Kitchen only";

export type Review = {
  author: string;
  authorRole: string;
  rating: number; // 1–5
  date: string;
  text: string;
};

export type Space = {
  id?: string; // Supabase uuid; absent on mock data
  landlordId?: string | null;
  slug: string;
  name: string;
  suburb: string;
  type: SpaceType;
  capacity: number;
  sqft: number;
  dailyRate: number;
  weeklyRate?: number;
  monthlyRate?: number;
  minBookingDuration: string;
  description: string;
  whatCanYouDo: string;
  availability?: string;
  amenities: string[];
  kitchenFacilities: string[];
  equipmentIncluded: string[];
  images: string[];
  featured?: boolean;
  spaceRules: string[];
  reviews: Review[];
};

export type EventStatus = "Available" | "Selling Fast" | "Sold Out";

export type Event = {
  id?: string; // Supabase uuid; absent on mock data
  slug: string;
  name: string;
  chefSlug: string;
  spaceSlug: string;
  date: string;
  time: string;
  suburb: string;
  price: number | "Free";
  status: EventStatus;
  images: string[];
  description: string;
  ticketUrl: string;
};

export type Chef = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  quote: string;
  portrait: string;
  instagram: string;
  spaceTypePreferences: string[];
  locationPreferences: string[];
  featured?: boolean;
};
