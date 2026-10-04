import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!password || password.length < 8) {
      return Response.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json(
        { error: "Missing authentication token" },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);

    // Create a client with the user's token to update their password
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // Update the user's password using their token
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      return Response.json(
        { error: updateError.message },
        { status: 400 }
      );
    }

    return Response.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    return Response.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
