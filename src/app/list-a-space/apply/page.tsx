"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") +
    "-" +
    Math.random().toString(36).slice(2, 6)
  );
}

const steps = ["Space Basics", "Space Details", "Pricing & Availability", "Photos & Submission"];

export default function ListASpaceApplyPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    licence: "",
    description: "",
    minDuration: "1 day",
    dailyRate: "",
    availableFrom: "",
    availabilityNote: "",
    photos: 0,
    agreed: false,
  });

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const [needsAccount, setNeedsAccount] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const canSubmit = form.photos >= 3 && form.agreed && !submitting;

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setChecking(false);
      return;
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login?next=/list-a-space/apply");
        return;
      }
      setChecking(false);
    });
  }, [router]);

  async function handleSubmit() {
    setSubmitError(null);

    if (!isSupabaseConfigured()) {
      setSubmitted(true); // demo mode
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Spec: user is prompted to create a Landlord account at submission.
    if (!user) {
      setSubmitting(false);
      setNeedsAccount(true);
      return;
    }

    const { error } = await supabase.from("spaces").insert({
      landlord_id: user.id,
      slug: slugify(form.name || "space"),
      name: form.name,
      type: "Event", // confirmed with landlord during review call
      suburb: "Other", // confirmed during review call
      full_address: form.address,
      description: form.description,
      min_booking_duration: form.minDuration,
      daily_rate_landlord: form.dailyRate ? Number(form.dailyRate) : null,
      available_from: form.availableFrom || null,
      availability_note: form.availabilityNote || null,
      status: "pending",
    });
    setSubmitting(false);
    if (error) {
      setSubmitError(error.message);
      return;
    }
    setSubmitted(true);
  }

  if (checking) return null;

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-6 pb-24 pt-32 text-center">
        <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">
          Thanks — we&rsquo;ve got your space.
        </h1>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
          Pending review
        </p>
        <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-ink/60">
          We&rsquo;ll review {form.name || "your space"} and follow up within 3
          business days. Check your email for confirmation — we&rsquo;ll be in
          touch to gather a few more details before it goes live.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-20">
      <h1 className="text-3xl font-bold uppercase tracking-tight sm:text-4xl">
        List your space
      </h1>

      <div className="mt-12">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
            Step {step + 1} of {steps.length}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
            {steps[step]}
          </p>
        </div>
        <div className="mt-3 flex gap-1.5">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 ${i <= step ? "bg-accent" : "bg-divider"}`}
            />
          ))}
        </div>

        <div className="mt-6 bg-white p-6 sm:p-10">
          {step === 0 && (
            <div className="flex flex-col gap-6">
              <Field label="Space Name">
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. The Loft on 5th"
                  className="input"
                />
              </Field>
              <Field label="Full Address" hint="Internal only — not shown publicly until booking confirmed.">
                <input
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="Street address, suburb"
                  className="input"
                />
              </Field>
              <Field label="Licence">
                <select
                  value={form.licence}
                  onChange={(e) => update("licence", e.target.value)}
                  className="input"
                >
                  <option value="">Select licence type</option>
                  <option>No licence</option>
                  <option>On-premises licence</option>
                  <option>General licence</option>
                  <option>Not sure</option>
                </select>
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-6">
              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Describe your space to hospitality talent. What makes it special?"
                  rows={5}
                  className="input"
                />
              </Field>
              <Field label="Minimum Booking Duration">
                <select
                  value={form.minDuration}
                  onChange={(e) => update("minDuration", e.target.value)}
                  className="input"
                >
                  <option>1 day</option>
                  <option>3 days</option>
                  <option>1 week</option>
                  <option>1 month</option>
                  <option>3 months</option>
                </select>
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-6">
              <Field label="Daily Rate" hint="How much you want to receive per day.">
                <input
                  type="number"
                  value={form.dailyRate}
                  onChange={(e) => update("dailyRate", e.target.value)}
                  placeholder="500"
                  className="input"
                />
              </Field>
              <Field label="Available From">
                <input
                  type="date"
                  value={form.availableFrom}
                  onChange={(e) => update("availableFrom", e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Or describe your availability">
                <textarea
                  value={form.availabilityNote}
                  onChange={(e) => update("availabilityNote", e.target.value)}
                  placeholder="e.g. Free for takeovers Tuesday–Thursday night and all day Sunday"
                  rows={3}
                  className="input"
                />
              </Field>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-6">
              <Field label="Photos" hint="Minimum 3, maximum 10.">
                <button
                  type="button"
                  onClick={() => update("photos", Math.min(form.photos + 1, 10))}
                  className="flex h-32 w-32 flex-col items-center justify-center gap-2 border border-dashed border-divider text-xs text-ink/40 transition-colors hover:border-ink hover:text-ink"
                >
                  <span className="text-xl">+</span>
                  Upload
                </button>
                <p className="mt-2 text-xs text-ink/40">
                  {form.photos} photo{form.photos === 1 ? "" : "s"} added
                </p>
              </Field>
              <label className="flex items-start gap-3 text-sm text-ink/70">
                <input
                  type="checkbox"
                  checked={form.agreed}
                  onChange={(e) => update("agreed", e.target.checked)}
                  className="mt-1 accent-accent"
                />
                I confirm this space is available for short-term hire and I
                have the right to list it.
              </label>
            </div>
          )}
        </div>

        <div className="mt-1 flex items-stretch gap-1">
          {step > 0 && (
            <button
              onClick={back}
              className="bg-white px-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/50 transition-colors hover:text-ink"
            >
              ← Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button
              onClick={next}
              className="flex-1 bg-ink py-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-background transition-opacity hover:opacity-90"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex-1 bg-ink py-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-background transition-opacity hover:opacity-90 disabled:opacity-30"
            >
              {submitting ? "Submitting…" : "✓ Submit My Space"}
            </button>
          )}
        </div>

        {submitError && (
          <p className="mt-4 text-sm text-accent">{submitError}</p>
        )}

        {needsAccount && (
          <div className="mt-4 bg-white p-6">
            <p className="text-sm font-medium">
              One last thing — create your landlord account.
            </p>
            <p className="mt-1 text-sm text-ink/50">
              Your listing needs an account so you can manage booking
              requests. Sign up, confirm your email, then come back and
              submit.
            </p>
            <div className="mt-4 flex gap-2">
              <Link
                href="/signup?type=landlord"
                className="bg-accent px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90"
              >
                Create Landlord Account
              </Link>
              <Link
                href="/login?next=/list-a-space/apply"
                className="border border-ink px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-background"
              >
                Log In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
        {label}
      </label>
      {hint && <p className="mt-1 text-xs text-ink/35">{hint}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}
