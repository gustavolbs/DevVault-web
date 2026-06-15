import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StripeCheckoutButton } from "@/components/stripe-checkout-button";
import { cn } from "@/lib/utils";

export function PricingCard({ name, description, price, suffix, features, featured = false, cta = "Get started", ctaHref = "/signup", badge = "Most popular", checkout = false }: { name: string; description: string; price: string; suffix?: string; features: string[]; featured?: boolean; cta?: string; ctaHref?: string; badge?: string; checkout?: boolean }) {
  return <article className={cn("surface-card relative flex h-full flex-col p-7", featured && "border-primary shadow-xl shadow-primary/10 ring-1 ring-primary/10")}>
    {featured && <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">{badge}</span>}
    <h3 className="text-lg font-semibold">{name}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{description}</p>
    <div className="mt-6 flex items-end gap-1"><span className="text-4xl font-semibold tracking-tight">{price}</span>{suffix && <span className="pb-1 text-sm text-muted-foreground">{suffix}</span>}</div>
    {checkout ? <StripeCheckoutButton className="mt-6" label={cta} /> : <Button asChild variant={featured ? "default" : "outline"} className="mt-6 w-full"><Link href={ctaHref}>{cta}</Link></Button>}
    <ul className="mt-6 space-y-3 border-t border-border pt-6">{features.map((feature) => <li key={feature} className="flex gap-3 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-primary" /><span>{feature}</span></li>)}</ul>
  </article>;
}
