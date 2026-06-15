"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Code2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

type FormState = { type: "error" | "success"; message: string } | null;

function safeNextPath(next?: string) {
  return next?.startsWith("/") && !next.startsWith("//") ? next : "/account";
}

export function AuthForm({ mode, next, configured }: { mode: "login" | "signup"; next?: string; configured: boolean }) {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<FormState>(configured ? null : { type: "error", message: "Authentication is not configured yet. Add the Supabase environment variables to enable sign in." });
  const router = useRouter();
  const signup = mode === "signup";
  const destination = safeNextPath(next);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) return;
    setLoading(true);
    setState(null);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "").trim();
    const supabase = createClient();

    const result = signup
      ? await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}`,
            data: {
              name,
              plan: "free",
              licenseStatus: "inactive",
              stripeCustomerId: null,
            },
          },
        })
      : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setState({ type: "error", message: result.error.message });
      setLoading(false);
      return;
    }

    if (signup && !result.data.session) {
      setState({ type: "success", message: "Your account is almost ready. Confirm the email we sent you, then come back to sign in." });
      setLoading(false);
      return;
    }

    router.replace(destination);
    router.refresh();
  }

  async function signInWithGitHub() {
    if (!configured) return;
    setLoading(true);
    setState(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(destination)}` },
    });
    if (error) {
      setState({ type: "error", message: error.message });
      setLoading(false);
    }
  }

  return <form onSubmit={submit} className="space-y-4">
    {state && <div role={state.type === "error" ? "alert" : "status"} className={`flex gap-3 rounded-lg border p-3 text-sm leading-5 ${state.type === "error" ? "border-danger/25 bg-danger/5 text-danger" : "border-primary/25 bg-primary/5 text-foreground"}`}>{state.type === "error" ? <AlertCircle className="mt-0.5 size-4 shrink-0" /> : <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />}<span>{state.message}</span></div>}
    {signup && <div><label htmlFor="name" className="mb-1.5 block text-sm font-medium">Name</label><Input id="name" name="name" autoComplete="name" placeholder="Alex Morgan" required /></div>}
    <div><label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label><Input id="email" name="email" type="email" autoComplete="email" placeholder="alex@example.com" required /></div>
    <div><div className="mb-1.5 flex items-center justify-between"><label htmlFor="password" className="text-sm font-medium">Password</label>{!signup && <span className="text-xs text-muted-foreground">Reset is coming soon</span>}</div><Input id="password" name="password" type="password" autoComplete={signup ? "new-password" : "current-password"} minLength={8} placeholder="8 characters or more" required /></div>
    {signup && <label className="flex gap-2 text-xs leading-5 text-muted-foreground"><input type="checkbox" required className="mt-1 accent-[var(--primary)]" /><span>I agree to the <Link href="/terms" className="text-foreground underline">Terms</Link> and <Link href="/privacy" className="text-foreground underline">Privacy Policy</Link>.</span></label>}
    <Button type="submit" className="w-full" size="lg" disabled={loading || !configured}>{loading ? <><Loader2 className="size-4 animate-spin" />{signup ? "Creating your account" : "Signing you in"}</> : <>{signup ? "Create my DevVault account" : "Open my account"}<ArrowRight className="size-4" /></>}</Button>
    <div className="flex items-center gap-3"><span className="h-px flex-1 bg-border" /><span className="text-[10px] uppercase tracking-widest text-muted-foreground">or</span><span className="h-px flex-1 bg-border" /></div>
    <Button type="button" variant="outline" className="w-full" size="lg" disabled={loading || !configured} onClick={signInWithGitHub}><Code2 className="size-4" />{signup ? "Create account with GitHub" : "Sign in with GitHub"}</Button>
    <p className="text-center text-sm text-muted-foreground">{signup ? "Already have a DevVault account?" : "Need an account for Pro?"} <Link href={signup ? "/login" : "/signup"} className="font-medium text-primary hover:underline">{signup ? "Sign in" : "Create one"}</Link></p>
  </form>;
}
