import { NextResponse } from "next/server";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { logServerError } from "@/lib/server-log";

async function activatePro(session: {
  customer: string | { id: string } | null;
  metadata: Record<string, string> | null;
}) {
  const userId = session.metadata?.supabaseUserId;
  if (!userId) throw new Error("Checkout Session is missing supabaseUserId metadata.");
  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      plan: "pro",
      licenseStatus: "active",
      stripeCustomerId: customerId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
  if (error) throw error;
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });

  try {
    const body = await request.text();
    const event = getStripe().webhooks.constructEvent(body, signature, getStripeWebhookSecret());

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if (session.mode === "subscription" || session.payment_status === "paid") {
        await activatePro(session);
      }
    }

    if (event.type === "checkout.session.async_payment_succeeded") {
      await activatePro(event.data.object);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logServerError("Stripe webhook verification failed", error);
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }
}
