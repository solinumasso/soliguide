import { IsEmailOptions } from "validator/lib/isEmail";

// Default values from documentation : https://github.com/validatorjs/validator.js/blob/master/README.md#:~:text=email.%0A%0Aoptions%20is%20an-,object,-which%20defaults%20to%20%7B%20allow_display_name
export const EMAIL_VALIDATOR_CONFIG: IsEmailOptions = {
  allow_display_name: false,
  require_display_name: false,
  allow_utf8_local_part: false,
  require_tld: true,
  allow_ip_domain: false,
  domain_specific_validation: false,
  blacklisted_chars: "",
};
