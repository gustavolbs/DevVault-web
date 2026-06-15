import type { Metadata } from "next";
import { AuthPage } from "@/components/auth-page";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Create account" };
export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <AuthPage mode="signup" next={next} configured={isSupabaseConfigured()} />;
}
