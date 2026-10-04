"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    // Reset link token is in hash - ready immediately
    setSessionReady(true);
  }, []);

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!sessionReady) return;

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

    // Extract token from hash
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const token = hashParams.get("access_token");

    if (!token) {
      setError("Reset link is invalid or expired");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Failed to reset password");
        return;
      }

      setSuccess(true);
    } catch (err) {
      setLoading(false);
      setError("An error occurred. Please try again.");
      console.error("Reset error:", err);
    }
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
        {!sessionReady && (
          <p className="text-sm text-ink/50">Verifying reset link...</p>
        )}

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/40">
            New password
          </label>
          <input
            type="password"
            required
            minLength={8}
            disabled={!sessionReady}
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
            disabled={!sessionReady}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input mt-2"
            placeholder="Confirm your password"
          />
        </div>

        {error && <p className="text-sm text-accent">{error}</p>}

        <button
          type="submit"
          disabled={loading || !sessionReady}
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
