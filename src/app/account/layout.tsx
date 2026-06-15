import type { Metadata } from "next";
import { AccountShell } from "@/components/account-shell";
import { getDisplayName, requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Account" };
export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return <AccountShell name={getDisplayName(user)} email={user.email ?? "No email"}>{children}</AccountShell>;
}
