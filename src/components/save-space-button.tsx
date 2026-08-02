"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function SaveSpaceButton({ spaceId }: { spaceId?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured() || !spaceId) return;
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("saved_spaces")
        .select("space_id")
        .eq("user_id", user.id)
        .eq("space_id", spaceId)
        .maybeSingle();
      if (!cancelled && data) setSaved(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [spaceId]);

  async function toggle() {
    if (!isSupabaseConfigured() || !spaceId) {
      setSaved((s) => !s); // demo mode — local only
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/signup?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (saved) {
      await supabase
        .from("saved_spaces")
        .delete()
        .eq("user_id", user.id)
        .eq("space_id", spaceId);
    } else {
      await supabase
        .from("saved_spaces")
        .insert({ user_id: user.id, space_id: spaceId });
    }
    setBusy(false);
    setSaved((s) => !s);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={saved}
      className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/50 transition-colors hover:text-accent disabled:opacity-50"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={saved ? "#CA0000" : "none"}
        stroke={saved ? "#CA0000" : "currentColor"}
        strokeWidth="1.5"
      >
        <path d="M12 21s-7.5-4.6-10.1-9.1C.4 8.7 1.9 5 5.5 5c2.2 0 3.9 1.3 4.9 3 1-1.7 2.7-3 4.9-3 3.6 0 5.1 3.7 3.6 6.9C19.5 16.4 12 21 12 21z" />
      </svg>
      {saved ? "Saved" : "Save Space"}
    </button>
  );
}
