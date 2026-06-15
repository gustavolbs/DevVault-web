import type { NextRequest } from "next/server";
import { syncErrorResponse, syncMetadata, syncResponse } from "@/lib/sync/http";
import { getSyncSnapshot, requireSyncUser } from "@/lib/sync/service";

export async function GET(request: NextRequest) {
  try { const user = await requireSyncUser(request); return syncResponse(syncMetadata(await getSyncSnapshot(user.id))); }
  catch (error) { return syncErrorResponse(error); }
}
