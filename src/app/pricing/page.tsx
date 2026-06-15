import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FAQ } from "@/components/faq";
import { MarketingLayout } from "@/components/marketing-layout";
import { PricingCard } from "@/components/pricing-card";
import { Button } from "@/components/ui/button";
import { StripeCheckoutButton } from "@/components/stripe-checkout-button";
import { FREE_FEATURES, PRODUCT, PRO_FEATURES } from "@/lib/product";

export const metadata: Metadata = { title: "Pricing" };

const faqItems = [
  { question: "Is DevVault a cloud app?", answer: "No. The app and your vault run locally. The website handles your account, payment and license only; your project environments never pass through it." },
  { question: "Will my secrets be stored online?", answer: "No. Every variable value stays in your local desktop database and is encrypted using secure storage backed by your operating system." },
  { question: "Can I try DevVault before creating an account?", answer: "Yes. Download the app and use the Free plan in local mode. Create an account only when you are ready to buy and activate Pro." },
  { question: "Is DevVault a replacement for 1Password?", answer: "No. 1Password protects general credentials. DevVault keeps development environments, project variables and commands together so you can work with them in context." },
  { question: "Can I sync my vault between devices?", answer: "Not today. The current early-access release is intentionally local-first and supports one active Pro device. Cross-device sync is not included." },
];

export default async function PricingPage({ searchParams }: { searchParams: Promise<{ canceled?: string }> }) {
  const { canceled } = await searchParams;
  return (
    <MarketingLayout>
      <section className="border-b border-border"><div className="container-shell grid gap-8 py-20 sm:py-28 lg:grid-cols-[0.85fr_1.15fr] lg:items-end"><div><p className="eyebrow">One price, no recurring bill</p><h1 className="mt-5 text-balance text-5xl font-semibold leading-none tracking-[-0.05em] sm:text-6xl">One payment.<br />Yours for life. $39.</h1></div><p className="max-w-xl text-base leading-7 text-muted-foreground">No subscription, no seat fees, no annual surprise. Use the full local workflow free on one project. When DevVault earns its place, unlock everything with a single early-access payment, before the price goes up.</p></div></section>
      <section className="container-shell py-20 sm:py-24">
        {canceled === "true" && <div role="status" className="mb-8 rounded-md border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">Checkout closed without a purchase. Your Free plan is unchanged.</div>}
        <div className="grid gap-5 lg:grid-cols-2"><PricingCard name="Free" description="Experience the complete local foundation on one real project." price="$0" features={[...FREE_FEATURES]} cta="Try DevVault free" ctaHref="/download" /><PricingCard name="Pro Lifetime" description="Turn DevVault into the permanent command center for every local project." price={PRODUCT.pro.price} suffix={PRODUCT.pro.priceNote} featured badge="Lock in early access pricing" features={[...PRO_FEATURES]} cta="Get Pro Lifetime" checkout /></div>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6 text-xs text-muted-foreground"><span>Pay once, keep Pro</span><span>One active desktop device</span><span>Your vault always stays local</span><span>Try Pro for 14 days in the app</span></div>
      </section>
      <section className="border-y border-border bg-card/35"><div className="container-shell grid gap-8 py-16 lg:grid-cols-[0.75fr_1.25fr]"><div><p className="font-mono text-xs text-muted-foreground">BUILT FOR INDIVIDUAL DEVELOPERS FIRST</p><h2 className="mt-4 text-2xl font-semibold tracking-tight">Teams come later.</h2></div><div><p className="max-w-2xl text-sm leading-7 text-muted-foreground">We are focused on making the individual desktop workflow excellent before adding shared environments, access controls and centralized license management.</p><Button asChild variant="outline" className="mt-6"><Link href="/signup">Create an account for product updates <ArrowRight className="size-4" /></Link></Button></div></div></section>
      <section className="container-shell grid gap-10 py-24 lg:grid-cols-[0.75fr_1.25fr]"><div><p className="eyebrow">No pricing fine print</p><h2 className="mt-5 text-3xl font-semibold tracking-tight">Questions worth answering before you pay.</h2></div><FAQ items={faqItems} /></section>
      <section className="border-t border-border bg-card/35"><div className="container-shell flex flex-col justify-between gap-6 py-14 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-semibold tracking-tight">See if DevVault changes how you return to a project.</h2><p className="mt-2 text-sm text-muted-foreground">Start free today. Upgrade only after the workflow proves its value.</p></div><div className="flex flex-col gap-3 sm:flex-row"><Button asChild variant="outline"><Link href="/download">Try it free</Link></Button><StripeCheckoutButton className="sm:w-auto" label="Get Pro Lifetime" /></div></div></section>
    </MarketingLayout>
  );
}
