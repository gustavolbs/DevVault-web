import type { Metadata } from "next";
import Link from "next/link";
import { Apple, CheckCircle2, ChevronRight, Clock3, Command, FileDown, Laptop, Monitor, ShieldCheck, Sparkles } from "lucide-react";
import { Checksum } from "@/components/download/checksum";
import { DownloadButton } from "@/components/download/download-button";
import { MarketingLayout } from "@/components/marketing-layout";
import { PageHero } from "@/components/page-hero";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Download" };

const changelog = [
  "Keep repositories, environments and commands together by project",
  "Encrypt every variable value locally and mask secrets by default",
  "Import, export, compare and safely apply .env files",
  "Reuse stack templates and your own project setups",
  "Sign in and activate a Pro Lifetime license on one device",
];

const installSteps = [
  { title: "Choose the build for your Mac", description: "Use Apple Silicon for M-series Macs. Choose Intel only for older x86_64 models." },
  { title: "Move EnvDock to Applications", description: "Open the downloaded .dmg and drag EnvDock into your Applications folder." },
  { title: "Add your first real project", description: "Open EnvDock and continue without an account. Sign in later only if you purchase Pro." },
];

type ReleaseManifest = {
  version: string;
  releasedAt: string;
  mac: Record<"arm64" | "x64", {
    dmg: string;
    zip: string;
    dmgSha256: string;
    zipSha256: string;
  }>;
};

async function getReleaseManifest(): Promise<ReleaseManifest | null> {
  const baseUrl = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) return null;
  try {
    const response = await fetch(`${baseUrl}/stable/manifest.json`, { next: { revalidate: 60 } });
    if (!response.ok) return null;
    return await response.json() as ReleaseManifest;
  } catch {
    return null;
  }
}

