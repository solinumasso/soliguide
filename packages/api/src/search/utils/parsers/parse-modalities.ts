import { SearchModalities } from "@soliguide/common";

const applyFilter = (
  path: string,
  value: unknown,
  nosqlQuery: any,
  inService: boolean
): void => {
  if (inService) {
    nosqlQuery["services_all"]["$elemMatch"][path] = value;
  } else {
    nosqlQuery["$or"][0]["services_all"]["$elemMatch"][path] = value;
    nosqlQuery["$or"][1]["$and"].push({ [path]: value });
  }
};

export const parseModalities = (
  modalities: SearchModalities,
  nosqlQuery: any,
  inService = false
): void => {
  for (const key of Object.keys(modalities)) {
    const condModalities = modalities[key as keyof SearchModalities];

    if (key === "thermalComfort") {
      const thermalComfort =
        condModalities as SearchModalities["thermalComfort"];
      if (typeof thermalComfort?.airConditioned === "boolean") {
        applyFilter(
          "modalities.thermalComfort.airConditioned",
          thermalComfort.airConditioned,
          nosqlQuery,
          inService
        );
      }
      if (typeof thermalComfort?.heated === "boolean") {
        applyFilter(
          "modalities.thermalComfort.heated",
          thermalComfort.heated,
          nosqlQuery,
          inService
        );
      }
    } else if (key === "inconditionnel") {
      applyFilter(
        "modalities.inconditionnel",
        condModalities,
        nosqlQuery,
        inService
      );
    } else {
      applyFilter(
        `modalities.${key}.checked`,
        condModalities,
        nosqlQuery,
        inService
      );
    }
  }
};
