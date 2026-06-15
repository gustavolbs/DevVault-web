"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast-provider";

export function Checksum({ value }: { value?: string }) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();
  const checksum = value || "SHA256 checksum will be published with the hosted release.";

  async function copy() {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast({ tone: "success", title: "Checksum copied" });
    setTimeout(() => setCopied(false), 1800);
  }

  return <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3"><code className="min-w-0 flex-1 break-all font-mono text-[11px] leading-5 text-muted-foreground">{checksum}</code><Button type="button" variant="ghost" size="icon" onClick={copy} disabled={!value} aria-label="Copy checksum">{copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}</Button></div>;
}
