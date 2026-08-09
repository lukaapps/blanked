import { sendAdminNotification } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { name, email, accountType, businessName, addressLine, addressSuburb } =
      await req.json();

    if (!name || !email || !accountType) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const address = [addressLine, addressSuburb].filter(Boolean).join(", ") || null;

    await sendAdminNotification(name, email, accountType, businessName, null, address);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Admin notification error:", error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
