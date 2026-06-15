export const MAX_SYNC_BODY_BYTES = 8 * 1024 * 1024 + 16 * 1024;

export type SyncUpload = {
  expectedVersion: number;
  deviceId: string;
  schemaVersion: 1;
  envelope: { version: 1; algorithm: "aes-256-gcm"; keyId: string; iv: string; authTag: string; ciphertext: string };
};

export function parseSyncUpload(body: Record<string, unknown>): SyncUpload {
  for (const forbidden of ["repoPath", "targetEnvFilePath", "fileWatchMode", "recoveryKey", "plaintext"]) {
    if (forbidden in body) throw new Error(`${forbidden} is not allowed in the sync transport.`);
  }
  const envelope = body.envelope && typeof body.envelope === "object" && !Array.isArray(body.envelope)
    ? body.envelope as Record<string, unknown> : null;
  const expectedVersion = body.expectedVersion;
  const deviceId = readString(body.deviceId, "deviceId", 200);
  if (!Number.isSafeInteger(expectedVersion) || Number(expectedVersion) < 0) throw new Error("expectedVersion must be a non-negative integer.");
  if (body.schemaVersion !== 1 || envelope?.version !== 1 || envelope.algorithm !== "aes-256-gcm") throw new Error("Unsupported sync envelope version or algorithm.");
  const keyId = readBase64Url(envelope.keyId, "keyId", 200);
  const iv = readBase64Url(envelope.iv, "iv", 200);
  const authTag = readBase64Url(envelope.authTag, "authTag", 200);
  const ciphertext = readBase64Url(envelope.ciphertext, "ciphertext", 12 * 1024 * 1024);
  const payloadBytes = Buffer.byteLength(ciphertext, "utf8");
  if (payloadBytes > 8 * 1024 * 1024) throw new Error("Encrypted sync payload exceeds 8 MiB.");
  return { expectedVersion: Number(expectedVersion), deviceId, schemaVersion: 1, envelope: { version: 1, algorithm: "aes-256-gcm", keyId, iv, authTag, ciphertext } };
}

function readString(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== "string" || !value.trim() || value.length > maxLength) throw new Error(`${field} is invalid.`);
  return value.trim();
}

function readBase64Url(value: unknown, field: string, maxLength: number): string {
  const result = readString(value, field, maxLength);
  if (!/^[A-Za-z0-9_-]+$/.test(result)) throw new Error(`${field} must use base64url encoding.`);
  return result;
}
