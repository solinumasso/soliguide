import {
  ApiPlace,
  convertNewToOldHealthCategory,
  isNewHealthCategory,
  LegacyHealthCategory,
} from "@soliguide/common";

export const convertPlaceFromNewHealthToOld = (
  places: ApiPlace[]
): ApiPlace[] => {
  return places.map((place: ApiPlace) => {
    if (!place.services_all?.length) return place;

    return {
      ...place,
      services_all: place.services_all.map((service) => {
        if (!service.category) return service;

        if (!isNewHealthCategory(service.category)) return service;

        const legacyCategory = convertNewToOldHealthCategory(service.category);

        if (legacyCategory) {
          return {
            ...service,
            category: legacyCategory as LegacyHealthCategory,
          };
        }

        return service;
      }),
    };
  }) as ApiPlace[];
};
