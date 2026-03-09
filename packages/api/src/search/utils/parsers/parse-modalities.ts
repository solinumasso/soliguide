import { SearchModalities } from "@soliguide/common";

export const parseModalities = (
  modalities: SearchModalities,
  nosqlQuery: any,
  inService = false
): void => {
  for (const key of Object.keys(modalities)) {
    const condModalities = modalities[key as keyof SearchModalities];

    if (key !== "inconditionnel") {
      if (inService) {
        nosqlQuery["services_all"]["$elemMatch"][`modalities.${key}.checked`] =
          condModalities;
      } else {
        nosqlQuery["$or"][0]["services_all"]["$elemMatch"][
          `modalities.${key}.checked`
        ] = condModalities;
        nosqlQuery["$or"][1]["$and"].push({
          [`modalities.${key}.checked`]: condModalities,
        });
      }
    } else {
      if (inService) {
        nosqlQuery["services_all"]["$elemMatch"]["modalities.inconditionnel"] =
          condModalities;
      } else {
        nosqlQuery["$or"][0]["services_all"]["$elemMatch"][
          "modalities.inconditionnel"
        ] = condModalities;
        nosqlQuery["$or"][1]["$and"].push({
          ["modalities.inconditionnel"]: condModalities,
        });
      }
    }
  }
};
