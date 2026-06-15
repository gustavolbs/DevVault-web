import { Boxes, FolderKanban, Gauge, Layers3, Moon, Search, Settings, Sun, TerminalSquare } from "lucide-react";

const navigation = [
  [Gauge, "Dashboard", true],
  [FolderKanban, "Projects", false],
  [TerminalSquare, "Environments", false],
  [Layers3, "Templates", false],
  [Settings, "Settings", false],
] as const;

const stats = [
  ["Projects", "3", "Available contexts"],
  ["Environments", "7", "Across available projects"],
  ["Templates", "7", "Built-in starters"],
] as const;

const areas = [
  [FolderKanban, "Projects", "Metadata and commands"],
  [TerminalSquare, "Environments", "Variables and preparation"],
  [Layers3, "Templates", "Reusable configurations"],
] as const;

export function ProductPreview() {
  return (
    <div className="product-frame mx-auto max-w-6xl" aria-label="DevVault desktop Dashboard preview">
      <div className="product-titlebar">
        <div className="flex gap-1.5"><i /><i /><i /></div>
      </div>
      <div className="grid min-h-[500px] grid-cols-[108px_1fr] sm:grid-cols-[218px_1fr]">
        <aside className="border-r border-[var(--preview-border)] bg-[var(--preview-card)]">
          <div className="flex items-center gap-3 border-b border-[var(--preview-border)] px-4 py-5">
            <span className="flex size-8 items-center justify-center rounded-md bg-[var(--preview-primary)] text-[var(--preview-primary-foreground)]"><Boxes className="size-4" /></span>
            <div className="hidden sm:block"><p className="text-xs font-semibold text-[var(--preview-text)]">DevVault</p><p className="mt-1 text-[9px] text-[var(--preview-muted)]">Desktop workspace</p></div>
          </div>
          <nav className="space-y-1 p-3">
            {navigation.map(([Icon, label, active]) => (
              <div key={label} className={`flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[10px] font-medium ${active ? "bg-[var(--preview-accent)] text-[var(--preview-accent-foreground)]" : "text-[var(--preview-muted)]"}`}>
                <Icon className="size-3.5" /><span className="hidden sm:inline">{label}</span>
              </div>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 bg-[var(--preview-main)]">
          <header className="flex h-14 items-center justify-between border-b border-[var(--preview-border)] bg-[var(--preview-header)] px-4 sm:px-5">
            <div className="flex h-8 w-full max-w-[280px] items-center gap-2 rounded-md border border-[var(--preview-input)] bg-[var(--preview-card)] px-2.5 text-[9px] text-[var(--preview-muted)]">
              <Search className="size-3.5" />Search DevVault <kbd className="ml-auto hidden rounded border border-[var(--preview-border)] bg-[var(--preview-muted-surface)] px-1.5 py-0.5 sm:block">⌘K</kbd>
            </div>
            <div className="ml-3 hidden gap-2 sm:flex"><span className="flex size-8 items-center justify-center rounded-md border border-[var(--preview-input)] bg-[var(--preview-card)] text-[var(--preview-muted)]"><Moon className="size-3.5 dark:hidden" /><Sun className="hidden size-3.5 dark:block" /></span><span className="flex h-8 items-center gap-1.5 rounded-md border border-[var(--preview-input)] bg-[var(--preview-card)] px-2.5 text-[9px] text-[var(--preview-text)]"><Settings className="size-3.5" />Settings</span></div>
          </header>

          <main className="p-4 sm:p-7">
            <div className="flex items-end justify-between gap-3">
              <div><p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--preview-primary)]">Workspace overview</p><h3 className="mt-2 text-lg font-semibold text-[var(--preview-text)] sm:text-xl">Development workspace</h3><p className="mt-1 hidden text-[10px] text-[var(--preview-muted)] sm:block">A concise view of your local DevVault setup.</p></div>
              <span className="hidden h-8 items-center gap-1.5 rounded-md bg-[var(--preview-primary)] px-3 text-[9px] font-semibold text-[var(--preview-primary-foreground)] sm:flex"><FolderKanban className="size-3.5" />Open Projects</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
              {stats.map(([label, value, detail]) => <div key={label} className="rounded-lg border border-[var(--preview-border)] bg-[var(--preview-card)] p-3 sm:p-4"><p className="text-[9px] text-[var(--preview-muted)]">{label}</p><p className="mt-2 text-xl font-semibold text-[var(--preview-text)] sm:text-2xl">{value}</p><p className="mt-1 hidden text-[9px] text-[var(--preview-muted)] sm:block">{detail}</p></div>)}
            </div>
            <section className="mt-4 rounded-lg border border-[var(--preview-border)] bg-[var(--preview-card)] p-4 sm:p-5">
              <h4 className="text-[11px] font-semibold text-[var(--preview-text)]">Continue working</h4><p className="mt-1 hidden text-[9px] text-[var(--preview-muted)] sm:block">Choose the area that matches the task you want to perform.</p>
              <div className="mt-4 grid gap-2 lg:grid-cols-3">
                {areas.map(([Icon, title, detail]) => <div key={title} className="flex items-center gap-2.5 rounded-md border border-[var(--preview-border)] p-3"><Icon className="size-4 shrink-0 text-[var(--preview-primary)]" /><div><p className="text-[10px] font-medium text-[var(--preview-text)]">{title}</p><p className="mt-0.5 hidden text-[8px] text-[var(--preview-muted)] sm:block">{detail}</p></div></div>)}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
