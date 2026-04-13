import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

// GET /api/profile
// Returns the current logged-in user's profile
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data ?? null });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected server error while loading profile." },
      { status: 500 }
    );
  }
}

// POST /api/profile
// Creates profile if it does not exist, otherwise updates it
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();

    const {
      full_name,
      age,
      height,
      current_weight,
      target_weight,
    } = body;

    const { data: existingProfile, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    const profileData = {
      user_id: user.id,
      full_name: full_name ? String(full_name).trim() : "",
      age: age !== undefined && age !== "" ? Number(age) : null,
      height: height !== undefined && height !== "" ? Number(height) : null,
      current_weight:
        current_weight !== undefined && current_weight !== ""
          ? Number(current_weight)
          : null,
      target_weight:
        target_weight !== undefined && target_weight !== ""
          ? Number(target_weight)
          : null,
    };

    const result = existingProfile
      ? await supabase
          .from("profiles")
          .update(profileData)
          .eq("user_id", user.id)
          .select()
          .single()
      : await supabase
          .from("profiles")
          .insert(profileData)
          .select()
          .single();

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        profile: result.data,
        message: existingProfile
          ? "Profile updated successfully."
          : "Profile saved successfully.",
      },
      { status: existingProfile ? 200 : 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected server error while saving profile." },
      { status: 500 }
    );
  }
}