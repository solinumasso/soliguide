import {
  ApiPlace,
  convertNewToOldMobilityCategory,
  isNewMobilityCategory,
  LegacyMobilityCategory,
} from "@soliguide/common";

export const convertPlaceFromNewMobilityToOld = (
  places: ApiPlace[]
): ApiPlace[] => {
  return places.map((place: ApiPlace) => {
    if (!place.services_all?.length) return place;

    return {
      ...place,
      services_all: place.services_all.map((service) => {
        if (!service.category) return service;

        // Only convert if it's a new mobility category
        if (!isNewMobilityCategory(service.category)) return service;

        const legacyCategory = convertNewToOldMobilityCategory(
          service.category
        );

        // If conversion found, return service with legacy category
        if (legacyCategory) {
          return {
            ...service,
            category: legacyCategory as LegacyMobilityCategory,
          };
        }

        return service;
      }),
    };
  }) as ApiPlace[];
};
