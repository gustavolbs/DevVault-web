import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe";
import { getStripeLicenseAction } from "@/lib/stripe-license-events";
import { createAdminClient } from "@/lib/supabase/admin";
import { logServerError } from "@/lib/server-log";

const MAX_WEBHOOK_BYTES = 1024 * 1024;

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_WEBHOOK_BYTES) return NextResponse.json({ error: "Webhook body is too large." }, { status: 413 });

  try {
    const body = await request.text();
    if (Buffer.byteLength(body, "utf8") > MAX_WEBHOOK_BYTES) return NextResponse.json({ error: "Webhook body is too large." }, { status: 413 });
    const event = getStripe().webhooks.constructEvent(body, signature, getStripeWebhookSecret());
    const object = event.data.object as unknown as Record<string, unknown>;
    const action = getStripeLicenseAction(event.type, object);
    if (!action) return NextResponse.json({ received: true });

    const identity = await resolveIdentity(event, object);
    if (!identity.userId) throw new Error(`Stripe event ${event.type} could not be associated with a EnvDock user.`);
    const { error } = await createAdminClient().rpc("process_stripe_license_event", {
      p_event_id: event.id,
      p_event_type: event.type,
      p_user_id: identity.userId,
      p_customer_id: identity.customerId,
      p_action: action,
      p_event_created_at: new Date(event.created * 1000).toISOString(),
    });
    if (error) throw error;
    return NextResponse.json({ received: true });
  } catch (error) {
    logServerError("Stripe webhook processing failed", error);
    return NextResponse.json({ error: "Invalid or unprocessable Stripe webhook." }, { status: 400 });
  }
}

async function resolveIdentity(event: Stripe.Event, object: Record<string, unknown>): Promise<{ userId: string | null; customerId: string | null }> {
  const metadata = object.metadata && typeof object.metadata === "object" ? object.metadata as Record<string, unknown> : null;
  const directUserId = typeof metadata?.supabaseUserId === "string" ? metadata.supabaseUserId : null;
  let customerId = typeof object.customer === "string" ? object.customer
    : object.customer && typeof object.customer === "object" && "id" in object.customer && typeof object.customer.id === "string" ? object.customer.id
    : null;

  if (!customerId && (event.type === "charge.refunded" || event.type === "charge.dispute.created")) {
    const chargeId = event.type === "charge.dispute.created" ? object.charge : object.id;
    if (typeof chargeId === "string") {
      const charge = await getStripe().charges.retrieve(chargeId);
      customerId = typeof charge.customer === "string" ? charge.customer : null;
    }
  }
  if (directUserId) return { userId: directUserId, customerId };
  if (!customerId) return { userId: null, customerId: null };

  const { data, error } = await createAdminClient().from("profiles").select("id").eq("stripeCustomerId", customerId).maybeSingle();
  if (error) throw error;
  return { userId: data?.id ?? null, customerId };
}
