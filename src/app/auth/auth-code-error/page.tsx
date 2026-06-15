import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function AuthCodeErrorPage() {
  return <main className="flex min-h-screen items-center justify-center px-6"><div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-xl"><Logo className="justify-center" /><span className="mx-auto mt-8 flex size-12 items-center justify-center rounded-full bg-danger/10 text-danger"><AlertCircle className="size-5" /></span><h1 className="mt-5 text-2xl font-semibold">This sign-in link is no longer valid.</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">It may have expired or already been used. Start again and we will create a fresh, secure sign-in request.</p><Button asChild className="mt-7 w-full"><Link href="/login">Start a new sign-in</Link></Button></div></main>;
}
