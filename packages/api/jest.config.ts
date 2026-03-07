import type { Config } from "jest";

const jestConfig: Config = {
  collectCoverage: false,
  coverageReporters: ["cobertura"],
  coverageDirectory: "./coverage/",
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  testTimeout: 30000, // 30 secondes pour les tests avec MongoDB
  transformIgnorePatterns: ["node_modules/(?!interface-forge)"],
};

export default jestConfig;
