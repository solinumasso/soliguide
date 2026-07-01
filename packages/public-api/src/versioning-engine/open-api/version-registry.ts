import { ZodObject } from "zod";

export type VersionRegistryEntry = {
  openApi: {
    requestSchema?: ZodObject;
    responses?: Record<number, ZodObject>;
  };
};

export type VersionRegistry = Record<string, VersionRegistryEntry>;
