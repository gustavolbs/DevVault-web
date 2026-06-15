"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CreditCard, Download, KeyRound, LayoutDashboard, Loader2, LogOut } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/toast-provider";

const links = [{ href: "/account", label: "Overview", icon: LayoutDashboard }, { href: "/account/billing", label: "Billing", icon: CreditCard }, { href: "/account/licenses", label: "Licenses", icon: KeyRound }];

export function AccountShell({ children, name, email }: { children: React.ReactNode; name: string; email: string }) {
  const path = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const toast = useToast();

  async function signOut() {
    setSigningOut(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) { setSigningOut(false); toast({ tone: "error", title: "Could not sign out", description: error.message }); return; }
    router.replace("/login"); router.refresh();
  }

  return <div className="min-h-screen bg-background"><header className="sticky top-0 z-40 border-b border-border/80 bg-card/80 backdrop-blur-xl"><div className="container-shell flex h-16 items-center justify-between"><Logo /><div className="flex items-center gap-1"><ThemeToggle /><Button variant="ghost" size="sm" className="hidden md:flex" onClick={signOut} disabled={signingOut}>{signingOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}Sign out</Button></div></div></header><div className="container-shell grid py-6 md:grid-cols-[210px_1fr] md:gap-10 md:py-10"><aside><div className="mb-6 hidden md:block"><p className="truncate text-sm font-semibold">{name}</p><p className="mt-1 truncate text-xs text-muted-foreground">{email}</p></div><nav className="-mx-1 flex gap-1 overflow-x-auto border-b border-border px-1 pb-3 md:mx-0 md:block md:space-y-1 md:border-0 md:px-0 md:pb-0">{links.map(({ href,label,icon:Icon }) => { const active = path === href; return <Link href={href} key={href} className={cn("flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-ring/30", active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}><Icon className="size-4" />{label}</Link>; })}</nav><Button asChild variant="outline" size="sm" className="mt-6 hidden w-full md:flex"><Link href="/download"><Download className="size-4" />Download app</Link></Button><Button variant="ghost" size="sm" className="mt-3 w-full md:hidden" onClick={signOut} disabled={signingOut}>{signingOut ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}Sign out</Button></aside><main className="min-w-0 py-7 md:py-0">{children}</main></div></div>;
}
