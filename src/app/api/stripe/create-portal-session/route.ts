import { NextResponse, type NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { getTrustedOrigin } from "@/lib/request-origin";
import { logServerError } from "@/lib/server-log";
import { apiSecurityErrorResponse, enforceRateLimit } from "@/lib/api-security";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
    if (claimsError || !claimsData?.claims) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }
    await enforceRateLimit("stripe-portal", userData.user.id, 10, 300);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select('stripeCustomerId')
      .eq("id", userData.user.id)
      .maybeSingle();

    if (profileError) {
      logServerError("Failed to load Stripe customer profile", profileError);
      return NextResponse.json({ error: "Unable to load your billing profile." }, { status: 500 });
    }

    if (!profile?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No Stripe customer is connected to this account yet." },
        { status: 409 },
      );
    }

    const session = await getStripe().billingPortal.sessions.create({
      customer: profile.stripeCustomerId,
      return_url: `${getTrustedOrigin(request)}/account/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const securityResponse = apiSecurityErrorResponse(error);
    if (securityResponse) return securityResponse;
    logServerError("Failed to create Stripe Customer Portal Session", error);
    const message = error instanceof Error && error.message.includes("not configured")
      ? "Stripe billing is not configured yet."
      : "Unable to open billing management. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
