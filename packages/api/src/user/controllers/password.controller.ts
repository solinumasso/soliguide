import { generateUrlToken } from "../../_utils/random-generator.functions";
import {
  generatePasswordToken,
  updatePassword,
} from "../services/passwords.service";

export const generateResetPasswordToken = async (mail: string) => {
  return await generatePasswordToken(mail, generateUrlToken());
};

export const patchPassword = async (password: string, token: string) => {
  return await updatePassword(token, password);
};
