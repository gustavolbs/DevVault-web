"use client";

import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Toast = { id: number; tone: "success" | "error"; title: string; description?: string };
type ToastInput = Omit<Toast, "id">;
const ToastContext = createContext<(toast: ToastInput) => void>(() => undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((toast: ToastInput) => setToasts((current) => [...current.slice(-2), { ...toast, id: Date.now() + Math.random() }]), []);
  return <ToastContext.Provider value={show}>{children}<div className="fixed right-4 top-20 z-[100] flex w-[min(25rem,calc(100vw-2rem))] flex-col gap-2" aria-live="polite">{toasts.map((toast) => <ToastItem key={toast.id} toast={toast} close={() => setToasts((current) => current.filter((item) => item.id !== toast.id))} />)}</div></ToastContext.Provider>;
}

function ToastItem({ toast, close }: { toast: Toast; close: () => void }) {
  useEffect(() => { const timeout = window.setTimeout(close, 4800); return () => window.clearTimeout(timeout); }, [close]);
  const Icon = toast.tone === "success" ? CheckCircle2 : AlertCircle;
  return <div className="surface-card animate-[toast-in_180ms_ease-out] bg-card/95 p-4 backdrop-blur-xl" role={toast.tone === "error" ? "alert" : "status"}><div className="flex items-start gap-3"><span className={cn("mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg", toast.tone === "success" ? "bg-primary/10 text-primary" : "bg-danger/10 text-danger")}><Icon className="size-4" /></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold">{toast.title}</p>{toast.description && <p className="mt-1 text-sm leading-5 text-muted-foreground">{toast.description}</p>}</div><button type="button" onClick={close} className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="Dismiss notification"><X className="size-4" /></button></div></div>;
}

export function useToast() { return useContext(ToastContext); }
