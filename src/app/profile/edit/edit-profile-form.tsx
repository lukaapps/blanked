"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/page-header";
import { PhotoUploader } from "@/components/photo-uploader";
import { spaceTypes } from "@/lib/mock-data";
import {
  fileToDataUrl,
  readDemoProfileOverride,
  writeDemoProfileOverride,
  type DemoProfileType,
} from "@/lib/demo-profile";

const roleOptions = ["Owner", "Manager", "Head Chef", "Event Coordinator", "Other"];
const knownRoles = roleOptions.filter((r) => r !== "Other");

function splitRole(role: string | null) {
  if (!role) return { role: "", roleOther: "" };
  if (knownRoles.includes(role)) return { role, roleOther: "" };
  return { role: "Other", roleOther: role };
}

type AccountType = "chef" | "landlord" | "customer";

type CommonFields = {
  accountType: AccountType;
  initialName: string;
  initialBusinessName: string | null;
  initialEmail: string;
  initialPhoto: string | null;
  initialPhotos: string[];
  initialBio: string | null;
  initialRole: string | null;
  initialInstagram: string | null;
  initialWebsite: string | null;
  initialAddressLine: string | null;
  initialAddressSuburb: string | null;
  initialAddressState: string | null;
  initialAddressPostcode: string | null;
  initialSpaceTypePreferences: string[];
};

type Props =
  | ({ mode: "live"; profileId: string } & CommonFields)
  | ({ mode: "demo"; demoType: DemoProfileType } & CommonFields);

