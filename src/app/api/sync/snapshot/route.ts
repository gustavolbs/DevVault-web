import type { NextRequest } from "next/server";
import { readJsonBody } from "@/lib/api-security";
import { syncErrorResponse, syncMetadata, syncResponse } from "@/lib/sync/http";
import { getSyncSnapshot, putSyncSnapshot, requireSyncUser } from "@/lib/sync/service";
import { MAX_SYNC_BODY_BYTES, parseSyncUpload } from "@/lib/sync/validation";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const user = await requireSyncUser(request);
    const snapshot = await getSyncSnapshot(user.id) as Record<string, unknown> | null;
    if (!snapshot) return syncResponse({ error: "No remote sync snapshot exists.", code: "NOT_FOUND" }, 404);
    return syncResponse({ ...syncMetadata(snapshot), envelope: { version: 1, algorithm: snapshot.algorithm, keyId: snapshot.keyId, iv: snapshot.iv, authTag: snapshot.authTag, ciphertext: snapshot.ciphertext } });
  } catch (error) { return syncErrorResponse(error); }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireSyncUser(request);
    const result = await putSyncSnapshot(user.id, parseSyncUpload(await readJsonBody(request, MAX_SYNC_BODY_BYTES)));
    if (result.result === "conflict") return syncResponse({ error: "The remote snapshot changed.", code: "SYNC_CONFLICT", current: result }, 409);
    return syncResponse(result);
  } catch (error) { return syncErrorResponse(error); }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireSyncUser(request);
    const { error } = await createAdminClient().from("sync_snapshots").delete().eq("userId", user.id);
    if (error) throw error;
    return syncResponse({ deleted: true });
  } catch (error) { return syncErrorResponse(error); }
}
