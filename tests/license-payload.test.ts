import { describe, expect, it } from "vitest";
import { createFreePayload, createProPayload } from "../src/lib/license/payload";

describe("license payloads", () => {
  it("publishes every desktop limit and entitlement", () => {
    expect(createFreePayload()).toMatchObject({
      limits: { projects: 1, environmentsPerProject: 1, customTemplates: 0, historyRevisionsPerEnvironment: 10 },
      entitlements: { sync: false, unlimitedHistory: false, commandRunner: false },
    });
    expect(createProPayload(null)).toMatchObject({
      limits: { projects: null, historyRevisionsPerEnvironment: null, activeDevices: 1 },
      entitlements: { sync: true, unlimitedHistory: true, commandRunner: true },
    });
  });
});
