export function safeInternalPath(value: string | null | undefined, fallback = "/account"): string {
  return value?.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

export function getDesktopCallbackUrl(): string {
  const value = process.env.NEXT_PUBLIC_ENVDOCK_DESKTOP_CALLBACK_URL || "envdock://auth/callback";
  const url = new URL(value);
  if (url.protocol !== "envdock:" || url.hostname !== "auth" || url.pathname !== "/callback") {
    throw new Error("NEXT_PUBLIC_ENVDOCK_DESKTOP_CALLBACK_URL must be envdock://auth/callback.");
  }
  return url.toString();
}
