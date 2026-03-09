import { AnyDepartmentCode } from "@soliguide/common";

export const generateRegexTerritories = (
  territories: AnyDepartmentCode[]
): string => {
  const regex = [];

  for (let territory of territories) {
    if (territory === "2A" || territory === "2B") {
      territory = "20";
    }
    const territorySize = 5 - territory.length;
    regex.push(territory + "\\d{" + territorySize + "}");
  }

  return regex.join("|");
};