export default async function DownloadPage() {
  const manifest = await getReleaseManifest();
  const version = manifest?.version || process.env.NEXT_PUBLIC_ENVDOCK_VERSION || "0.1.0";
  const releasedAt = formatReleaseDate(manifest?.releasedAt) || process.env.NEXT_PUBLIC_ENVDOCK_RELEASE_DATE || "Early access";
  const armUrl = manifest?.mac?.arm64?.dmg || process.env.NEXT_PUBLIC_DOWNLOAD_MACOS_ARM64_URL;
  const intelUrl = manifest?.mac?.x64?.dmg || process.env.NEXT_PUBLIC_DOWNLOAD_MACOS_X64_URL;
  const armChecksum = manifest?.mac?.arm64?.dmgSha256 || process.env.NEXT_PUBLIC_DOWNLOAD_MACOS_ARM64_SHA256;
  const intelChecksum = manifest?.mac?.x64?.dmgSha256 || process.env.NEXT_PUBLIC_DOWNLOAD_MACOS_X64_SHA256;
  const notarized = process.env.NEXT_PUBLIC_MACOS_NOTARIZED === "true";

  return <MarketingLayout>
    <PageHero eyebrow={`Early access · v${version}`} title="Your next project can open ready." description="Download EnvDock for macOS and keep the environments, encrypted variables and commands that make each project run in one local workspace." />

    <section className="container-shell py-20">
      <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-border bg-card p-7 shadow-sm sm:p-8"><div className="flex items-start justify-between gap-4"><span className="download-icon"><Apple className="size-6" /></span><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">Best for most Macs</span></div><h2 className="mt-6 text-xl font-semibold">Apple Silicon</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">For M1, M2, M3, M4 and newer Macs running macOS 12 or later.</p><div className="mt-6"><DownloadButton href={armUrl} label="Download EnvDock for Apple Silicon" fileName={`EnvDock-${version}-arm64.dmg`} /></div><div className="mt-5"><p className="mb-2 text-xs font-medium">Verify your download</p><Checksum value={armChecksum} /></div></article>
        <article className="rounded-2xl border border-border bg-card p-7 shadow-sm sm:p-8"><span className="download-icon"><Laptop className="size-6" /></span><h2 className="mt-6 text-xl font-semibold">Intel</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">For older Intel-based Macs running macOS 12 or later.</p><div className="mt-6"><DownloadButton href={intelUrl} label="Download EnvDock for Intel" fileName={`EnvDock-${version}-x64.dmg`} /></div><div className="mt-5"><p className="mb-2 text-xs font-medium">Verify your download</p><Checksum value={intelChecksum} /></div></article>
      </div>

      <div className="mx-auto mt-5 flex max-w-5xl flex-col justify-between gap-5 rounded-2xl border border-dashed border-border bg-muted/30 p-7 sm:flex-row sm:items-center"><div className="flex gap-4"><span className="download-icon size-11 shrink-0"><Monitor className="size-5" /></span><div><div className="flex items-center gap-3"><h2 className="font-semibold">Waiting for Windows?</h2><span className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] text-muted-foreground">Planned</span></div><p className="mt-2 text-sm text-muted-foreground">The macOS experience comes first. Create an account to hear when the native Windows build is ready.</p></div></div><Button asChild variant="outline"><Link href="/signup">Notify me about Windows</Link></Button></div>

      <div className="mx-auto mt-8 flex max-w-5xl flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground"><span className="flex items-center gap-2"><Sparkles className="size-4 text-primary" />Version {version}</span><span className="flex items-center gap-2"><Clock3 className="size-4 text-primary" />{releasedAt}</span><span className="flex items-center gap-2"><FileDown className="size-4 text-primary" />DMG installer</span></div>
    </section>

    <section className="border-y border-border bg-card/40 py-20"><div className="container-shell grid gap-12 lg:grid-cols-2"><div><span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Three steps to a calmer setup</span><h2 className="mt-4 text-3xl font-semibold tracking-tight">Install it now. Add your first project in minutes.</h2><div className="mt-8 space-y-7">{installSteps.map((step, index) => <div key={step.title} className="flex gap-4"><span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/5 font-mono text-xs text-primary">{index + 1}</span><div><h3 className="text-sm font-semibold">{step.title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{step.description}</p></div></div>)}</div></div><div className="rounded-2xl border border-border bg-card p-7 shadow-sm"><span className="download-icon size-11"><ShieldCheck className="size-5" /></span><h2 className="mt-5 text-xl font-semibold">Install with confidence</h2>{notarized ? <p className="mt-3 text-sm leading-7 text-muted-foreground">This official build is signed with an Apple Developer ID and notarized. Gatekeeper can verify the developer and scan the app before its first launch.</p> : <p className="mt-3 text-sm leading-7 text-muted-foreground">This early-access build may still trigger an unidentified developer warning until signing and notarization are confirmed. We show that status clearly instead of asking you to guess.</p>}<div className="mt-5 flex items-start gap-3 rounded-lg border border-border bg-muted/50 p-4"><Command className="mt-0.5 size-4 shrink-0 text-primary" /><p className="text-xs leading-5 text-muted-foreground">Download only from envdock.app. When a checksum is published, compare it before installing to confirm the file has not changed.</p></div></div></div></section>

    <section className="container-shell py-20"><div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[0.75fr_1.25fr]"><div><span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">What you can do today</span><h2 className="mt-4 text-3xl font-semibold tracking-tight">Version {version}</h2><p className="mt-3 text-sm text-muted-foreground">{releasedAt} · macOS early access</p></div><div className="rounded-2xl border border-border bg-card p-7 shadow-sm"><h3 className="font-semibold">A complete local foundation, not a concept demo</h3><ul className="mt-5 space-y-4">{changelog.map(item => <li key={item} className="flex items-start gap-3 text-sm"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" /><span>{item}</span></li>)}</ul><Link href="/account" className="mt-7 inline-flex items-center gap-1 text-sm font-medium text-primary">Manage your EnvDock account <ChevronRight className="size-4" /></Link></div></div></section>
  </MarketingLayout>;
}

function formatReleaseDate(value: string | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(date);
}
