import type { Config } from "jest";

const jestConfig: Config = {
  collectCoverage: false,
  coverageReporters: ["cobertura"],
  coverageDirectory: "./coverage/",
  preset: "jest-preset-angular",
  globalSetup: "jest-preset-angular/global-setup",
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
};

export default jestConfig;
