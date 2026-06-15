import { redirect } from "next/navigation";
import { DesktopAuthBridge } from "@/components/desktop-auth-bridge";
import { getDesktopCallbackUrl } from "@/lib/auth-redirect";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function DesktopAuthPage({ searchParams }: { searchParams: Promise<{ state?: string; redirect_uri?: string }> }) {
  const { state, redirect_uri: redirectUri } = await searchParams;
  if (!state || state.length < 16 || state.length > 256) redirect("/login?error=desktop_state");
  if (!isSupabaseConfigured()) redirect("/login?error=configuration");

  const callbackUrl = getDesktopCallbackUrl();
  if (redirectUri && !matchesCallback(redirectUri, callbackUrl)) redirect("/login?error=desktop_callback");

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) {
    const next = `/auth/desktop?state=${encodeURIComponent(state)}&redirect_uri=${encodeURIComponent(callbackUrl)}`;
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  return <DesktopAuthBridge callbackUrl={callbackUrl} state={state} />;
}

function matchesCallback(value: string, expected: string): boolean {
  try { return new URL(value).toString() === expected; } catch { return false; }
}
