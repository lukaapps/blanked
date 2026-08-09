import { createClient } from "@supabase/supabase-js";
import { sendConfirmationEmail, sendAdminNotification } from "@/lib/email";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const event = JSON.parse(body);
    const { type, data } = event;

    if (type === "user.sign_up") {
      const userId = data.id;
      const email = data.email;
      const name = data.user_metadata?.name || "User";
      const accountType = data.user_metadata?.account_type || "chef";
      const businessName = data.user_metadata?.business_name || null;
      const phone = data.user_metadata?.phone || null;
      const addressLine = data.user_metadata?.address_line || null;
      const addressSuburb = data.user_metadata?.address_suburb || null;
      const address = [addressLine, addressSuburb].filter(Boolean).join(", ") || null;

      // Generate confirmation link
      // Supabase will send the confirmation email, but we'll send our own via Resend
      const confirmationToken = data.confirmation_token || data.email_confirm_token;
      const confirmationLink = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?token=${confirmationToken}&type=signup`;

      // Send confirmation email via Resend
      await sendConfirmationEmail(email, name, confirmationLink);

      // Send admin notification
      await sendAdminNotification(name, email, accountType, businessName, phone, address);

      console.log(`✅ Emails sent for new signup: ${email}`);
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: "Webhook failed" }), { status: 500 });
  }
}
