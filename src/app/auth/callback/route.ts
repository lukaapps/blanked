import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Handles the redirect from Supabase confirmation/magic-link emails.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/profile";

  console.log("Auth callback - type:", type, "code:", !!code);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.log("Exchange code error:", error);
    } else {
      console.log("Exchange successful");
      // For password recovery, redirect to reset password page
      if (type === "recovery") {
        console.log("Redirecting to reset-password");
        return NextResponse.redirect(`${origin}/auth/reset-password`);
      }
      console.log("Redirecting to:", next);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=confirm`);
}
