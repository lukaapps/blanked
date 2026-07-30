"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PageHeader } from "@/components/page-header";
import {
  readDemoProfileOverride,
  writeDemoProfileOverride,
  type DemoProfileType,
} from "@/lib/demo-profile";

type Props =
  | {
      mode: "live";
      profileId: string;
      initialName: string;
      initialPhoto: string | null;
    }
  | {
      mode: "demo";
      demoType: DemoProfileType;
      initialName: string;
      initialPhoto: string | null;
    };

export function EditProfileForm(props: Props) {
  const router = useRouter();
  const [name, setName] = useState(props.initialName);
  const [photo, setPhoto] = useState(props.initialPhoto ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Demo overrides live in localStorage and can only be read after mount.
    if (props.mode !== "demo") return;
    const override = readDemoProfileOverride(props.demoType);
    if (override) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(override.name);
      setPhoto(override.photo ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    if (props.mode === "live") {
      await createClient()
        .from("profiles")
        .update({ name, photo_url: photo || null })
        .eq("id", props.profileId);
      router.push("/profile");
      router.refresh();
    } else {
      writeDemoProfileOverride(props.demoType, {
        name,
        photo: photo || null,
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
