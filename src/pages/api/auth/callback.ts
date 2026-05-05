/**
 * api/auth/callback.ts — Receives the session from the client after login
 * and sets proper server-side cookies via @supabase/ssr.
 * This bridges the gap between client-side auth and server-side middleware.
 */
export const prerender = false;

import type { APIRoute } from "astro";
import { createClient } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const body = await request.json();
  const { access_token, refresh_token } = body;

  if (!access_token || !refresh_token) {
    return new Response(JSON.stringify({ error: "Missing tokens" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Create a server-side Supabase client that will write cookies properly
  const supabase = createClient(cookies, request.headers.get("cookie"));

  // setSession sets the session AND triggers setAll cookies via @supabase/ssr
  const { error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
