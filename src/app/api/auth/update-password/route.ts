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

    // Create admin client to update user without session
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get the user from the request context
    // For now, we'll use the service role to update via email
    // This is called after the user has verified the reset link
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return Response.json(
        { error: "Missing authentication token" },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);

    // Use the token to get the user and update password
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserByToken(token);

    if (userError || !user) {
      return Response.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Update the user's password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password }
    );

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
