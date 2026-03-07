import type { UserConfig } from "@commitlint/types";

const Configuration: UserConfig = {
  extends: [
    "@commitlint/config-conventional",
    "@commitlint/config-lerna-scopes",
  ],
  rules: {
    // By default 100 characters but Deepsource links in Deepsource commits are too long
    "body-max-line-length": [2, "always", 120],
    // Explicitly enable all conventional commit types including chore
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
      ],
    ],
    // Add additional scopes beyond lerna scopes (project names)
    // Changed to warning level (1) instead of error (2) to be more permissive
    "scope-enum": [
      1,
      "always",
      [
        // Additional general scopes
        "deps",
        "chore",
        // Lerna package scopes (project names)
        "api",
        "location-api",
        "soligare",
        "frontend",
        "widget",
        "web-app",
        "design-system",
        "common",
        "common-angular",
        "icons-generator",
      ],
    ],
    // Make scope optional instead of required
    "scope-empty": [0],
    // Allow subject to start with uppercase (for version tags like "V5.0.0")
    "subject-case": [0],
  },
};
export default Configuration;
