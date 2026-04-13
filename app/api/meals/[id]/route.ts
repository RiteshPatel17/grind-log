import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

// DELETE /api/meals/[id]
// Deletes one meal that belongs to the currently logged-in user
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Create server-side Supabase client
    const supabase = await createSupabaseServerClient();

    // Get the currently logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // Block unauthenticated users
    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    // Read meal id from dynamic route
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing meal id." },
        { status: 400 }
      );
    }

    // Delete only the meal that belongs to this user
    const { error } = await supabase
      .from("meals")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    // Handle database error
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    // Catch unexpected server-side errors
    return NextResponse.json(
      { error: "Unexpected server error while deleting meal." },
      { status: 500 }
    );
  }
}