import Link from "next/link";
import { ArrowRight, Check, Command, FolderKanban, GitCompare, KeyRound, Layers3, LockKeyhole, ShieldCheck, TerminalSquare } from "lucide-react";
import { CTASection } from "@/components/cta-section";
import { FAQ } from "@/components/faq";
import { MarketingLayout } from "@/components/marketing-layout";
import { PricingCard } from "@/components/pricing-card";
import { ProductPreview } from "@/components/product-preview";
import { Button } from "@/components/ui/button";
import { FREE_FEATURES, PRODUCT, PRO_FEATURES } from "@/lib/product";

const faqs = [
  { question: "Will EnvDock upload my .env files?", answer: "No. Your projects, environments and variables stay on your Mac. The website manages your account and license, but never receives the contents of your local vault." },
  { question: "How does EnvDock protect secrets?", answer: "Every variable value is encrypted locally using the secure credential storage provided by your operating system. Values marked as secrets stay masked until you explicitly reveal or copy them." },
  { question: "Can I try it without creating an account?", answer: "Yes. Download the app and continue in local mode. You only need an account when you decide to purchase and activate Pro. Download, run it, decide later. No email required." },
  { question: "Can EnvDock overwrite the wrong .env file?", answer: "EnvDock shows the exact target path and a line-by-line preview before writing. You confirm the change, and Pro creates a backup with rollback support when an existing file is replaced." },
  { question: "Which platforms can I use today?", answer: "The early-access release supports macOS 12 or newer on Apple Silicon and Intel. A Windows version is planned." },
];

const featureRows = [
  [FolderKanban, "Pick up any project in seconds", "Repository path, environments and commands live together, so switching projects stops meaning relearn how this one runs."],
  [KeyRound, "Keep secrets handy, never exposed", "Every value is encrypted locally and masked until you reveal it. No plaintext .env lying around your disk."],
  [GitCompare, "Catch the broken variable before deploy", "Compare two environments and see missing keys and changed values instantly, before they become a 2am rollback."],
  [Layers3, "Skip the boilerplate every time", "Start from templates for Next.js, Vite, Node.js, Docker, PostgreSQL, Stripe and AWS, then save your own in Pro."],
  [Command, "Run commands with the right env, every time", "Save the commands a project depends on, pick an environment and watch the output without leaving EnvDock."],
] as const;

