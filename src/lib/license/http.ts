import { NextResponse } from "next/server";
import { LicenseError } from "@/lib/license/service";
import { logServerError } from "@/lib/server-log";

export function licenseErrorResponse(error: unknown) {
  if (error instanceof LicenseError) {
    return NextResponse.json(
      { error: error.message, code: error.code, license: error.payload },
      { status: error.status },
    );
  }
  logServerError("License API error", error);
  return NextResponse.json({ error: "Unable to process the license request." }, { status: 500 });
}

export function readRequiredString(value: unknown, field: string) {
  if (typeof value !== "string" || !value.trim()) {
    throw new LicenseError("INVALID_REQUEST", `${field} is required.`, 400);
  }
  return value.trim();
}
