import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Server-side Supabase client for API routes / route handlers
// This lets backend route files access the logged-in user's session securely.
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        // Read cookies from the current request
        getAll() {
          return cookieStore.getAll();
        },

        // For now, we do not need to set cookies inside these route handlers
        setAll() {
          // No-op for route handlers right now
        },
      },
    }
  );
}