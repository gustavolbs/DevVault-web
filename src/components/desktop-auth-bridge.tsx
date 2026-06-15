"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function DesktopAuthBridge({ callbackUrl, state }: { callbackUrl: string; state: string }) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void createClient().auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      const token = data.session?.access_token;
      if (sessionError || !token) {
        setError("Your browser session could not be transferred to EnvDock. Sign in again.");
        return;
      }
      const callback = new URL(callbackUrl);
      callback.searchParams.set("token", token);
      callback.searchParams.set("state", state);
      window.location.assign(callback.toString());
    });
    return () => { active = false; };
  }, [callbackUrl, state]);

  const cancelUrl = `${callbackUrl}?error=access_denied&state=${encodeURIComponent(state)}`;
  return <main className="grid min-h-screen place-items-center px-6"><section className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-sm"><Loader2 className="mx-auto size-7 animate-spin text-primary" /><h1 className="mt-5 text-2xl font-semibold">Returning to EnvDock</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Your account token is being handed directly to the desktop app. It is not shown on this page.</p>{error && <div role="alert" className="mt-5 rounded-lg border border-danger/25 bg-danger/5 p-3 text-sm text-danger">{error}</div>}<div className="mt-6 flex justify-center gap-3"><Button asChild variant="outline"><a href={cancelUrl}>Cancel</a></Button>{error && <Button asChild><Link href={`/login?next=${encodeURIComponent(`/auth/desktop?state=${state}`)}`}>Sign in again</Link></Button>}</div></section></main>;
}
