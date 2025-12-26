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
};
export default Configuration;
