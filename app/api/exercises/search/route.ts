import { NextRequest, NextResponse } from "next/server";

// GET /api/exercises/search?q=bench
// Searches ExerciseDB and returns a simplified exercise list
export async function GET(request: NextRequest) {
  try {
    const searchTerm = request.nextUrl.searchParams.get("q")?.trim();

    if (!searchTerm) {
      return NextResponse.json(
        { error: "Missing search query." },
        { status: 400 }
      );
    }

    const apiKey = process.env.EXERCISEDB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "ExerciseDB API key is missing." },
        { status: 500 }
      );
    }

    const url = `https://exercisedb.p.rapidapi.com/exercises/name/${encodeURIComponent(
      searchTerm
    )}?limit=12`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch exercises from ExerciseDB." },
        { status: 502 }
      );
    }

    const data = await response.json();

    const exercises = Array.isArray(data)
      ? data.map((item: any) => ({
          id: item.id,
          name: item.name,
          muscle_group: item.bodyPart || item.target || "Unknown",
          equipment: item.equipment || "Unknown",
          exercise_type: "reps",
          bodyPart: item.bodyPart || "",
          target: item.target || "",
          gifUrl: item.gifUrl || "",
        }))
      : [];

    return NextResponse.json({ exercises });
  } catch (error) {
    return NextResponse.json(
      { error: "Unexpected server error while searching exercises." },
      { status: 500 }
    );
  }
}