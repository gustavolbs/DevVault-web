import { describe, expect, it } from "vitest";
import { getStripeLicenseAction } from "../src/lib/stripe-license-events";

describe("Stripe license event mapping", () => {
  it("activates only completed payments", () => {
    expect(getStripeLicenseAction("checkout.session.completed", { mode: "payment", payment_status: "paid" })).toBe("activate");
    expect(getStripeLicenseAction("checkout.session.completed", { mode: "payment", payment_status: "unpaid" })).toBeNull();
  });

  it("expires canceled or unpaid subscriptions", () => {
    expect(getStripeLicenseAction("customer.subscription.deleted", {})).toBe("expire");
    expect(getStripeLicenseAction("customer.subscription.updated", { status: "past_due" })).toBe("expire");
    expect(getStripeLicenseAction("customer.subscription.updated", { status: "active" })).toBe("activate");
  });

  it("revokes fully refunded or disputed purchases", () => {
    expect(getStripeLicenseAction("charge.refunded", { refunded: true })).toBe("revoke");
    expect(getStripeLicenseAction("charge.refunded", { refunded: false })).toBeNull();
    expect(getStripeLicenseAction("charge.dispute.created", {})).toBe("revoke");
  });
});
