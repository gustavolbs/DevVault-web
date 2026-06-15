import { NextResponse, type NextRequest } from "next/server";
import { getApiUser } from "@/lib/license/auth";
import { licenseErrorResponse } from "@/lib/license/http";
import { getLicensePayload } from "@/lib/license/service";

export async function GET(request: NextRequest) {
  try {
    const user = await getApiUser(request);
    if (!user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    const deviceId = request.nextUrl.searchParams.get("deviceId");
    return NextResponse.json(await getLicensePayload(user.id, deviceId));
  } catch (error) {
    return licenseErrorResponse(error);
  }
}
