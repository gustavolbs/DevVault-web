"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

type FormState = { type: "error" | "success"; message: string } | null;

export function PasswordRecoveryForm({ mode, configured }: { mode: "request" | "update"; configured: boolean }) {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<FormState>(configured ? null : { type: "error", message: "Authentication is not configured." });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) return;
    setLoading(true);
    setState(null);
    const form = new FormData(event.currentTarget);
    const supabase = createClient();

    if (mode === "request") {
      const email = String(form.get("email") ?? "").trim();
      const response = await fetch("/api/auth/password-reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const payload = await response.json().catch(() => ({})) as { error?: string };
      setState(!response.ok
        ? { type: "error", message: payload.error || "Unable to request a password reset." }
        : { type: "success", message: "If that address has a EnvDock account, a password reset link has been sent." });
    } else {
      const password = String(form.get("password") ?? "");
      const confirmation = String(form.get("confirmation") ?? "");
      if (password !== confirmation) {
        setState({ type: "error", message: "The passwords do not match." });
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.updateUser({ password });
      setState(error
        ? { type: "error", message: error.message }
        : { type: "success", message: "Your password has been updated. You can return to your account." });
    }
    setLoading(false);
  }

  return <form onSubmit={submit} className="mt-8 space-y-4">{state && <div role={state.type === "error" ? "alert" : "status"} className={`flex gap-3 rounded-lg border p-3 text-sm ${state.type === "error" ? "border-danger/25 bg-danger/5 text-danger" : "border-primary/25 bg-primary/5"}`}>{state.type === "error" ? <AlertCircle className="size-4 shrink-0" /> : <CheckCircle2 className="size-4 shrink-0 text-primary" />}<span>{state.message}</span></div>}{mode === "request" ? <div><label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label><Input id="email" name="email" type="email" autoComplete="email" required /></div> : <><div><label htmlFor="password" className="mb-1.5 block text-sm font-medium">New password</label><Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required /></div><div><label htmlFor="confirmation" className="mb-1.5 block text-sm font-medium">Confirm password</label><Input id="confirmation" name="confirmation" type="password" autoComplete="new-password" minLength={8} required /></div></>}<Button type="submit" className="w-full" size="lg" disabled={loading || !configured}>{loading && <Loader2 className="size-4 animate-spin" />}{mode === "request" ? "Send reset link" : "Update password"}</Button><p className="text-center text-sm text-muted-foreground"><Link href={mode === "request" ? "/login" : "/account"} className="text-primary hover:underline">{mode === "request" ? "Back to sign in" : "Return to account"}</Link></p></form>;
}
