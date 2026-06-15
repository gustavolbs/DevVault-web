import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type SubscriptionProfile = {
  plan: string;
  licenseStatus: string;
  stripeCustomerId: string | null;
};

export async function requireUser(): Promise<User> {
  if (!isSupabaseConfigured()) redirect("/login?error=configuration");

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims) redirect("/login?next=/account");

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/login?next=/account");
  return data.user;
}

export async function getSubscriptionProfile(user: User): Promise<SubscriptionProfile> {
  const fallback = {
    plan: typeof user.user_metadata.plan === "string" ? user.user_metadata.plan : "free",
    licenseStatus: typeof user.user_metadata.licenseStatus === "string" ? user.user_metadata.licenseStatus : "inactive",
    stripeCustomerId: typeof user.user_metadata.stripeCustomerId === "string" ? user.user_metadata.stripeCustomerId : null,
  };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select('plan, licenseStatus, stripeCustomerId')
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) return fallback;
  return {
    plan: data.plan,
    licenseStatus: data.licenseStatus,
    stripeCustomerId: data.stripeCustomerId,
  };
}

export function getDisplayName(user: User) {
  return user.user_metadata.name || user.user_metadata.full_name || user.email?.split("@")[0] || "Developer";
}
