import { NextResponse, type NextRequest } from "next/server";
import { getApiUser } from "@/lib/license/auth";
import { licenseErrorResponse, readRequiredString } from "@/lib/license/http";
import { activateLicense, getUserPlan } from "@/lib/license/service";

export async function POST(request: NextRequest) {
  try {
    const user = await getApiUser(request);
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const deviceId = readRequiredString(body.deviceId, "deviceId");
    const plan = await getUserPlan(user.id);
    const licenseKey = plan === "pro" ? readRequiredString(body.licenseKey, "licenseKey") : "";
    return NextResponse.json(await activateLicense(user.id, licenseKey, deviceId));
  } catch (error) {
    return licenseErrorResponse(error);
  }
}
