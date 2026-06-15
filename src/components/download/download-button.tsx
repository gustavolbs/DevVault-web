"use client";

import { CheckCircle2, Download, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/toast-provider";

export function DownloadButton({ href, label, fileName }: { href?: string; label: string; fileName: string }) {
  const [state, setState] = useState<"idle" | "starting" | "started">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toast = useToast();
  const configured = Boolean(href);

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  function startDownload() {
    if (!href || state !== "idle") return;
    setState("starting");
    const link = document.createElement("a");
    link.href = href;
    link.rel = "noopener noreferrer";
    link.target = "_blank";
    link.click();
    window.setTimeout(() => { setState("started"); toast({ tone: "success", title: "EnvDock is on its way", description: `${fileName} should appear in your Downloads folder.` }); }, 200);
    resetTimer.current = setTimeout(() => setState("idle"), 8000);
  }

  return <div>
    <Button type="button" size="lg" className="w-full" disabled={!configured || state !== "idle"} onClick={startDownload}>
      {state === "starting" && <><Loader2 className="size-4 animate-spin" />Preparing your download</>}
      {state === "started" && <><CheckCircle2 className="size-4" />Download on its way</>}
      {state === "idle" && <><Download className="size-4" />{configured ? label : "Download not configured"}</>}
    </Button>
    <p className="mt-2 text-center text-[11px] text-muted-foreground">{configured ? fileName : "Set the download URL environment variable."}</p>
  </div>;
}
