import "server-only";

import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export class ApiSecurityError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

export async function readJsonBody(request: Request, maxBytes = 16 * 1024): Promise<Record<string, unknown>> {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > maxBytes) throw new ApiSecurityError("Request body is too large.", 413);
  const text = await request.text();
  if (Buffer.byteLength(text, "utf8") > maxBytes) throw new ApiSecurityError("Request body is too large.", 413);
  if (!text) return {};
  try {
    const value = JSON.parse(text) as unknown;
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
    return value as Record<string, unknown>;
  } catch {
    throw new ApiSecurityError("Request body must be a JSON object.", 400);
  }
}

export async function enforceRateLimit(scope: string, identity: string, limit = 30, windowSeconds = 60): Promise<void> {
  const key = `${scope}:${createHash("sha256").update(identity).digest("hex")}`;
  const { data, error } = await createAdminClient().rpc("consume_api_rate_limit", {
    p_key: key,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  if (error) throw error;
  if (data !== true) throw new ApiSecurityError("Too many requests. Try again shortly.", 429);
}

export function apiSecurityErrorResponse(error: unknown): NextResponse | null {
  return error instanceof ApiSecurityError
    ? NextResponse.json({ error: error.message }, { status: error.status })
    : null;
}
