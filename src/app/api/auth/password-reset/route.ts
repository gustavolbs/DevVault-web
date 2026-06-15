import { NextResponse } from "next/server";
import { apiSecurityErrorResponse, enforceRateLimit, readJsonBody } from "@/lib/api-security";
import { getTrustedOrigin } from "@/lib/request-origin";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { logServerError } from "@/lib/server-log";

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) return NextResponse.json({ error: "Authentication is not configured." }, { status: 503 });
    const body = await readJsonBody(request, 4096);
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email || email.length > 320) return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    await enforceRateLimit("password-reset", email, 5, 3600);
    const redirectTo = `${getTrustedOrigin(request)}/auth/callback?next=${encodeURIComponent("/reset-password")}`;
    const { error } = await (await createClient()).auth.resetPasswordForEmail(email, { redirectTo });
    if (error) logServerError("Supabase password reset request failed", error);
    return NextResponse.json({ accepted: true });
  } catch (error) {
    const securityResponse = apiSecurityErrorResponse(error);
    if (securityResponse) return securityResponse;
    logServerError("Password reset request failed", error);
    return NextResponse.json({ error: "Unable to request a password reset." }, { status: 500 });
  }
}
