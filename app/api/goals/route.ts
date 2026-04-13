import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

// GET /api/goals
// Returns the current logged-in user's goals
export async function GET(request: NextRequest) {
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
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    // Load this user's goals
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    // Handle database error
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return goals object or null
    return NextResponse.json({ goals: data ?? null });
  } catch (error) {
    // Catch unexpected server errors
    return NextResponse.json(
      { error: "Unexpected server error while loading goals." },
      { status: 500 }
    );
  }
}

// POST /api/goals
// Creates goals if they do not exist, otherwise updates them
export async function POST(request: NextRequest) {
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
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    // Read request body
    const body = await request.json();

    const {
      daily_calorie_goal,
      weekly_workout_goal,
      target_weight,
    } = body;

    // Validate required fields
    if (
      daily_calorie_goal === undefined ||
      weekly_workout_goal === undefined ||
      target_weight === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required goal fields." },
        { status: 400 }
      );
    }

    // Check whether this user already has a goals row
    const { data: existingGoals, error: checkError } = await supabase
      .from("goals")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 500 });
    }

    // Data to save
    const goalData = {
      user_id: user.id,
      daily_calorie_goal: Number(daily_calorie_goal),
      weekly_workout_goal: Number(weekly_workout_goal),
      target_weight: Number(target_weight),
    };

    // Update if existing, otherwise insert new row
    const result = existingGoals
      ? await supabase
          .from("goals")
          .update(goalData)
          .eq("user_id", user.id)
          .select()
          .single()
      : await supabase
          .from("goals")
          .insert(goalData)
          .select()
          .single();

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        goals: result.data,
        message: existingGoals
          ? "Goals updated successfully."
          : "Goals saved successfully.",
      },
      { status: existingGoals ? 200 : 201 }
    );
  } catch (error) {
    // Catch unexpected server errors
    return NextResponse.json(
      { error: "Unexpected server error while saving goals." },
      { status: 500 }
    );
  }
}