export const PRODUCT = {
  free: {
    projects: 1,
    environmentsPerProject: 1,
    customTemplates: 0,
  },
  pro: {
    price: "$39",
    priceNote: "one-time",
    deviceLimit: 1,
  },
} as const;

export const FREE_FEATURES = [
  "Manage 1 real project, fully (1 environment)",
  "Every variable encrypted on your Mac",
  "7 built-in stack templates to start fast",
  "Import your existing .env files — no retyping",
  "Export a clean .env whenever you need one",
] as const;

export const PRO_FEATURES = [
  "Unlimited projects and environments",
  "Catch missing and changed variables before they ship",
  "Apply .env changes with preview, backup and instant rollback",
  "Run saved commands with the right environment loaded",
  "Jump anywhere with Quick Switch (⌘K)",
  "Turn your own setups into reusable templates",
  "Activate Pro on 1 device — pay once, keep it for life",
] as const;
