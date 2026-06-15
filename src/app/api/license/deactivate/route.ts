import { NextResponse, type NextRequest } from "next/server";
import { getApiUser } from "@/lib/license/auth";
import { licenseErrorResponse, readRequiredString } from "@/lib/license/http";
import { deactivateLicense } from "@/lib/license/service";

export async function POST(request: NextRequest) {
  try {
    const user = await getApiUser(request);
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const deviceId = readRequiredString(body.deviceId, "deviceId");
    return NextResponse.json(await deactivateLicense(user.id, deviceId));
  } catch (error) {
    return licenseErrorResponse(error);
  }
}
