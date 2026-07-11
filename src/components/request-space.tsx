"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { Space } from "@/lib/types";

type Stage = "idle" | "form" | "sending" | "sent";

export function RequestSpace({ space }: { space: Space }) {
  const router = useRouter();
  const pathname = usePathname();
  const [stage, setStage] = useState<Stage>("idle");
  const [dates, setDates] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function openForm() {
    if (!isSupabaseConfigured() || !space.id) {
      setStage("form");
      return;
    }
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    setStage("form");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured() || !space.id) {
      setStage("sent"); // demo mode
      return;
    }

    setStage("sending");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    const { error } = await supabase.from("booking_requests").insert({
      space_id: space.id,
      chef_id: user.id,
      landlord_id: space.landlordId ?? null,
      requested_dates: dates,
      event_description: description,
      notes: notes || null,
    });
    if (error) {
      setError(error.message);
      setStage("form");
      return;
    }
    setStage("sent");
  }

  if (stage === "sent") {
    return (
      <div className="text-center">
        <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
        <p className="mt-3 text-sm font-medium">Your request has been sent.</p>
        <p className="mt-1 text-xs text-ink/50">
          You&rsquo;ll hear back within 48 hours.
        </p>
      </div>
    );
  }

  if (stage === "idle") {
    return (
      <>
        <Button variant="secondary" className="w-full py-4" onClick={openForm}>
          Request This Space
        </Button>
        <p className="mt-3 text-center text-xs text-ink/40">
          You&rsquo;ll hear back within 48 hours.
        </p>
      </>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
          Requested dates
        </label>
        <input
          required
          value={dates}
          onChange={(e) => setDates(e.target.value)}
          className="input mt-2"
          placeholder="e.g. 12–14 September, or every Sunday in October"
        />
      </div>
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
          What are you planning?
        </label>
        <textarea
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input mt-2"
          placeholder="Brief description of your event or residency"
        />
      </div>
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
          Questions (optional)
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input mt-2"
          placeholder="Anything you need to know about the space?"
        />
      </div>

      {error && <p className="text-sm text-accent">{error}</p>}

      <Button
        variant="secondary"
        type="submit"
        className="w-full py-4"
        disabled={stage === "sending"}
      >
        {stage === "sending" ? "Sending…" : "Send Request"}
      </Button>
    </form>
  );
}
