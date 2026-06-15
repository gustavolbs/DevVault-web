export type StripeLicenseAction = "activate" | "expire" | "revoke";

export function getStripeLicenseAction(eventType: string, object: Record<string, unknown>): StripeLicenseAction | null {
  if (eventType === "checkout.session.async_payment_succeeded") return "activate";
  if (eventType === "checkout.session.completed") {
    return object.mode === "subscription" || object.payment_status === "paid" ? "activate" : null;
  }
  if (eventType === "customer.subscription.deleted" || eventType === "invoice.payment_failed") return "expire";
  if (eventType === "customer.subscription.updated") {
    return object.status === "active" || object.status === "trialing" ? "activate"
      : ["canceled", "incomplete_expired", "past_due", "paused", "unpaid"].includes(String(object.status)) ? "expire" : null;
  }
  if (eventType === "charge.dispute.created") return "revoke";
  if (eventType === "charge.refunded" && object.refunded === true) return "revoke";
  return null;
}
