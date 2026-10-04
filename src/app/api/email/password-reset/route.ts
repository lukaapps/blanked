import { createClient } from "@supabase/supabase-js";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    console.log("Password reset request for:", email);

    if (!email) {
      return Response.json({ error: "Missing email" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if user exists
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("email", email);

    console.log("Profile lookup for email:", email);
    console.log("Profile lookup result:", { count: profiles?.length, error: profileError });

    const profile = profiles?.[0];

    // Always return success for security (don't reveal if email exists)
    if (!profile) {
      console.log("Profile not found, returning early");
      return Response.json({ ok: true, message: "If that email exists, you'll receive a reset link" });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour expiry

    // Store hashed token in database (token sent to user in plaintext)
    const { error: tokenError } = await supabase
      .from("password_reset_tokens")
      .insert({
        email,
        token: tokenHash,
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error("Token storage error:", tokenError);
      return Response.json({ ok: true, message: "If that email exists, you'll receive a reset link" });
    }

    // Create reset link
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blanked.melbourne";
    const resetLink = `${siteUrl}/auth/reset-password?token=${token}`;

    const userName = profile.full_name || email.split("@")[0];

    // Send via Resend from jamie@blanked.melbourne
    console.log("Sending password reset email to:", email);
    const emailResult = await sendPasswordResetEmail(email, userName, resetLink);
    console.log("Email send result:", emailResult);

    return Response.json({ ok: true, message: "If that email exists, you'll receive a reset link" });
  } catch (error) {
    console.error("Password reset error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
