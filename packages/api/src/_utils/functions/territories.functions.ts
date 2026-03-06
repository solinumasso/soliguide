import { AnyDepartmentCode } from "@soliguide/common";

export const getOneCurrentDepartment = (
  departments: AnyDepartmentCode[],
  territoriesToCheck: AnyDepartmentCode[]
): AnyDepartmentCode | null => {
  if (!departments.length) {
    return null;
  }
  return departments.reduce(
    (acc: AnyDepartmentCode, depCode: AnyDepartmentCode) =>
      territoriesToCheck.includes(depCode) ? depCode : acc
  );
};
