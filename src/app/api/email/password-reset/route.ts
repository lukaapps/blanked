import { createClient } from "@/lib/supabase/client";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: "Missing email" }, { status: 400 });
    }

    const supabase = createClient();

    // Use Supabase to generate reset link, but send via Resend
    const { error: resetError, data } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?type=recovery`,
      }
    );

    if (resetError) {
      // Don't expose whether email exists or not (security)
      return Response.json({ ok: true, message: "If that email exists, you'll receive a reset link" });
    }

    // Send via Resend instead of Supabase
    const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?type=recovery`;
    await sendPasswordResetEmail(email, "User", resetLink);

    return Response.json({ ok: true, message: "If that email exists, you'll receive a reset link" });
  } catch (error) {
    console.error("Password reset error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
