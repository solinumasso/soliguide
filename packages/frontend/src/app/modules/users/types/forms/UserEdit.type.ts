import { AnyDepartmentCode } from "@soliguide/common";

export type UserEdit = {
  mail: string;
  name: string;
  lastname: string;
  title?: string;
  phone?: string;
  languages?: string;
  translator?: boolean;
  territories: AnyDepartmentCode[];
};
