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

const demoDefaults: Record<
  DemoProfileType,
  {
    name: string;
    photo: string | null;
    bio: string | null;
    role: string | null;
    instagram: string | null;
    spaceTypePreferences: string[];
  }
> = {
  chef: {
    name: mockChefProfile.name,
    photo: mockChefProfile.photo,
    bio: mockChefProfile.bio,
    role: mockChefProfile.role,
    instagram: mockChefProfile.instagram,
    spaceTypePreferences: mockChefProfile.spaceTypePreferences,
  },
  landlord: {
    name: mockLandlordProfile.name,
    photo: mockLandlordProfile.photo,
    bio: null,
    role: null,
    instagram: null,
    spaceTypePreferences: [],
  },
  customer: {
    name: mockCustomerProfile.name,
    photo: mockCustomerProfile.photo,
    bio: null,
    role: null,
    instagram: null,
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
        isChef={demoType === "chef"}
        initialName={defaults.name}
        initialPhoto={defaults.photo}
        initialBio={defaults.bio}
        initialRole={defaults.role}
        initialInstagram={defaults.instagram}
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
      isChef={profileRow.account_type === "chef"}
      initialName={profileRow.name || ""}
      initialPhoto={profileRow.photo_url}
      initialBio={profileRow.bio}
      initialRole={profileRow.role}
      initialInstagram={profileRow.instagram}
      initialSpaceTypePreferences={profileRow.space_type_preferences ?? []}
    />
  );
}
