import type { Metadata } from "next";
import { PasswordRecoveryForm } from "@/components/password-recovery-form";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return <main className="min-h-screen px-6 py-6 sm:px-12"><div className="flex items-center justify-between"><Logo /><ThemeToggle /></div><section className="mx-auto mt-24 w-full max-w-sm"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Account recovery</p><h1 className="mt-3 text-3xl font-semibold">Reset your password.</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">We will email a short-lived Supabase recovery link. The response does not reveal whether an account exists.</p><PasswordRecoveryForm mode="request" configured={isSupabaseConfigured()} /></section></main>;
}
