import Link from "next/link";
import { Boxes } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return <Link href="/" className={cn("inline-flex items-center gap-2.5 font-semibold tracking-tight", className)}>
    <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_24px_color-mix(in_srgb,var(--primary)_25%,transparent)]"><Boxes className="size-5" /></span>
    {!compact && <span>DevVault</span>}
  </Link>;
}
