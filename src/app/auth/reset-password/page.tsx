"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error: resetError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="mx-auto max-w-md px-6 pb-24 pt-32 text-center">
        <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
        <h1 className="mt-6 text-4xl font-medium tracking-tight">
          Password reset
        </h1>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
          Success
        </p>
        <p className="mt-6 text-sm leading-relaxed text-ink/60">
          Your password has been reset. You can now{" "}
          <a href="/login" className="text-accent hover:underline">
            log in
          </a>{" "}
          with your new password.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 pb-24 pt-24">
      <h1 className="text-6xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl">
        Reset password
      </h1>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink/40">
        Create a new password
      </p>

      <form onSubmit={handleResetPassword} className="mt-10 flex flex-col gap-5 bg-white p-6 sm:p-8">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
            New password
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

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
            Confirm password
          </label>
          <input
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input mt-2"
            placeholder="Confirm your password"
          />
        </div>

        {error && <p className="text-sm text-accent">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-[#442220] py-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {loading ? "Resetting…" : "Reset Password"}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/60">
        Remember your password?{" "}
        <a href="/login" className="text-accent hover:underline">
          Log in
        </a>
      </p>
    </div>
  );
}
