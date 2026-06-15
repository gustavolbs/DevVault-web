import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { assertStripeCheckoutConfig, getStripe, getStripePriceId } from "@/lib/stripe";
import { getTrustedOrigin } from "@/lib/request-origin";
import { logServerError } from "@/lib/server-log";
import { apiSecurityErrorResponse, enforceRateLimit } from "@/lib/api-security";

export async function POST(request: NextRequest) {
  try {
    assertStripeCheckoutConfig();
    const supabase = await createClient();
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
    if (claimsError || !claimsData?.claims) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const user = userData.user;
    await enforceRateLimit("stripe-checkout", user.id, 5, 300);
    const { data: profile } = await supabase
      .from("profiles")
      .select('plan, licenseStatus, stripeCustomerId')
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.plan === "pro" && profile.licenseStatus === "active") {
      return NextResponse.json({ error: "This account already has an active Pro license." }, { status: 409 });
    }

    const stripe = getStripe();
    const priceId = getStripePriceId();
    const price = await stripe.prices.retrieve(priceId);
    if (!price.active) {
      return NextResponse.json({ error: "The EnvDock Pro price is not active." }, { status: 503 });
    }

    const mode: Stripe.Checkout.SessionCreateParams.Mode = price.type === "recurring" ? "subscription" : "payment";
    const origin = getTrustedOrigin(request);
    const metadata = { supabaseUserId: user.id, plan: "pro" };
    const customerId = profile?.stripeCustomerId || null;

    const params: Stripe.Checkout.SessionCreateParams = {
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/account/billing?success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
      client_reference_id: user.id,
      metadata,
      allow_promotion_codes: true,
      ...(customerId ? { customer: customerId } : { customer_email: user.email }),
      ...(mode === "payment"
        ? {
            customer_creation: customerId ? undefined : "always",
            payment_intent_data: { metadata },
          }
        : { subscription_data: { metadata } }),
    };

    const session = await stripe.checkout.sessions.create(params);
    if (!session.url) {
      return NextResponse.json({ error: "Stripe did not return a Checkout URL." }, { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const securityResponse = apiSecurityErrorResponse(error);
    if (securityResponse) return securityResponse;
    logServerError("Failed to create Stripe Checkout Session", error);
    const message = error instanceof Error && error.message.includes("not configured")
      ? "Stripe Checkout is not configured yet."
      : "Unable to start Checkout. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
