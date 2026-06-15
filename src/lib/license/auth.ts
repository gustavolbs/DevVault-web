import type { NextRequest } from "next/server";
import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function getApiUser(request: NextRequest): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;
  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) {
    const token = authorization.slice(7).trim();
    if (!token) return null;
    const { data, error } = await createAdminClient().auth.getUser(token);
    return error ? null : data.user;
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims) return null;
  const { data, error } = await supabase.auth.getUser();
  return error ? null : data.user;
}
