import "server-only";

export function logServerError(context: string, error: unknown): void {
  const name = error instanceof Error ? error.name : typeof error;
  const code = getSafeCode(error);
  console.error(context, code ? { name, code } : { name });
}

function getSafeCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object" || !("code" in error)) return undefined;
  const code = error.code;
  return typeof code === "string" && /^[A-Z0-9_-]{1,80}$/i.test(code) ? code : undefined;
}
