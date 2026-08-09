import { sendConfirmationEmail, sendAdminNotification } from "@/lib/email";

async function handleEmailTest(type: string, email: string, name: string) {
  if (type === "confirmation") {
    if (!email || !name) {
      return { error: "Missing email or name", status: 400 };
    }
    await sendConfirmationEmail(
      email,
      name,
      `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/profile`
    );
    return { ok: true, message: "Confirmation email sent" };
  }

  if (type === "admin") {
    if (!email || !name) {
      return { error: "Missing email or name", status: 400 };
    }
    await sendAdminNotification(name, email, "chef", "Test Business");
    return { ok: true, message: "Admin notification sent" };
  }

  return { error: "Invalid type", status: 400 };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const email = searchParams.get("email");
    const name = searchParams.get("name");

    if (!type || !email || !name) {
      return Response.json(
        { error: "Missing parameters: type, email, name" },
        { status: 400 }
      );
    }

    const result = await handleEmailTest(type, email, name);
    return Response.json(result, { status: result.status || 200 });
  } catch (error) {
    console.error("Test email error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { type, email, name } = await req.json();

    if (type === "confirmation") {
      if (!email || !name) {
        return Response.json({ error: "Missing email or name" }, { status: 400 });
      }
      await sendConfirmationEmail(
        email,
        name,
        `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/profile`
      );
      return Response.json({ ok: true, message: "Confirmation email sent" });
    }

    if (type === "admin") {
      if (!email || !name) {
        return Response.json({ error: "Missing email or name" }, { status: 400 });
      }
      await sendAdminNotification(name, email, "chef", "Test Business");
      return Response.json({ ok: true, message: "Admin notification sent" });
    }

    return Response.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("Test email error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
