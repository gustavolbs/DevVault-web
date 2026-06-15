import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: React.ReactNode }) {
  return <div className="surface-card flex min-h-64 flex-col items-center justify-center border-dashed p-8 text-center"><span className="flex size-11 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary"><Icon className="size-5" /></span><h2 className="mt-5 font-semibold tracking-tight">{title}</h2><p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>{action && <div className="mt-5">{action}</div>}</div>;
}
