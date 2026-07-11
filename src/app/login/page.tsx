"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/profile";
  const confirmError = searchParams.get("error") === "confirm";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push(next);
    router.refresh();
  }

  async function handleForgotPassword() {
    if (!email) {
      setError("Enter your email above first, then click forgot password.");
      return;
    }
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/profile`,
    });
    if (error) setError(error.message);
    else setResetSent(true);
  }

  return (
    <div className="mx-auto max-w-md px-6 pb-24 pt-24">
      <h1 className="text-4xl font-medium tracking-tight">Log in</h1>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
        Welcome back to Blanked
      </p>

      {confirmError && (
        <p className="mt-6 bg-white p-4 text-sm text-accent">
          That confirmation link didn&rsquo;t work — it may have expired. Try
          logging in, or sign up again.
        </p>
      )}
      {resetSent && (
        <p className="mt-6 bg-white p-4 text-sm text-ink/70">
          Password reset email sent — check your inbox.
        </p>
      )}

      <form onSubmit={handleLogin} className="mt-10 flex flex-col gap-5 bg-white p-6 sm:p-8">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input mt-2"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-sm text-accent">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-ink py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-background transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {loading ? "Logging in…" : "Log In"}
        </button>

        <button
          type="button"
          onClick={handleForgotPassword}
          className="text-left text-xs text-ink/50 transition-colors hover:text-accent"
        >
          Forgot password?
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        New to Blanked?{" "}
        <Link href="/signup" className="text-accent hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
