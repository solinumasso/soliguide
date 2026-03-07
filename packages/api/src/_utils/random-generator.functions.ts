import * as bcrypt from "bcryptjs";
import * as crypto from "node:crypto";

export const generateUrlToken = (): string => {
  return crypto
    .randomBytes(48)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

export const hashPassword = (value?: string): Promise<string> => {
  const hash = value ? value : generateUrlToken();
  return bcrypt.hash(hash, 4);
};
