import { describe, expect, it } from "vitest";
import { parseSyncUpload } from "../src/lib/sync/validation";

describe("sync envelope validation", () => {
  it("accepts the documented opaque AES-GCM envelope", () => {
    expect(parseSyncUpload({ expectedVersion: 0, deviceId: "device-123", schemaVersion: 1, envelope: { version: 1, algorithm: "aes-256-gcm", keyId: "abc", iv: "abcd", authTag: "efgh", ciphertext: "ijkl" } })).toMatchObject({ expectedVersion: 0, schemaVersion: 1 });
  });

  it("rejects local paths, unsupported algorithms and invalid encoding", () => {
    expect(() => parseSyncUpload({ expectedVersion: 0, deviceId: "device", schemaVersion: 1, repoPath: "/secret", envelope: { version: 1, algorithm: "aes-256-gcm", keyId: "a", iv: "b", authTag: "c", ciphertext: "d" } })).toThrow(/not allowed/);
    expect(() => parseSyncUpload({ expectedVersion: 0, deviceId: "device", schemaVersion: 1, envelope: { version: 1, algorithm: "plain", keyId: "a", iv: "b", authTag: "c", ciphertext: "d" } })).toThrow(/Unsupported/);
    expect(() => parseSyncUpload({ expectedVersion: 0, deviceId: "device", schemaVersion: 1, envelope: { version: 1, algorithm: "aes-256-gcm", keyId: "a", iv: "b", authTag: "c", ciphertext: "not base64" } })).toThrow(/base64url/);
  });
});
