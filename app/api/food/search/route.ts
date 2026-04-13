import { NextRequest, NextResponse } from "next/server";

// GET /api/food/search?q=oats
// Proxies Open Food Facts so the frontend does not call the external API directly
export async function GET(request: NextRequest) {
  try {
    const searchTerm = request.nextUrl.searchParams.get("q")?.trim();

    // Validate query
    if (!searchTerm) {
      return NextResponse.json(
        { error: "Missing search query." },
        { status: 400 }
      );
    }

    // Build Open Food Facts search URL
    const url =
      "https://world.openfoodfacts.org/cgi/search.pl?" +
      new URLSearchParams({
        search_terms: searchTerm,
        search_simple: "1",
        action: "process",
        json: "1",
        page_size: "12",
        fields: "product_name,brands,image_front_small_url,nutriments,code",
      }).toString();

    // Fetch external API data
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    // Handle external API failure
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch food data." },
        { status: 502 }
      );
    }

    const data = await response.json();

    // Return only the products array to the frontend
    return NextResponse.json({
      products: Array.isArray(data.products) ? data.products : [],
    });
  } catch (error) {
    // Catch unexpected server errors
    return NextResponse.json(
      { error: "Unexpected server error while searching foods." },
      { status: 500 }
    );
  }
}