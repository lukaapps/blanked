import { sendConfirmationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email, name, confirmationLink } = await req.json();

    if (!email || !name || !confirmationLink) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    await sendConfirmationEmail(email, name, confirmationLink);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Confirmation email error:", error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
