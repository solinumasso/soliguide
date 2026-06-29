import {
  ApiPlace,
  CommonNewPlaceService,
  CommonOpeningHours,
  CommonPlaceParcours,
  DegreeOfChoiceType,
  DietaryRegimesType,
  WEEK_DAYS,
} from "@soliguide/common";

import mongoose from "mongoose";

export const removeFieldFromPlaceForDuplication = (place: any) => {
  delete place._id;
  delete place.auto;
  delete place.campaigns;
  delete place.modalities.docs;
  delete place.photos;
  delete place.seo_url;
  delete place.slugs;
  delete place.status;
  delete place.stepsDone;
  delete place.visibility;
  delete place.updatedAt;
  delete place.updatedByUserAt;
  delete place.createdAt;
  delete place.createdBy;
  delete place.__v;

  place.services_all = place.services_all.map(
    (service: CommonNewPlaceService) => {
      service.modalities.docs = [];
      service.close = {
        actif: false,
        dateDebut: null,
        dateFin: null,
      };
      service.serviceObjectId = new mongoose.Types.ObjectId();
      return service;
    }
  );

  place.tempInfos = {
    closure: {
      actif: false,
      dateDebut: null,
      dateFin: null,
      description: null,
    },
    hours: {
      actif: false,
      dateDebut: null,
      dateFin: null,
      description: null,
      hours: null,
    },
    message: {
      actif: false,
      dateDebut: null,
      dateFin: null,
      description: null,
      name: null,
    },
  };

  return place;
};

export const getHoursFromParcours = (
  parcours: CommonPlaceParcours[]
): CommonOpeningHours => {
  const hours = new CommonOpeningHours();

  for (const day of WEEK_DAYS) {
    hours[day] = { open: false, timeslot: [] };

    let start = 2359;
    let end = 0;

    for (const point of parcours) {
      if (point.hours[day].open) {
        const pointStart = point.hours[day].timeslot[0].start;
        const pointEnd = point.hours[day].timeslot[0].end;

        start = pointStart < start ? pointStart : start;
        end = pointEnd > end ? pointEnd : end;

        hours[day].open = true;
      } else {
        break;
      }
    }

    if (hours[day].open) {
      hours[day].timeslot.push({ end, start });
    }
  }

  return hours;
};

export const cleanPlaceCategorySpecificFields = (place: ApiPlace): ApiPlace => {
  place.services_all = place.services_all.map(
    (service: CommonNewPlaceService) => {
      delete service.categorySpecificFields?.nationalOriginProductType;
      delete service.categorySpecificFields?.organicOriginProductType;

      if (
        service.categorySpecificFields?.dietaryRegimesType ===
          DietaryRegimesType.DO_NOT_KNOW ||
        service.categorySpecificFields?.dietaryRegimesType ===
          DietaryRegimesType.CANNOT_ADAPT
      ) {
        delete service.categorySpecificFields?.dietaryRegimesType;
      }

      if (
        service.categorySpecificFields?.degreeOfChoiceType ===
        DegreeOfChoiceType.NO_CHOICE
      ) {
        delete service.categorySpecificFields?.degreeOfChoiceType;
      }

      return service;
    }
  );

  return place;
};
