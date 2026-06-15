import type { LucideIcon } from "lucide-react";

export function FeatureCard({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return <article className="surface-card surface-card-interactive group p-6">
    <span className="flex size-10 items-center justify-center rounded-lg border border-primary/10 bg-accent text-primary transition group-hover:scale-105"><Icon className="size-5" /></span>
    <h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
  </article>;
}
