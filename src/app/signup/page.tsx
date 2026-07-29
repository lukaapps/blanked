"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type AccountType = "chef" | "landlord" | "customer";

function SignupForm() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const initialType: AccountType =
    typeParam === "landlord"
      ? "landlord"
      : typeParam === "customer"
      ? "customer"
      : "chef";

  const [accountType, setAccountType] = useState<AccountType>(initialType);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, account_type: accountType },
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

  const typeButton = (value: AccountType, label: string, hint: string) => (
    <button
      type="button"
      onClick={() => setAccountType(value)}
      className={`flex-1 border px-4 py-4 text-left transition-colors ${
        accountType === value
          ? "border-[#442220] bg-[#442220] text-white"
          : "border-divider bg-white text-ink hover:border-ink"
      }`}
    >
      <span className="block text-[11px] font-semibold uppercase tracking-[0.2em]">
        {label}
      </span>
      <span
        className={`mt-1 block text-xs ${
          accountType === value ? "text-white/70" : "text-ink/50"
        }`}
      >
        {hint}
      </span>
    </button>
  );

  return (
    <div className="mx-auto max-w-md px-6 pb-24 pt-24">
      <h1 className="text-6xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl">
        Sign up
      </h1>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
        Join Blanked
      </p>

      <form onSubmit={handleSignup} className="mt-10 flex flex-col gap-5 bg-white p-6 sm:p-8">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
            I am a…
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            {typeButton("chef", "Talent / Brand", "I want to find and book spaces")}
            {typeButton("landlord", "Landlord", "I have a space to list")}
            {typeButton("customer", "Customer", "I want to find events in the city")}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
            {accountType === "landlord" ? "Name / Business name" : "Name"}
          </label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input mt-2"
            placeholder={accountType === "landlord" ? "Business name" : "Your name"}
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

        <div>
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

        {error && <p className="text-sm text-accent">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-[#442220] py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

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
