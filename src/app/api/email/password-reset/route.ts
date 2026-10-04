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

    // Extract token from Supabase link and build our own callback URL
    const supabaseUrl = new URL(linkData.properties.action_link);
    const token = supabaseUrl.searchParams.get("token") || "";
    const customLink = `${siteUrl}/auth/callback?code=${token}&type=recovery`;

    // Send via Resend from jamie@blanked.melbourne
    await sendPasswordResetEmail(email, "User", customLink);

    return Response.json({ ok: true, message: "If that email exists, you'll receive a reset link" });
  } catch (error) {
    console.error("Password reset error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