export default function Home() {
  return (
    <MarketingLayout>
      <section className="overflow-hidden border-b border-border">
        <div className="container-shell grid gap-12 pb-16 pt-20 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:pb-24 lg:pt-28">
          <div className="relative z-10">
            <p className="font-mono text-xs text-primary">LOCAL-FIRST .ENV MANAGER FOR MACOS</p>
            <h1 className="mt-6 max-w-3xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">Stop guessing which <span className="text-primary">.env is the right one.</span></h1>
            <p className="mt-6 max-w-xl text-balance text-base leading-7 text-muted-foreground sm:text-lg">One wrong variable and the deploy breaks. EnvDock keeps every environment, secret and command for a project encrypted on your Mac, so you open it and run instead of reconstructing it from memory.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button asChild size="lg"><Link href="/download">Download free — no account needed <ArrowRight className="size-4" /></Link></Button><Button asChild size="lg" variant="outline"><Link href="#workflow">See how it works</Link></Button></div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground"><span>No signup to start</span><span>Secrets never leave your Mac</span><span>macOS 12+</span></div>
          </div>
          <div className="relative"><div className="absolute -inset-20 -z-10 bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--primary)_14%,transparent),transparent_66%)]" /><ProductPreview /></div>
        </div>
      </section>

      <section className="border-b border-border bg-card/35"><div className="container-shell grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">{[[LockKeyhole,"Secrets stay on your Mac","No cloud, no account, nothing to leak."],[ShieldCheck,"Never overwrite the wrong file","Preview every change, auto-backup, one-click rollback."],[TerminalSquare,"Drops into your setup","Your existing .env files, repos and commands. Zero migration."]].map(([Icon,title,body]) => <div key={title as string} className="flex gap-3 py-6 sm:px-6 first:pl-0 last:pr-0"><Icon className="mt-0.5 size-4 shrink-0 text-primary" /><div><p className="text-sm font-medium">{title as string}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{body as string}</p></div></div>)}</div></section>

      <section className="container-shell py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <div><p className="eyebrow">The hidden setup tax</p><h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">Every context switch costs you an hour you will never bill.</h2></div>
          <div className="border-t border-border">
            {["Which .env file can I trust?","What changed between local and staging?","What was the command that started everything?"].map((question,index) => <div key={question} className="grid grid-cols-[42px_1fr] gap-4 border-b border-border py-6"><span className="font-mono text-xs text-muted-foreground">0{index+1}</span><div><h3 className="font-medium">{question}</h3><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{index===0?"Old copies and near-identical names turn a one-line config change into guesswork, and one bad value into a broken build.":index===1?"Diffing two files by eye is slow, error-prone, and the failures land in production where they hurt most.":"The command you need is buried in shell history, a teammate's head, or a README nobody updated."}</p></div></div>)}
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-border bg-card/35 py-24 sm:py-32">
        <div className="container-shell grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start"><p className="eyebrow">Everything a project needs, in one place</p><h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">Open a project and it is ready. No archaeology required.</h2><p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">EnvDock works alongside your editor and terminal. It keeps the fragile context around them organized, encrypted and ready when you return.</p></div>
          <div className="divide-y divide-border border-y border-border">{featureRows.map(([Icon,title,description]) => <article key={title} className="grid grid-cols-[40px_1fr] gap-4 py-6"><span className="flex size-9 items-center justify-center rounded-md border border-border bg-background"><Icon className="size-4 text-primary" /></span><div><h3 className="font-medium">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></div></article>)}</div>
        </div>
      </section>

      <section id="workflow" className="container-shell py-24 sm:py-32">
        <div className="max-w-2xl"><p className="eyebrow">A short path back into flow</p><h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">Set it up once. Stop reconstructing it every time.</h2></div>
        <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-3">{[["01","Point EnvDock at the project","Choose the repository once. EnvDock keeps its environments and commands attached to it."],["02","Bring in the context you already have","Import a .env file, use a stack template or create an environment without changing your existing tools."],["03","Return ready to work","Review the environment, apply it safely and run the saved command that gets the project moving."]].map(([number,title,body]) => <article key={number} className="bg-card p-7 sm:p-8"><span className="font-mono text-xs text-primary">{number}</span><h3 className="mt-12 text-lg font-medium">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p></article>)}</div>
        <div className="env-preview mt-6 overflow-hidden rounded-xl border shadow-2xl"><div className="border-b border-[var(--env-preview-border)] bg-[var(--env-preview-panel)] px-5 py-3 font-mono text-[10px] text-[var(--env-preview-muted)]">acme-api / development / prepare preview</div><div className="grid md:grid-cols-2"><div className="border-b border-[var(--env-preview-border)] bg-[var(--env-preview-panel)] p-6 font-mono text-xs leading-7 md:border-b-0 md:border-r"><p className="text-[var(--env-preview-muted)]">Target: ~/Projects/acme-api/.env</p><p className="text-[var(--env-preview-added)]">+ NODE_ENV=development</p><p className="text-[var(--env-preview-added)]">+ API_PORT=4000</p><p className="text-[var(--env-preview-removed)]">- API_PORT=3000</p><p className="text-[var(--env-preview-muted)]">  DATABASE_URL=••••••••</p></div><div className="p-6"><p className="text-sm font-medium text-[var(--env-preview-text)]">See the change before it reaches disk</p><p className="mt-3 text-sm leading-6 text-[var(--env-preview-muted)]">Review the target and every changed line. EnvDock writes only after confirmation, backs up the current file and can roll the operation back if it fails.</p><div className="mt-6 flex gap-2"><span className="rounded-md border border-[var(--env-preview-border)] px-3 py-2 text-xs text-[var(--env-preview-muted)]">Cancel</span><span className="rounded-md bg-[var(--env-preview-button)] px-3 py-2 text-xs font-semibold text-[var(--env-preview-button-text)]">Apply reviewed changes</span></div></div></div></div>
      </section>

      <section className="border-y border-border bg-card/35 py-24"><div className="container-shell grid gap-12 lg:grid-cols-2"><div><ShieldCheck className="size-6 text-primary" /><h2 className="mt-6 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Your secrets do not belong in someone else&apos;s cloud.</h2><p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground">EnvDock is local-first by architecture, not by policy. Your database stays on your device, every value is encrypted with your OS secure storage, and secrets stay masked in the UI. There is no server to breach because there is no server holding your secrets.</p></div><div className="space-y-3">{["The website never receives your project variables","Reveal and copy happen only when you ask","File writes and commands require your confirmation","Your exported files stay entirely under your control"].map(item=><div key={item} className="flex items-center gap-3 border-b border-border py-4 text-sm"><Check className="size-4 text-primary" />{item}</div>)}</div></div></section>

      <section className="container-shell py-24 sm:py-32"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">Simple pricing</p><h2 className="mt-5 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">Pay once. Own it forever. $39.</h2></div><Link href="/pricing" className="text-sm font-medium text-primary">See the full comparison <ArrowRight className="ml-1 inline size-4" /></Link></div><div className="mt-12 grid gap-5 lg:grid-cols-2"><PricingCard name="Free" description="The full local workflow on one real project." price="$0" features={[...FREE_FEATURES]} cta="Start free on macOS" ctaHref="/download" /><PricingCard name="Pro Lifetime" description="Every project, every Pro workflow. One payment, locked in for life." price={PRODUCT.pro.price} suffix={PRODUCT.pro.priceNote} featured badge="Early access price" features={[...PRO_FEATURES]} cta="Get Pro Lifetime" checkout /></div></section>

      <section className="border-y border-border bg-card/35"><div className="container-shell grid gap-10 py-24 lg:grid-cols-[0.75fr_1.25fr]"><div><p className="eyebrow">Straight answers</p><h2 className="mt-5 text-3xl font-semibold tracking-tight">Know what you are installing.</h2><p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">No vague claims about privacy, accounts or file writes.</p></div><FAQ items={faqs} /></div></section>
      <CTASection />
    </MarketingLayout>
  );
}
