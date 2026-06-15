import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PasswordRecoveryForm } from "@/components/password-recovery-form";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Choose a new password" };

export default async function ResetPasswordPage() {
  const configured = isSupabaseConfigured();
  if (configured) {
    const { data } = await (await createClient()).auth.getClaims();
    if (!data?.claims) redirect("/forgot-password");
  }
  return <main className="min-h-screen px-6 py-6 sm:px-12"><div className="flex items-center justify-between"><Logo /><ThemeToggle /></div><section className="mx-auto mt-24 w-full max-w-sm"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Account recovery</p><h1 className="mt-3 text-3xl font-semibold">Choose a new password.</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Use at least eight characters and do not reuse a password from another service.</p><PasswordRecoveryForm mode="update" configured={configured} /></section></main>;
}
