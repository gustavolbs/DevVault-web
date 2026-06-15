import Link from "next/link";
import { Logo } from "@/components/logo";

const groups = [
  { title: "Product", links: [["Features", "/#features"], ["Pricing", "/pricing"], ["Download", "/download"]] },
  { title: "Account", links: [["Sign in", "/login"], ["Create account", "/signup"], ["Dashboard", "/account"]] },
  { title: "Legal", links: [["Privacy", "/privacy"], ["Terms", "/terms"]] },
];

export function Footer() {
  return <footer className="border-t border-border bg-card/30">
    <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.4fr_2fr]">
      <div><Logo /><p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">Open any project with its environments, encrypted variables and commands already in context.</p></div>
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">{groups.map((group) => <div key={group.title}><p className="text-sm font-semibold">{group.title}</p><ul className="mt-3 space-y-2">{group.links.map(([label, href]) => <li key={href}><Link href={href} className="rounded-sm text-sm text-muted-foreground outline-none transition hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/30">{label}</Link></li>)}</ul></div>)}</div>
    </div>
    <div className="border-t border-border"><div className="container-shell flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><p>© 2026 DevVault. All rights reserved.</p><p>Your project context stays where it belongs: with you.</p></div></div>
  </footer>;
}
