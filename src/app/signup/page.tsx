"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PhotoUploader } from "@/components/photo-uploader";
import { fileToDataUrl } from "@/lib/demo-profile";

type AccountType = "chef" | "landlord" | "customer";

const roleOptions = ["Owner", "Manager", "Head Chef", "Event Coordinator", "Other"];
const hearAboutOptions = [
  "Instagram",
  "Word of mouth",
  "Google search",
  "A landlord/talent I know",
  "Press/media",
  "Other",
];

function SignupForm() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const initialType: AccountType | null =
    typeParam === "landlord"
      ? "landlord"
      : typeParam === "customer"
      ? "customer"
      : typeParam === "chef"
      ? "chef"
      : null;

  const [accountType, setAccountType] = useState<AccountType | null>(initialType);
  const isBusiness = accountType !== null && accountType !== "customer";

  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [role, setRole] = useState("");
  const [roleOther, setRoleOther] = useState("");
  const [website, setWebsite] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [addressSuburb, setAddressSuburb] = useState("");
  const [addressState, setAddressState] = useState("");
  const [addressPostcode, setAddressPostcode] = useState("");
  const [howHeard, setHowHeard] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!accountType) return;
    setError(null);
    setLoading(true);
    const finalRole = role === "Other" ? roleOther.trim() || "Other" : role;
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          account_type: accountType,
          how_heard: howHeard || null,
          ...(isBusiness
            ? {
                business_name: businessName || null,
                role: finalRole || null,
                website: website || null,
                address_line: addressLine || null,
                address_suburb: addressSuburb || null,
                address_state: addressState || null,
                address_postcode: addressPostcode || null,
                photos,
              }
            : {}),
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/profile`,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-md px-6 pb-24 pt-32 text-center">
        <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
        <h1 className="mt-6 text-4xl font-medium tracking-tight">
          Check your email
        </h1>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
          One more step
        </p>
        <p className="mt-6 text-sm leading-relaxed text-ink/60">
          We&rsquo;ve sent a confirmation link to{" "}
          <strong className="text-ink">{email}</strong>. Click it to activate
          your{" "}
          {accountType === "chef"
            ? "Talent / Brand"
            : accountType === "landlord"
            ? "Landlord"
            : "Customer"}{" "}
          account —
          you&rsquo;ll land straight in your profile.
        </p>
      </div>
    );
  }

  const typeTile = (value: AccountType, label: string, hint: string) => (
    <button
      type="button"
      onClick={() => setAccountType(value)}
      className={`flex min-h-[200px] flex-1 flex-col items-start justify-end gap-2 border p-6 text-left transition-colors sm:p-8 ${
        accountType === value
          ? "border-[#442220] bg-[#442220] text-white"
          : "border-divider bg-white text-ink hover:border-ink"
      }`}
    >
      <span className="text-xl font-bold uppercase tracking-tight sm:text-2xl">
        {label}
      </span>
      <span
        className={`text-sm ${
          accountType === value ? "text-white/70" : "text-ink/50"
        }`}
      >
        {hint}
      </span>
    </button>
  );

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 pt-24">
      <h1 className="text-6xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl">
        Sign up
      </h1>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
        Join Blanked
      </p>

      <div className="mt-10">
        <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
          I am a…
        </label>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {typeTile("chef", "Talent / Brand", "I want to find and book spaces")}
          {typeTile("landlord", "Landlord", "I have a space to list")}
          {typeTile("customer", "Customer", "I want to find events in the city")}
        </div>
      </div>

      {accountType && (
      <form
        onSubmit={handleSignup}
        className="mt-6 grid grid-cols-1 gap-5 bg-white p-6 sm:grid-cols-2 sm:p-8"
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

        <div className="sm:col-span-2">
          <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
            Password
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input mt-2"
            placeholder="At least 8 characters"
          />
        </div>

        {isBusiness && (
          <>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
                Display / Brand Name
              </label>
              <input
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="input mt-2"
                placeholder="Your display or brand name"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
                Photos
              </label>
              <div className="mt-2">
                <PhotoUploader photos={photos} onChange={setPhotos} uploadFile={fileToDataUrl} />
              </div>
            </div>

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
          </>
        )}

        <div className="sm:col-span-2">
          <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
            How did you hear about us?
          </label>
          <select
            value={howHeard}
            onChange={(e) => setHowHeard(e.target.value)}
            className="input mt-2"
          >
            <option value="">Select an option</option>
            {hearAboutOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-accent sm:col-span-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-[#442220] py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-opacity hover:opacity-90 disabled:opacity-40 sm:col-span-2"
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>
      )}

      <p className="mt-6 text-sm text-ink/60">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
