import { createClient } from "@supabase/supabase-js";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: "Missing email" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

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

    // Try to get user's name from profile, fall back to email username
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("email", email)
      .maybeSingle();

    const userName = profile?.full_name || email.split("@")[0];

    // Create reset link
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blanked.melbourne";
    const resetLink = `${siteUrl}/auth/reset-password?token=${token}`;

    // Send via Resend from jamie@blanked.melbourne
    await sendPasswordResetEmail(email, userName, resetLink);

    return Response.json({ ok: true, message: "If that email exists, you'll receive a reset link" });
  } catch (error) {
    console.error("Password reset error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
