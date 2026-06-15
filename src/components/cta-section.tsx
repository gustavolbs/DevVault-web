import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="container-shell py-20 sm:py-28">
      <div className="cta-panel grid overflow-hidden rounded-xl border shadow-2xl shadow-slate-950/10 lg:grid-cols-[1fr_auto] dark:shadow-slate-950/30">
        <div className="p-8 sm:p-12">
          <span className="font-mono text-xs font-medium text-[var(--cta-label)]">
            THE NEXT BROKEN BUILD IS AVOIDABLE
          </span>
          <h2 className="mt-5 max-w-2xl text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">
            Your next session: shipping, not reconstructing.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--cta-muted)]">
            Download DevVault, add one real project, and feel how much faster it opens when nothing is missing. Free, no account, two minutes.
          </p>
        </div>
        <div className="flex flex-col justify-center gap-3 border-t border-[var(--cta-border)] p-8 lg:min-w-72 lg:border-l lg:border-t-0">
          <Button asChild size="lg">
            <Link href="/download">
              Download free <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-[var(--cta-border)] bg-transparent text-[var(--cta-text)] hover:bg-background/40">
            <Link href="/pricing">Compare plans</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
