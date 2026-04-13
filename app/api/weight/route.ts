import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

// GET /api/weight
// Returns all weight logs for the current logged-in user
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
      .from("weight_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("log_date", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ weightLogs: data ?? [] });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected server error while loading weight logs." },
      { status: 500 }
    );
  }
}

// POST /api/weight
// Creates a new weight log for the current logged-in user
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
    const { weight, log_date } = body;

    if (weight === undefined || !log_date) {
      return NextResponse.json(
        { error: "Missing required weight fields." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("weight_logs")
      .insert({
        user_id: user.id,
        weight: Number(weight),
        log_date,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ weightLog: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected server error while saving weight log." },
      { status: 500 }
    );
  }
}