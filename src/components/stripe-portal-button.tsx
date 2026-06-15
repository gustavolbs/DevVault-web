"use client";

import { useRouter } from "next/navigation";
import { ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast-provider";

export function StripePortalButton({ hasCustomer }: { hasCustomer: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast();

  async function openPortal() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/stripe/create-portal-session", { method: "POST" });
      if (response.status === 401) {
        router.push("/login?next=/account/billing");
        return;
      }
      const data = await response.json() as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || "We could not open your Stripe payment settings.");
      window.location.assign(data.url);
    } catch (portalError) {
      const message = portalError instanceof Error ? portalError.message : "We could not open your Stripe payment settings.";
      setError(message);
      toast({ tone: "error", title: "Payment settings did not open", description: message });
      setLoading(false);
    }
  }

  return <div className="sm:text-right"><Button type="button" onClick={openPortal} disabled={loading || !hasCustomer}>{loading ? <><Loader2 className="size-4 animate-spin" />Opening Stripe</> : <>Open payment settings<ExternalLink className="size-4" /></>}</Button>{!hasCustomer && <p role="status" className="mt-2 max-w-xs text-xs leading-5 text-muted-foreground">Payment settings appear after your first Pro purchase.</p>}{error && <p role="alert" className="mt-2 max-w-xs text-xs leading-5 text-danger">{error}</p>}</div>;
}
