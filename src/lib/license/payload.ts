import type { LicensePayload, LicenseRecord } from "@/lib/license/types";

const freeLimits = { projects: 1, environmentsPerProject: 1, customTemplates: 0, historyRevisionsPerEnvironment: 10, activeDevices: 0 };
const proLimits = { projects: null, environmentsPerProject: null, customTemplates: null, historyRevisionsPerEnvironment: null, activeDevices: 1 };
const freeEntitlements = { unlimitedProjects: false, unlimitedEnvironments: false, unlimitedCustomTemplates: false, encryptedBackup: false, sync: false, unlimitedHistory: false, advancedCompare: false, commandRunner: false, quickSwitchAdvancedActions: false };
const proEntitlements = { unlimitedProjects: true, unlimitedEnvironments: true, unlimitedCustomTemplates: true, encryptedBackup: true, sync: true, unlimitedHistory: true, advancedCompare: true, commandRunner: true, quickSwitchAdvancedActions: true };

export function createFreePayload(): LicensePayload {
  return { status: "free", plan: "free", limits: freeLimits, entitlements: freeEntitlements, expiresAt: null, signature: "unsigned:mvp" };
}

export function createProPayload(license: LicenseRecord | null, deviceId?: string | null): LicensePayload {
  let status: LicensePayload["status"] = "inactive";
  if (license?.status === "expired") status = "expired";
  else if (license?.status === "revoked") status = "revoked";
  else if (license?.activatedDeviceId && deviceId && license.activatedDeviceId !== deviceId) status = "device_limit";
  else if (license?.activatedDeviceId) status = "active";

  return { status, plan: "pro", limits: proLimits, entitlements: proEntitlements, expiresAt: null, signature: "unsigned:mvp" };
}
