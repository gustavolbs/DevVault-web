import { NextResponse, type NextRequest } from "next/server";
import { getApiUser } from "@/lib/license/auth";
import { licenseErrorResponse, readRequiredString } from "@/lib/license/http";
import { activateLicense } from "@/lib/license/service";
import { enforceRateLimit, readJsonBody } from "@/lib/api-security";

export async function POST(request: NextRequest) {
  try {
    const user = await getApiUser(request);
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    await enforceRateLimit("license-activate", user.id, 20, 60);
    const body = await readJsonBody(request);
    const deviceId = readRequiredString(body.deviceId, "deviceId");
    const licenseKey = typeof body.licenseKey === "string" ? body.licenseKey.trim() || null : null;
    return NextResponse.json(await activateLicense(user.id, licenseKey, deviceId));
  } catch (error) {
    return licenseErrorResponse(error);
  }
}
