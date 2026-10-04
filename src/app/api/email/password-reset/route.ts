import { createClient } from "@supabase/supabase-js";
import { sendPasswordResetEmail } from "@/lib/email";

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

    // Use admin API to generate reset link without sending
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blanked.melbourne";
    console.log("Password reset redirectTo:", siteUrl);

    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: `${siteUrl}/auth/callback?type=recovery`,
      },
    });

    if (linkError || !linkData?.properties?.action_link) {
      // Don't expose whether email exists or not (security)
      return Response.json({ ok: true, message: "If that email exists, you'll receive a reset link" });
    }

    // Use Supabase's action_link directly - Supabase will handle PKCE and session establishment,
    // then redirect to our callback with the session already created
    const resetLink = linkData.properties.action_link;
    console.log("Reset link:", resetLink);

    // Fetch user's name from profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("email", email)
      .single();

    const userName = profile?.full_name || email.split("@")[0];

    // Send via Resend from jamie@blanked.melbourne
    await sendPasswordResetEmail(email, userName, resetLink);

    return Response.json({ ok: true, message: "If that email exists, you'll receive a reset link" });
  } catch (error) {
    console.error("Password reset error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
