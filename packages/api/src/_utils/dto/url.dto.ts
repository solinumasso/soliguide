import { body } from "express-validator";

const addHttpsIfNeeded = (url: string) => {
  if (!/^https?:\/\//i.test(url)) {
    return "https://" + url;
  }
  return url;
};

export const checkUrlFieldDto = (urlField: string) =>
  body(urlField)
    .optional({ checkFalsy: true })
    .trim()
    .customSanitizer(addHttpsIfNeeded)
    .custom((value) => {
      // eslint-disable-next-line no-new
      new URL(value);
      return true;
    });
