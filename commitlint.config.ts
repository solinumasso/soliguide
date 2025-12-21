/*
Soliguide: Useful information for those who need it

SPDX-FileCopyrightText: © 2024 Solinum

SPDX-License-Identifier: AGPL-3.0-only

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
import type { UserConfig, AsyncRule } from "@commitlint/types";

const doesGithubIssueExists = async (
  issueNumber: number | string
): Promise<boolean> => {
  const githubIssueUrl = `https://api.github.com/repos/solinumasso/soliguide/issues/${issueNumber}`;
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  };
  const response = await fetch(githubIssueUrl, {
    headers,
  });
  if (!response.ok) {
    // skipcq: JS-A1004 we're just logging the status code, no risk
    console.warn(`Error fetching GitHub issue: ${response.status}`);
    return false;
  }
  return true;
};

const checkGithubIssues: AsyncRule = async (ctx) => {
  const message = "missing reference to a GitHub issue (e.g. #123)";

  // Commits that don't require a GitHub issue reference
  const exemptPatterns = [
    /^chore: :pushpin: /, // Tag commits
    /^chore\(deps\):/, // Dependency updates
    /^\w+\(deps\):/, // Any type with deps scope
  ];

  const isExempt = exemptPatterns.some((pattern) =>
    pattern.test(ctx.header || "")
  );

  if (isExempt) {
    return [true];
  }

  // Check if there are any references
  if (!ctx.references || ctx.references.length === 0) {
    return [false, message];
  }

  // Validate reference format (must be GitHub issues with # prefix)
  const allReferencesAreValid = ctx.references.every(
    (reference) => reference.issue && reference.prefix === "#"
  );

  if (!allReferencesAreValid) {
    return [false, "references must be GitHub issues (e.g. #123)"];
  }

  // If GITHUB_TOKEN is available, verify issues exist
  if (process.env.GITHUB_TOKEN) {
    console.log("Verifying GitHub issues exist...");
    try {
      const issueChecks = await Promise.all(
        ctx.references.map((reference) =>
          doesGithubIssueExists(reference.issue)
        )
      );
      const allIssuesExist = issueChecks.every((exists) => exists);

      if (!allIssuesExist) {
        return [
          false,
          "one or more referenced GitHub issues do not exist or are not accessible",
        ];
      }
    } catch (error) {
      console.warn("Error checking GitHub issues:", error);
      // Continue validation even if API check fails
    }
  }

  return [true];
};

const Configuration: UserConfig = {
  extends: [
    "@commitlint/config-conventional",
    "@commitlint/config-lerna-scopes",
  ],
  rules: {
    // By default 100 characters but Deepsource links in Deepsource commits are too long
    "body-max-line-length": [2, "always", 120],
    "github-issue": [2, "always"],
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
    "scope-enum": [
      2,
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
  },
  plugins: [
    {
      rules: {
        "github-issue": checkGithubIssues,
      },
    },
  ],
};
export default Configuration;
