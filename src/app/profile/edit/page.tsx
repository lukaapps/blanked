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

const demoDefaults: Record<DemoProfileType, { name: string; photo: string | null }> = {
  chef: mockChefProfile,
  landlord: mockLandlordProfile,
  customer: mockCustomerProfile,
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
        initialName={defaults.name}
        initialPhoto={defaults.photo}
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
      initialName={profileRow.name || ""}
      initialPhoto={profileRow.photo_url}
    />
  );
}
