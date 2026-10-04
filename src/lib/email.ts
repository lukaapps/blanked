import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(
  email: string,
  name: string,
  confirmationLink: string
) {
  return resend.emails.send({
    from: "jamie@blanked.melbourne",
    to: email,
    subject: "Confirm your Blanked account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #442220;">Welcome to Blanked, ${name}!</h2>
        <p>Click the button below to confirm your email address and activate your account.</p>
        <a href="${confirmationLink}" style="display: inline-block; background: #442220; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Confirm Email
        </a>
        <p style="color: #999; font-size: 12px;">Or copy this link: <code>${confirmationLink}</code></p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">© 2026 Blanked. Melbourne's marketplace for short-term hospitality space.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetLink: string
) {
  const url = new URL(resetLink);
  // Supabase puts token in query string - convert to hash for our reset page
  const searchParams = new URLSearchParams(url.search);
  const accessToken = searchParams.get("access_token") || "";
  const type = searchParams.get("type") || "";
  const resetPageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password#access_token=${accessToken}&type=${type}`;

  return resend.emails.send({
    from: "jamie@blanked.melbourne",
    to: email,
    subject: "Reset your Blanked password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <h2 style="color: #442220;">Reset your password</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your Blanked password. Click the button below to set a new password.</p>
        <a href="${resetPageUrl}" style="display: inline-block; background: #442220; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Reset Password
        </a>
        <p style="color: #999; font-size: 12px;">Or copy this link: <code>${resetPageUrl}</code></p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this, you can ignore this email.</p>
        <p style="color: #999; font-size: 12px;">© 2026 Blanked. Melbourne's marketplace for short-term hospitality space.</p>
      </div>
    `,
  });
}

export async function sendAdminNotification(
  name: string,
  email: string,
  accountType: "chef" | "landlord" | "customer",
  businessName?: string | null,
  phone?: string | null,
  address?: string | null
) {
  const typeLabel = accountType === "chef" ? "Talent/Brand" : accountType === "landlord" ? "Landlord" : "Customer";

  return resend.emails.send({
    from: "jamie@blanked.melbourne",
    to: process.env.ADMIN_EMAIL || "admin@blanked.com",
    subject: `🎉 New Signup: ${name} (${typeLabel})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #442220;">New Account Created</h2>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 4px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Type:</strong> ${typeLabel}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${businessName ? `<p><strong>Business Name:</strong> ${businessName}</p>` : ""}
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
          ${address ? `<p><strong>Address:</strong> ${address}</p>` : ""}
        </div>

        <p style="color: #666; font-size: 12px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/users" style="color: #442220;">View in admin dashboard</a>
        </p>

        <p style="color: #999; font-size: 12px; margin-top: 30px;">© 2026 Blanked</p>
      </div>
    `,
  });
}
