"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [{ href: "/#features", label: "Features" }, { href: "/pricing", label: "Pricing" }, { href: "/download", label: "Download" }];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
    <div className="container-shell flex h-[68px] items-center justify-between">
      <Logo />
      <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
        {links.map((link) => <Link key={link.href} href={link.href} className={cn("text-sm text-muted-foreground outline-none transition hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30", pathname === link.href && "text-foreground")}>{link.label}</Link>)}
      </nav>
      <div className="hidden items-center gap-2 md:flex"><ThemeToggle /><Button asChild variant="ghost"><Link href="/login">Sign in</Link></Button><Button asChild><Link href="/download">Try DevVault free</Link></Button></div>
      <div className="flex items-center md:hidden"><ThemeToggle /><Button variant="ghost" size="icon" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X className="size-5" /> : <Menu className="size-5" />}</Button></div>
    </div>
    {open && <div className="border-t border-border bg-background/98 px-4 py-4 shadow-xl md:hidden"><nav className="mx-auto flex max-w-lg flex-col gap-1">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/30">{link.label}</Link>)}<div className="mt-3 grid grid-cols-2 gap-2"><Button asChild variant="outline"><Link href="/login">Sign in</Link></Button><Button asChild><Link href="/download">Try it free</Link></Button></div></nav></div>}
  </header>;
}
