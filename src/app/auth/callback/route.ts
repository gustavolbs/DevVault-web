import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getTrustedOrigin } from "@/lib/request-origin";
import { safeInternalPath } from "@/lib/auth-redirect";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = getTrustedOrigin(request);
  const code = searchParams.get("code");
  const next = safeInternalPath(searchParams.get("next"));
  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/login?error=configuration`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        await supabase.auth.updateUser({
          data: {
            ...data.user.user_metadata,
            plan: data.user.user_metadata.plan ?? "free",
            licenseStatus: data.user.user_metadata.licenseStatus ?? "inactive",
            stripeCustomerId: data.user.user_metadata.stripeCustomerId ?? null,
          },
        });
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
