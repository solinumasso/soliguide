import { body } from "express-validator";

export const changeMyOrgaDto = [
  body("index")
    .exists()
    .isInt({ allow_leading_zeroes: true })
    .custom((value: number, { req }) => {
      return typeof req.user.organizations[value] !== "undefined";
    }),
];
