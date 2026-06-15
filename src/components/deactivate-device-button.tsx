"use client";

import { useRouter } from "next/navigation";
import { Loader2, Unplug } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast-provider";

export function DeactivateDeviceButton({ deviceId }: { deviceId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast();

  async function deactivate() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/license/deactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw new Error(data.error || "We could not release this activation.");
      toast({ tone: "success", title: "Activation released", description: "Your Pro license is ready to activate on another Mac." });
      router.refresh();
    } catch (deactivationError) {
      const message = deactivationError instanceof Error ? deactivationError.message : "We could not release this activation.";
      setError(message);
      toast({ tone: "error", title: "Activation was not released", description: message });
      setLoading(false);
    }
  }

  return <div className="sm:text-right"><Button variant="outline" size="sm" onClick={deactivate} disabled={loading}>{loading ? <><Loader2 className="size-4 animate-spin" />Releasing activation</> : <><Unplug className="size-4" />Move license to another Mac</>}</Button>{error && <p role="alert" className="mt-2 max-w-xs text-xs text-danger">{error}</p>}</div>;
}
