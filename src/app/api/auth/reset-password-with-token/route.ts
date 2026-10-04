import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return Response.json({ error: "Missing token or password" }, { status: 400 });
    }

    if (password.length < 8) {
      return Response.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Look up the reset token
    const { data: resetTokenRecord, error: lookupError } = await supabase
      .from("password_reset_tokens")
      .select("email, expires_at")
      .eq("token", token)
      .single();

    if (lookupError || !resetTokenRecord) {
      return Response.json(
        { error: "Invalid reset token" },
        { status: 400 }
      );
    }

    // Check if token has expired
    if (new Date(resetTokenRecord.expires_at) < new Date()) {
      return Response.json(
        { error: "Reset token has expired" },
        { status: 400 }
      );
    }

    // Get the user by email
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
    const user = users?.find(u => u.email === resetTokenRecord.email);

    if (!user) {
      return Response.json(
        { error: "User not found" },
        { status: 400 }
      );
    }

    // Update the user's password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password }
    );

    if (updateError) {
      return Response.json(
        { error: updateError.message || "Failed to update password" },
        { status: 400 }
      );
    }

    // Delete the used token
    await supabase
      .from("password_reset_tokens")
      .delete()
      .eq("token", token);

    return Response.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return Response.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