export function EditProfileForm(props: Props) {
  const router = useRouter();
  const isBusiness = props.accountType !== "customer";
  const isChef = props.accountType === "chef";
  const isLandlord = props.accountType === "landlord";

  const [name, setName] = useState(props.initialName);
  const [businessName, setBusinessName] = useState(props.initialBusinessName ?? "");
  const [email, setEmail] = useState(props.initialEmail);
  const [photo, setPhoto] = useState(props.initialPhoto ?? "");
  const [photos, setPhotos] = useState(props.initialPhotos);
  const [bio, setBio] = useState(props.initialBio ?? "");
  const initialRoleSplit = splitRole(props.initialRole);
  const [role, setRole] = useState(initialRoleSplit.role);
  const [roleOther, setRoleOther] = useState(initialRoleSplit.roleOther);
  const [instagram, setInstagram] = useState(props.initialInstagram ?? "");
  const [website, setWebsite] = useState(props.initialWebsite ?? "");
  const [addressLine, setAddressLine] = useState(props.initialAddressLine ?? "");
  const [addressSuburb, setAddressSuburb] = useState(props.initialAddressSuburb ?? "");
  const [addressState, setAddressState] = useState(props.initialAddressState ?? "");
  const [addressPostcode, setAddressPostcode] = useState(props.initialAddressPostcode ?? "");
  const [spaceTypePreferences, setSpaceTypePreferences] = useState(
    props.initialSpaceTypePreferences
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Demo overrides live in localStorage and can only be read after mount.
    if (props.mode !== "demo") return;
    const override = readDemoProfileOverride(props.demoType);
    if (override) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(override.name);
      setBusinessName(override.businessName ?? "");
      setEmail(override.email ?? "");
      setPhoto(override.photo ?? "");
      setPhotos(override.photos ?? []);
      setBio(override.bio ?? "");
      const overrideRoleSplit = splitRole(override.role ?? null);
      setRole(overrideRoleSplit.role);
      setRoleOther(overrideRoleSplit.roleOther);
      setInstagram(override.instagram ?? "");
      setWebsite(override.website ?? "");
      setAddressLine(override.addressLine ?? "");
      setAddressSuburb(override.addressSuburb ?? "");
      setAddressState(override.addressState ?? "");
      setAddressPostcode(override.addressPostcode ?? "");
      setSpaceTypePreferences(override.spaceTypePreferences ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleSpaceType(type: string) {
    setSpaceTypePreferences((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  async function uploadPhoto(file: File): Promise<string> {
    if (props.mode === "demo") return fileToDataUrl(file);
    const supabase = createClient();
    const path = `${props.profileId}/${crypto.randomUUID()}-${file.name}`;
    const { error } = await supabase.storage
      .from("profile-photos")
      .upload(path, file, { upsert: true });
    if (error) throw error;
    return supabase.storage.from("profile-photos").getPublicUrl(path).data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const finalRole = role === "Other" ? roleOther.trim() || "Other" : role;
    const avatarPhoto = isBusiness ? photos[0] ?? null : photo || null;
    const businessFields = isBusiness
      ? {
          businessName,
          role: finalRole,
          website,
          instagram,
          addressLine,
          addressSuburb,
          addressState,
          addressPostcode,
          photos,
        }
      : {};
    const chefFields = isChef ? { bio, spaceTypePreferences } : {};

    if (props.mode === "live") {
      await createClient()
        .from("profiles")
        .update({
          name,
          email,
          photo_url: avatarPhoto,
          ...(isBusiness
            ? {
                business_name: businessName || null,
                role: finalRole || null,
                website: website || null,
                instagram: instagram || null,
                address_line: addressLine || null,
                address_suburb: addressSuburb || null,
                address_state: addressState || null,
                address_postcode: addressPostcode || null,
                photos,
              }
            : {}),
          ...(isChef
            ? {
                bio: bio || null,
                space_type_preferences: spaceTypePreferences,
              }
            : {}),
        })
        .eq("id", props.profileId);
      router.push("/profile");
      router.refresh();
    } else {
      writeDemoProfileOverride(props.demoType, {
        name,
        email,
        photo: avatarPhoto,
        ...businessFields,
        ...chefFields,
      });
      router.push("/profile");
    }
  }

  return (
    <div className="px-6 pb-24 pt-24">
      <div className="mx-auto max-w-3xl">
        <PageHeader
          title="Edit Profile"
          caption={
            isChef
              ? "Your profile is shared with potential landlords of the spaces as a representation of your business. See it as your opportunity to show exactly what you do and why they should host you."
              : isLandlord
              ? "Blanked will support in creating your listing"
              : "Update your name and photo"
          }
        />

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid grid-cols-1 gap-5 bg-white p-6 sm:grid-cols-2 sm:p-8"
        >
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
              {isBusiness ? "Full Name" : "Name"}
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input mt-2"
              placeholder={isBusiness ? "Your full name" : "Your name"}
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input mt-2"
              placeholder="you@example.com"
            />
          </div>

          {isBusiness && (
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
                {isLandlord ? "Business Name" : "Display / Brand Name"}
              </label>
              <input
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="input mt-2"
                placeholder={isLandlord ? "Your business name" : "Your display or brand name"}
              />
            </div>
          )}

          {isBusiness ? (
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
                Photos
              </label>
              <div className="mt-2">
                <PhotoUploader photos={photos} onChange={setPhotos} uploadFile={uploadPhoto} />
              </div>
            </div>
          ) : (
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
                Display Picture
              </label>
              <div className="mt-2">
                <PhotoUploader
                  photos={photo ? [photo] : []}
                  onChange={(next) => setPhoto(next[0] ?? "")}
                  uploadFile={uploadPhoto}
                  max={1}
                />
              </div>
            </div>
          )}

          {isBusiness && (
            <>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input mt-2"
                >
                  <option value="">Select a role</option>
                  {roleOptions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                {role === "Other" && (
                  <input
                    value={roleOther}
                    onChange={(e) => setRoleOther(e.target.value)}
                    className="input mt-2"
                    placeholder="What's your role?"
                  />
                )}
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
                  Website
                </label>
                <input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="input mt-2"
                  placeholder="https://..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
                  Instagram URL{isLandlord ? " (if applicable)" : ""}
                </label>
                <input
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="input mt-2"
                  placeholder="https://instagram.com/..."
                />
              </div>
            </>
          )}

          {isChef && (
            <>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="input mt-2 resize-none"
                  placeholder="Tell landlords a bit about you and your food"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
                  What I&rsquo;m looking for
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {spaceTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleSpaceType(type)}
                      className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors ${
                        spaceTypePreferences.includes(type)
                          ? "bg-[#442220] text-white"
                          : "border border-divider text-ink/50 hover:border-ink hover:text-ink"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {isBusiness && (
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
                Company address
              </label>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="input sm:col-span-2"
                  placeholder="Street address"
                />
                <input
                  value={addressSuburb}
                  onChange={(e) => setAddressSuburb(e.target.value)}
                  className="input"
                  placeholder="City / Suburb"
                />
                <input
                  value={addressState}
                  onChange={(e) => setAddressState(e.target.value)}
                  className="input"
                  placeholder="State"
                />
                <input
                  value={addressPostcode}
                  onChange={(e) => setAddressPostcode(e.target.value)}
                  className="input"
                  placeholder="Postcode"
                />
              </div>
            </div>
          )}

          <div className="mt-2 flex gap-3 sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#442220] py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-opacity hover:opacity-90 disabled:opacity-40 sm:flex-none sm:px-10"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/profile")}
              className="flex-1 border border-ink py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-ink hover:text-background sm:flex-none sm:px-10"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
