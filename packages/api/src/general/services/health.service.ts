import mongoose from "mongoose";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { CONFIG } from "../../_models";

// Cache the version at module load time (loaded once at startup)
let cachedVersion: string | null = null;

const loadVersion = (): string => {
  try {
    const paths = [
      resolve(__dirname, "../../../package.json"),
      resolve(__dirname, "../../../../package.json"),
    ];

    for (const packageJsonPath of paths) {
      try {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
        if (packageJson.version) {
          return packageJson.version;
        }
      } catch {
        continue;
      }
    }
    return CONFIG.VERSION;
  } catch {
    return CONFIG.VERSION;
  }
};

export const getVersion = (): string => {
  if (cachedVersion === null) {
    cachedVersion = loadVersion();
  }
  return cachedVersion;
};

export const checkMongo = async (): Promise<"up" | "down"> => {
  try {
    if (mongoose?.connection?.readyState !== 1) return "down";
    await mongoose.connection.db?.admin().ping();
    return "up";
  } catch {
    return "down";
  }
};
