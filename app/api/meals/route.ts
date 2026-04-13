import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

// GET /api/meals?date=YYYY-MM-DD
// Returns meals for the logged-in user.
// If a date is provided, it filters meals by that date.
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
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    // Optional date filter from the query string
    const date = request.nextUrl.searchParams.get("date");

    // Base query: only this user's meals
    let query = supabase
      .from("meals")
      .select("*")
      .eq("user_id", user.id)
      .order("meal_date", { ascending: false })
      .order("created_at", { ascending: false });

    // Apply date filter if present
    if (date) {
      query = query.eq("meal_date", date);
    }

    const { data, error } = await query;

    // Handle database query error
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Return meals array
    return NextResponse.json({ meals: data ?? [] });
  } catch (error) {
    // Catch unexpected server-side errors
    return NextResponse.json(
      { error: "Unexpected server error while loading meals." },
      { status: 500 }
    );
  }
}

// POST /api/meals
// Creates a new meal for the logged-in user
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
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    // Read request body
    const body = await request.json();

    const {
      meal_name,
      meal_type,
      calories,
      protein,
      carbs,
      fat,
      meal_date,
    } = body;

    // Validate required fields
    if (
      !meal_name ||
      !meal_type ||
      calories === undefined ||
      protein === undefined ||
      carbs === undefined ||
      fat === undefined ||
      !meal_date
    ) {
      return NextResponse.json(
        { error: "Missing required meal fields." },
        { status: 400 }
      );
    }

    // Insert meal into Supabase
    const { data, error } = await supabase
      .from("meals")
      .insert({
        user_id: user.id,
        meal_name: String(meal_name).trim(),
        meal_type: String(meal_type).trim(),
        calories: Number(calories),
        protein: Number(protein),
        carbs: Number(carbs),
        fat: Number(fat),
        meal_date,
      })
      .select()
      .single();

    // Handle database insert error
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Return created meal
    return NextResponse.json({ meal: data }, { status: 201 });
  } catch (error) {
    // Catch unexpected server-side errors
    return NextResponse.json(
      { error: "Unexpected server error while saving meal." },
      { status: 500 }
    );
  }
}