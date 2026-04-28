const { defineConfig, globalIgnores } = require("eslint/config");

const tsParser = require("@typescript-eslint/parser");
const typescriptEslintEslintPlugin = require("@typescript-eslint/eslint-plugin");
const globals = require("globals");
const js = require("@eslint/js");

const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
      ecmaVersion: 2021,

      parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: __dirname,
      },

      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.commonjs,
      },
    },

    plugins: {
      "@typescript-eslint": typescriptEslintEslintPlugin,
    },

    extends: compat.extends(
      "plugin:@typescript-eslint/recommended",
      "prettier"
    ),
  },
  globalIgnores(["**/.eslintrc.js"]),
  globalIgnores([
    "**/node_modules",
    "**/build",
    "**/coverage",
    "**/.eslintrc.js",
    "**/.babel.config.js",
    "**/.jest.config.js",
  ]),
]);
