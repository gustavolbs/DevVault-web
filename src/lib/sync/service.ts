import "server-only";

import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { enforceRateLimit } from "@/lib/api-security";
import { getApiUser } from "@/lib/license/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SyncUpload } from "@/lib/sync/validation";

export class SyncApiError extends Error {
  constructor(message: string, public status: number, public code?: string, public detail?: unknown) { super(message); }
}

export async function requireSyncUser(request: NextRequest) {
  if (!request.headers.get("authorization")?.startsWith("Bearer ")) throw new SyncApiError("Bearer authentication required.", 401);
  const user = await getApiUser(request);
  if (!user) throw new SyncApiError("Authentication required.", 401);
  await enforceRateLimit("sync", user.id, 60, 60);
  const { data, error } = await createAdminClient().from("profiles").select("plan, licenseStatus").eq("id", user.id).single();
  if (error) throw error;
  if (data.plan !== "pro" || data.licenseStatus !== "active") throw new SyncApiError("An active Pro plan is required for sync.", 403, "PRO_REQUIRED");
  return user;
}

export async function getSyncSnapshot(userId: string) {
  const { data, error } = await createAdminClient().from("sync_snapshots").select("*").eq("userId", userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function putSyncSnapshot(userId: string, upload: SyncUpload) {
  const ciphertextSha256 = createHash("sha256").update(upload.envelope.ciphertext).digest("hex");
  const { data, error } = await createAdminClient().rpc("put_sync_snapshot", {
    p_user_id: userId,
    p_expected_version: upload.expectedVersion,
    p_schema_version: upload.schemaVersion,
    p_algorithm: upload.envelope.algorithm,
    p_key_id: upload.envelope.keyId,
    p_iv: upload.envelope.iv,
    p_auth_tag: upload.envelope.authTag,
    p_ciphertext: upload.envelope.ciphertext,
    p_ciphertext_sha256: ciphertextSha256,
    p_device_id: upload.deviceId,
    p_payload_bytes: Buffer.byteLength(upload.envelope.ciphertext, "utf8"),
  });
  if (error) throw error;
  return data as Record<string, unknown>;
}
