import "server-only";

export function getTrustedOrigin(request: Request): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredUrl) return validateOrigin(configuredUrl);

  const requestOrigin = new URL(request.url).origin;
  if (process.env.NODE_ENV === "development" && isLocalOrigin(requestOrigin)) return requestOrigin;

  throw new Error("NEXT_PUBLIC_SITE_URL is not configured.");
}

function validateOrigin(value: string): string {
  const url = new URL(value);
  const isLocalDevelopment = process.env.NODE_ENV === "development" && isLocalOrigin(url.origin);
  if (url.protocol !== "https:" && !isLocalDevelopment) {
    throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS.");
  }
  return url.origin;
}

function isLocalOrigin(origin: string): boolean {
  const url = new URL(origin);
  return url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]";
}
