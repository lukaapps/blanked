"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/page-header";
import { spaceTypes } from "@/lib/mock-data";
import {
  readDemoProfileOverride,
  writeDemoProfileOverride,
  type DemoProfileType,
} from "@/lib/demo-profile";

type CommonFields = {
  isChef: boolean;
  initialName: string;
  initialPhoto: string | null;
  initialBio: string | null;
  initialRole: string | null;
  initialInstagram: string | null;
  initialSpaceTypePreferences: string[];
};

type Props =
  | ({ mode: "live"; profileId: string } & CommonFields)
  | ({ mode: "demo"; demoType: DemoProfileType } & CommonFields);

export function EditProfileForm(props: Props) {
  const router = useRouter();
  const [name, setName] = useState(props.initialName);
  const [photo, setPhoto] = useState(props.initialPhoto ?? "");
  const [bio, setBio] = useState(props.initialBio ?? "");
  const [role, setRole] = useState(props.initialRole ?? "");
  const [instagram, setInstagram] = useState(props.initialInstagram ?? "");
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
      setPhoto(override.photo ?? "");
      setBio(override.bio ?? "");
      setRole(override.role ?? "");
      setInstagram(override.instagram ?? "");
      setSpaceTypePreferences(override.spaceTypePreferences ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleSpaceType(type: string) {
    setSpaceTypePreferences((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    if (props.mode === "live") {
      await createClient()
        .from("profiles")
        .update({
          name,
          photo_url: photo || null,
          ...(props.isChef
            ? {
                bio: bio || null,
                role: role || null,
                instagram: instagram || null,
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
        photo: photo || null,
        ...(props.isChef ? { bio, role, instagram, spaceTypePreferences } : {}),
      });
      router.push("/profile");
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 pb-24 pt-24">
      <PageHeader title="Edit Profile" caption="Update your name and photo" />

      <form
        onSubmit={handleSubmit}
        className="mt-10 flex flex-col gap-5 bg-white p-6 sm:p-8"
      >
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
            Name
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input mt-2"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
            Photo URL
          </label>
          <input
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            className="input mt-2"
            placeholder="https://..."
          />
        </div>

        {props.isChef && (
          <>
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
                Role
              </label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input mt-2"
                placeholder="e.g. Talent / Supper Club Host"
              />
            </div>

            <div>
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

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
                Instagram handle
              </label>
              <input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="input mt-2"
                placeholder="@yourhandle"
              />
            </div>

            <div>
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

        <div className="mt-2 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-[#442220] py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="flex-1 border border-ink py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-ink hover:text-background"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
