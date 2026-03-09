import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const extensionsAvailables = {
  DOCS: [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.oasis.opendocument.text",
  ],
  PHOTOS: ["image/jpg", "image/jpeg", "image/png", "image/gif"],
};

export const validateUpload = (uploadType: "DOCS" | "PHOTOS"): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value;
    if (file) {
      const hasGoodSize = file.size < 10000000;
      const hasGoodExtension = extensionsAvailables[uploadType].includes(
        file.type
      );

      if (!hasGoodSize || !hasGoodExtension) {
        const errors: {
          fileSize?: boolean;
          fileType?: boolean;
        } = {};

        if (!hasGoodSize) {
          errors.fileSize = true;
        }
        if (!hasGoodExtension) {
          errors.fileType = true;
        }
        return errors;
      }
      return null;
    }
    return { required: true };
  };
};
