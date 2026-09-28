import { createClient } from "@/lib/supabase/server";
import { sendConfirmationEmail, sendAdminNotification } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const {
      email,
      password,
      name,
      accountType,
      businessName,
      role,
      website,
      instagram,
      addressLine,
      addressSuburb,
      addressState,
      addressPostcode,
      howHeard,
    } = await req.json();

    if (!email || !password || !name || !accountType) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Use Admin API to create user without auto-sending email
    const { data, error: signupError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Don't auto-send Supabase email
      user_metadata: {
        name,
        account_type: accountType,
        how_heard: howHeard || null,
        ...(accountType !== "customer"
          ? {
              business_name: businessName || null,
              role: role || null,
              website: website || null,
              instagram: instagram || null,
              address_line: addressLine || null,
              address_suburb: addressSuburb || null,
              address_state: addressState || null,
              address_postcode: addressPostcode || null,
            }
          : {}),
      },
    });

    if (signupError) {
      return Response.json({ error: signupError.message }, { status: 400 });
    }

    // Send confirmation and admin notification emails via Resend
    if (data.user?.email) {
      try {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const confirmationLink = `${siteUrl}/auth/callback?next=/profile`;

        await Promise.all([
          sendConfirmationEmail(email, name, confirmationLink),
          sendAdminNotification(name, email, accountType as "chef" | "landlord" | "customer", businessName, null, addressLine),
        ]);
      } catch (emailError) {
        console.error("Failed to send emails:", emailError);
        // Don't fail signup if emails fail
      }
    }

    return Response.json({
      success: true,
      user: data.user,
      message: "Signup successful. Check your email for confirmation link."
    });
  } catch (error) {
    console.error("Signup error:", error);
    return Response.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
