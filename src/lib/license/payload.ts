import type { LicensePayload, LicenseRecord } from "@/lib/license/types";

const freeLimits = { projects: 1, environmentsPerProject: 1, customTemplates: 0, activeDevices: 0 };
const proLimits = { projects: null, environmentsPerProject: null, customTemplates: null, activeDevices: 1 };

export function createFreePayload(): LicensePayload {
  return { status: "free", plan: "free", limits: freeLimits, expiresAt: null, signature: "unsigned:mvp" };
}

export function createProPayload(license: LicenseRecord | null, deviceId?: string | null): LicensePayload {
  let status: LicensePayload["status"] = "inactive";
  if (license?.status === "expired") status = "expired";
  else if (license?.status === "revoked") status = "revoked";
  else if (license?.activatedDeviceId && deviceId && license.activatedDeviceId !== deviceId) status = "device_limit";
  else if (license?.activatedDeviceId) status = "active";

  return { status, plan: "pro", limits: proLimits, expiresAt: null, signature: "unsigned:mvp" };
}
