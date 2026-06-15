import { NextResponse, type NextRequest } from "next/server";
import { getApiUser } from "@/lib/license/auth";
import { licenseErrorResponse, readRequiredString } from "@/lib/license/http";
import { deactivateLicense } from "@/lib/license/service";
import { enforceRateLimit, readJsonBody } from "@/lib/api-security";

export async function POST(request: NextRequest) {
  try {
    const user = await getApiUser(request);
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    await enforceRateLimit("license-deactivate", user.id, 10, 60);
    const body = await readJsonBody(request);
    const deviceId = readRequiredString(body.deviceId, "deviceId");
    return NextResponse.json(await deactivateLicense(user.id, deviceId));
  } catch (error) {
    return licenseErrorResponse(error);
  }
}
