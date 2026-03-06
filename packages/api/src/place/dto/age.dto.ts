import { body } from "express-validator";

export const ageDto = (path = "") => {
  return [
    body(path + "publics").customSanitizer((value) => {
      if (!value.accueil) {
        value.age = { max: 99, min: 0 };
      }
      return value;
    }),

    body(path + "publics.age.min")
      .exists()
      .isInt({ allow_leading_zeroes: true, max: 99, min: 0 })
      .toInt()
      .customSanitizer((value) => {
        return value ? value : 0;
      })
      .custom((value) => {
        return value >= 0;
      })
      .withMessage("Minimum age must be greater than or equal to 0")
      .custom((value) => {
        return value <= 99;
      })
      .withMessage("Minimum age must be lower than or equal to 99"),

    body(path + "publics.age.max")
      .exists()
      .isInt({ allow_leading_zeroes: false, max: 99, min: 0 })
      .toInt()
      .customSanitizer((value) => {
        return value ? value : 99;
      })
      .custom((value) => {
        return value > 0;
      })
      .withMessage("Maximum age must be greater than or equal to 0")
      .custom((value) => {
        return value <= 99;
      })
      .withMessage("Maximum age must be lower than or equal to 99"),

    body(path + "publics.age")
      .isObject()
      .custom((value) => {
        if (value.max < value.min) {
          throw new Error(
            "Maximum age must be greater than or equal to minimum age"
          );
        }
        return true;
      }),
  ];
};
