/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
module.exports = {
  root: true,
  overrides: [
    {
      files: ["*.ts"],
      parserOptions: {
        project: ["tsconfig.app.json", "tsconfig.spec.json"],
        tsconfigRootDir: __dirname,
        createDefaultProgram: true,
      },
      extends: [
        "plugin:@angular-eslint/recommended",
        // This is required if you use inline templates in Components
        "plugin:@angular-eslint/template/process-inline-templates",
        // To avoid Regexp uncompatibility with Safari
        "plugin:no-lookahead-lookbehind-regexp/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
      ],
      rules: {
        /**
         * Any TypeScript source code (NOT TEMPLATE) related rules you wish to use/reconfigure over and above the
         * recommended set provided by the @angular-eslint project would go here.
         */
        "@angular-eslint/directive-selector": [
          "error",
          {
            type: "attribute",
            prefix: "app",
            style: "camelCase",
          },
        ],
        "@angular-eslint/component-selector": [
          "error",
          {
            type: "element",
            prefix: "app",
            style: "kebab-case",
          },
        ],
      },
    },
    {
      files: ["*.html"],
      extends: ["plugin:@angular-eslint/template/recommended"],
      rules: {
        /**
         * Any template/HTML related rules you wish to use/reconfigure over and above the
         * recommended set provided by the @angular-eslint project would go here.
         */
        "@angular-eslint/template/no-call-expression": "warn",
        "@angular-eslint/template/button-has-type": "error",
        "@angular-eslint/component-max-inline-declarations": "error",
        "@angular-eslint/template/no-duplicate-attributes": "error",
        // We do have some unfortunately
        "@angular-eslint/template/click-events-have-key-events": "warn",
        "@angular-eslint/template/mouse-events-have-key-events": "error",
        "@angular-eslint/template/no-autofocus": "error",
        "@angular-eslint/template/no-distracting-elements": "error",
      },
    },
  ],
  ignorePatterns: ["src/environments/environment.prod.ts"],
};
