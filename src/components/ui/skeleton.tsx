import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("skeleton", className)} />;
}

export function PageSkeleton() {
  return <main className="container-shell py-12" role="status" aria-label="Loading page"><div className="space-y-3"><Skeleton className="h-3 w-28" /><Skeleton className="h-9 w-72 max-w-full" /><Skeleton className="h-4 w-[30rem] max-w-full" /></div><div className="mt-10 grid gap-5 md:grid-cols-2"><div className="surface-card space-y-4 p-6"><Skeleton className="size-10" /><Skeleton className="h-5 w-36" /><Skeleton className="h-4 w-full" /><Skeleton className="h-10 w-full" /></div><div className="surface-card space-y-4 p-6"><Skeleton className="size-10" /><Skeleton className="h-5 w-40" /><Skeleton className="h-4 w-full" /><Skeleton className="h-10 w-full" /></div></div></main>;
}
