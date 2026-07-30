import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  mockChefProfile,
  mockLandlordProfile,
  mockCustomerProfile,
} from "@/lib/mock-data";
import type { DemoProfileType } from "@/lib/demo-profile";
import { EditProfileForm } from "./edit-profile-form";

export const metadata = { title: "Edit Profile | Blanked" };

type DemoDefaults = {
  name: string;
  email: string;
  photo: string | null;
  photos: string[];
  bio: string | null;
  role: string | null;
  instagram: string | null;
  website: string | null;
  addressLine: string | null;
  addressSuburb: string | null;
  addressState: string | null;
  addressPostcode: string | null;
  spaceTypePreferences: string[];
};

const demoDefaults: Record<DemoProfileType, DemoDefaults> = {
  chef: {
    name: mockChefProfile.name,
    email: mockChefProfile.email,
    photo: mockChefProfile.photo,
    photos: mockChefProfile.photos,
    bio: mockChefProfile.bio,
    role: mockChefProfile.role,
    instagram: mockChefProfile.instagram,
    website: mockChefProfile.website,
    addressLine: mockChefProfile.addressLine,
    addressSuburb: mockChefProfile.addressSuburb,
    addressState: mockChefProfile.addressState,
    addressPostcode: mockChefProfile.addressPostcode,
    spaceTypePreferences: mockChefProfile.spaceTypePreferences,
  },
  landlord: {
    name: mockLandlordProfile.name,
    email: mockLandlordProfile.email,
    photo: mockLandlordProfile.photo,
    photos: mockLandlordProfile.photos,
    bio: null,
    role: mockLandlordProfile.role,
    instagram: null,
    website: mockLandlordProfile.website,
    addressLine: mockLandlordProfile.addressLine,
    addressSuburb: mockLandlordProfile.addressSuburb,
    addressState: mockLandlordProfile.addressState,
    addressPostcode: mockLandlordProfile.addressPostcode,
    spaceTypePreferences: [],
  },
  customer: {
    name: mockCustomerProfile.name,
    email: mockCustomerProfile.email,
    photo: mockCustomerProfile.photo,
    photos: [],
    bio: null,
    role: null,
    instagram: null,
    website: null,
    addressLine: null,
    addressSuburb: null,
    addressState: null,
    addressPostcode: null,
    spaceTypePreferences: [],
  },
};

export default async function EditProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ demo?: string }>;
}) {
  if (!isSupabaseConfigured()) {
    const { demo } = await searchParams;
    const demoType: DemoProfileType =
      demo === "landlord" ? "landlord" : demo === "customer" ? "customer" : "chef";
    const defaults = demoDefaults[demoType];
    return (
      <EditProfileForm
        mode="demo"
        demoType={demoType}
        accountType={demoType}
        initialName={defaults.name}
        initialEmail={defaults.email}
        initialPhoto={defaults.photo}
        initialPhotos={defaults.photos}
        initialBio={defaults.bio}
        initialRole={defaults.role}
        initialInstagram={defaults.instagram}
        initialWebsite={defaults.website}
        initialAddressLine={defaults.addressLine}
        initialAddressSuburb={defaults.addressSuburb}
        initialAddressState={defaults.addressState}
        initialAddressPostcode={defaults.addressPostcode}
        initialSpaceTypePreferences={defaults.spaceTypePreferences}
      />
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/profile/edit");

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (!profileRow) redirect("/login?next=/profile/edit");

  return (
    <EditProfileForm
      mode="live"
      profileId={profileRow.id}
      accountType={profileRow.account_type}
      initialName={profileRow.name || ""}
      initialEmail={profileRow.email || ""}
      initialPhoto={profileRow.photo_url}
      initialPhotos={profileRow.photos ?? []}
      initialBio={profileRow.bio}
      initialRole={profileRow.role}
      initialInstagram={profileRow.instagram}
      initialWebsite={profileRow.website}
      initialAddressLine={profileRow.address_line}
      initialAddressSuburb={profileRow.address_suburb}
      initialAddressState={profileRow.address_state}
      initialAddressPostcode={profileRow.address_postcode}
      initialSpaceTypePreferences={profileRow.space_type_preferences ?? []}
    />
  );
}
