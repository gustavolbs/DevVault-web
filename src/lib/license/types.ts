export type LicensePlan = "free" | "pro";
export type LicensePayloadStatus = "free" | "inactive" | "active" | "device_limit" | "expired" | "revoked";

export type LicenseLimits = {
  projects: number | null;
  environmentsPerProject: number | null;
  customTemplates: number | null;
  activeDevices: number;
};

export type LicensePayload = {
  status: LicensePayloadStatus;
  plan: LicensePlan;
  limits: LicenseLimits;
  expiresAt: string | null;
  signature: string;
};

export type LicenseRecord = {
  id: string;
  userId: string;
  licenseKey: string;
  status: "active" | "expired" | "revoked";
  plan: "pro";
  activatedDeviceId: string | null;
  activatedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
