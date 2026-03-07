import { TerritoryNotif } from "../interfaces";
import { AnyDepartmentCode } from "./DepartmentCode.type";

export type TerritoriesNotif = {
  [key in AnyDepartmentCode]?: TerritoryNotif;
};
