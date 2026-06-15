import { NextResponse } from "next/server";
import { ApiSecurityError } from "@/lib/api-security";
import { SyncApiError } from "@/lib/sync/service";
import { logServerError } from "@/lib/server-log";

export function syncResponse(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export function syncErrorResponse(error: unknown) {
  if (error instanceof SyncApiError) return syncResponse({ error: error.message, code: error.code, detail: error.detail }, error.status);
  if (error instanceof ApiSecurityError) return syncResponse({ error: error.message }, error.status);
  if (error instanceof Error && /invalid|unsupported|exceeds|base64url|required/i.test(error.message)) return syncResponse({ error: error.message, code: "INVALID_REQUEST" }, error.message.includes("8 MiB") ? 413 : 400);
  logServerError("Sync API error", error);
  return syncResponse({ error: "Unable to process the sync request." }, 500);
}

export function syncMetadata(snapshot: Record<string, unknown> | null) {
  if (!snapshot) return { configured: false, version: 0, schemaVersion: null, keyId: null, deviceId: null, payloadBytes: 0, updatedAt: null };
  return { configured: true, version: snapshot.version, schemaVersion: snapshot.schemaVersion, keyId: snapshot.keyId, deviceId: snapshot.deviceId, payloadBytes: snapshot.payloadBytes, updatedAt: snapshot.updatedAt };
}
