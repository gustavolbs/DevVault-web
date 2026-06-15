import { randomBytes } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { createFreePayload, createProPayload } from "@/lib/license/payload";
import type { LicensePayload, LicenseRecord } from "@/lib/license/types";

export async function getUserPlan(userId: string): Promise<"free" | "pro"> {
  const { data, error } = await createAdminClient().from("profiles").select("plan").eq("id", userId).single();
  if (error) throw error;
  return data.plan === "pro" ? "pro" : "free";
}

export async function getLicense(userId: string): Promise<LicenseRecord | null> {
  const { data, error } = await createAdminClient().from("licenses").select("*").eq("userId", userId).eq("plan", "pro").maybeSingle();
  if (error) throw error;
  return data as LicenseRecord | null;
}

export async function ensureProLicense(userId: string): Promise<LicenseRecord> {
  const current = await getLicense(userId);
  if (current) return current;
  const licenseKey = `ENVD-${randomBytes(10).toString("hex").toUpperCase()}`;
  const { data, error } = await createAdminClient().from("licenses").insert({ userId, licenseKey, status: "active", plan: "pro" }).select("*").single();
  if (error) throw error;
  return data as LicenseRecord;
}

export async function getLicensePayload(userId: string, deviceId?: string | null): Promise<LicensePayload> {
  const plan = await getUserPlan(userId);
  if (plan === "free") return createFreePayload();
  return createProPayload(await ensureProLicense(userId), deviceId);
}

export async function activateLicense(userId: string, licenseKey: string | null, deviceId: string): Promise<LicensePayload> {
  const plan = await getUserPlan(userId);
  if (plan === "free") return createFreePayload();

  const license = await ensureProLicense(userId);
  if (licenseKey && license.licenseKey !== licenseKey) throw new LicenseError("INVALID_LICENSE_KEY", "The license key is invalid.", 403);
  if (license.status !== "active") return createProPayload(license, deviceId);
  if (license.activatedDeviceId && license.activatedDeviceId !== deviceId) {
    throw new LicenseError("DEVICE_LIMIT", "This Pro license is already active on another device.", 409, createProPayload(license, deviceId));
  }

  if (!license.activatedDeviceId) {
    const now = new Date().toISOString();
    const { data, error } = await createAdminClient().from("licenses").update({ activatedDeviceId: deviceId, activatedAt: now, updatedAt: now }).eq("id", license.id).is("activatedDeviceId", null).select("*").maybeSingle();
    if (error) throw error;
    if (!data) throw new LicenseError("DEVICE_LIMIT", "This Pro license was activated by another device.", 409);
    return createProPayload(data as LicenseRecord, deviceId);
  }

  return createProPayload(license, deviceId);
}

export async function deactivateLicense(userId: string, deviceId: string): Promise<LicensePayload> {
  const plan = await getUserPlan(userId);
  if (plan === "free") return createFreePayload();
  const license = await ensureProLicense(userId);
  if (!license.activatedDeviceId) return createProPayload(license, deviceId);
  if (license.activatedDeviceId !== deviceId) throw new LicenseError("DEVICE_MISMATCH", "This device is not the active device.", 409);

  const now = new Date().toISOString();
  const { data, error } = await createAdminClient().from("licenses").update({ activatedDeviceId: null, activatedAt: null, updatedAt: now }).eq("id", license.id).eq("activatedDeviceId", deviceId).select("*").single();
  if (error) throw error;
  return createProPayload(data as LicenseRecord, deviceId);
}

export class LicenseError extends Error {
  constructor(public code: string, message: string, public status: number, public payload?: LicensePayload) {
    super(message);
  }
}
