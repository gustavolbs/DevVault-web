import { describe, expect, it } from "vitest";
import { safeInternalPath } from "../src/lib/auth-redirect";

describe("safeInternalPath", () => {
  it("keeps internal paths including the desktop flow", () => {
    expect(safeInternalPath("/auth/desktop?state=abc")).toBe("/auth/desktop?state=abc");
  });

  it("rejects absolute and protocol-relative redirects", () => {
    expect(safeInternalPath("https://example.com")).toBe("/account");
    expect(safeInternalPath("//example.com")).toBe("/account");
  });
});
