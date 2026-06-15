"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/toast-provider";

export function StripeCheckoutButton({ className, label = "Get Pro Lifetime", size = "default" }: { className?: string; label?: string; size?: "default" | "sm" | "lg" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast();

  async function startCheckout() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/stripe/create-checkout-session", { method: "POST" });
      if (response.status === 401) {
        router.push("/login?next=/pricing");
        return;
      }
      const data = await response.json() as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || "We could not open secure checkout. Please try again.");
      window.location.assign(data.url);
    } catch (checkoutError) {
      const message = checkoutError instanceof Error ? checkoutError.message : "We could not open secure checkout. Please try again.";
      setError(message);
      toast({ tone: "error", title: "Secure checkout did not open", description: message });
      setLoading(false);
    }
  }

  return <div className={cn("w-full", className)}><Button type="button" size={size} className="w-full" onClick={startCheckout} disabled={loading}>{loading ? <><Loader2 className="size-4 animate-spin" />Opening secure checkout</> : <>{label}<ArrowRight className="size-4" /></>}</Button>{error && <p role="alert" className="mt-2 text-center text-xs text-danger">{error}</p>}</div>;
}
