export type LicensePlan = "free" | "pro";
export type LicensePayloadStatus = "free" | "inactive" | "active" | "device_limit" | "expired" | "revoked";

export type LicenseLimits = {
  projects: number | null;
  environmentsPerProject: number | null;
  customTemplates: number | null;
  historyRevisionsPerEnvironment: number | null;
  activeDevices: number;
};

export type LicenseEntitlements = {
  unlimitedProjects: boolean;
  unlimitedEnvironments: boolean;
  unlimitedCustomTemplates: boolean;
  encryptedBackup: boolean;
  sync: boolean;
  unlimitedHistory: boolean;
  advancedCompare: boolean;
  commandRunner: boolean;
  quickSwitchAdvancedActions: boolean;
};

export type LicensePayload = {
  status: LicensePayloadStatus;
  plan: LicensePlan;
  limits: LicenseLimits;
  entitlements: LicenseEntitlements;
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
