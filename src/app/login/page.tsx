import type { Metadata } from "next";
import { AuthPage } from "@/components/auth-page";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Sign in" };
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <AuthPage mode="login" next={next} configured={isSupabaseConfigured()} />;
}
