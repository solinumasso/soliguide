import { ApiPlace } from "@soliguide/common";
import { isServiceOpenToday } from "./isOpenToday";

export const updateServicesAfterPatch = async (place: ApiPlace) => {
  if (place.services_all?.length) {
    place.services_all = await Promise.all(
      place.services_all.map(async (service) => {
        // 1. Opening hours copy
        if (!service.differentHours) {
          service.hours = place.newhours;
          service.hours.description = null;
        }

        // 2. Welcomed publics copy
        if (!service.differentPublics) {
          service.publics = place.publics;
          service.publics.description = null;
        }

        // 3. Access conditions copy
        if (!service.differentModalities) {
          service.modalities = place.modalities;
          service.modalities.appointment.precisions = null;
          service.modalities.inscription.precisions = null;
          service.modalities.orientation.precisions = null;
          service.modalities.price.precisions = null;
          service.modalities.docs = [];
          service.modalities.other = null;
        }

        // 4. 'isOpenToday' update
        service.isOpenToday = await isServiceOpenToday(service, place);

        return service;
      })
    );
  }

  return place.services_all;
};
