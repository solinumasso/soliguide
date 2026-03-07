import { ExistsOptions } from "express-validator/lib/chain";
import { NormalizeEmailOptions } from "express-validator/lib/options";

export const EMAIL_NORMALIZE_OPTIONS: NormalizeEmailOptions = {
  all_lowercase: true,
  gmail_remove_dots: false,
  gmail_remove_subaddress: false,
  icloud_remove_subaddress: false,
  outlookdotcom_remove_subaddress: false,
  yahoo_remove_subaddress: false,
};

export const PASSWORD_REGEX_VALIDATOR =
  // eslint-disable-next-line no-useless-escape
  /^(?=.*?\d)(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[!"#$%&'()*+,-.\/:;<=>?@[\]^_`{|}~]).{8,200}$/;

export const CHECK_STRING_NULL: ExistsOptions = {
  checkFalsy: true,
  checkNull: true,
};
