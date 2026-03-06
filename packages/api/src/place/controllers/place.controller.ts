import {
  CommonPlaceEntity,
  CommonPlacePosition,
  PlaceType,
} from "@soliguide/common";

import { ExpressRequest } from "../../_models";

import mongoose from "mongoose";

import { countOrgas } from "../../organization/services/organization.service";

import { FIELDS_FOR_SEARCH } from "../../search/constants/requests/FIELDS_FOR_SEARCH.const";
import { searchPlacesWithParams } from "../../search/services/search.service";

import {
  weightDistanceSourceDuplicate,
  weightEntitySourceDuplicate,
  weightLevenshteinAddressSourceDuplicate,
  weightNameSourceDuplicate,
} from "../utils/weightSourceDuplicate";

import { DuplicateWeight } from "../interfaces";

export const checkDuplicatesByAddressAndPlaceId = async (
  placeId: number,
  address: string,
  postalCode: string
) => {
  const query = {
    lieu_id: { $ne: placeId },
    "position.address": {
      $options: "i",
      $regex: new RegExp(`.*${address.replace(/, France$/i, "")}.*`),
    },
    "position.postalCode": postalCode,
  };

  const options = {
    limit: 20,
    page: 1,
    skip: 0,
    sort: {},
    fields: FIELDS_FOR_SEARCH.DEFAULT,
  };

  const duplicates = await searchPlacesWithParams(query, options);

  return duplicates;
};

export const checkDuplicatesByPlace = async (req: ExpressRequest) => {
  let key = "position.location";
  let fields = FIELDS_FOR_SEARCH.PLACE_PUBLIC_SEARCH;
  const sourcePosition = new CommonPlacePosition(req.bodyValidated.position);
  const sourceEntity = new CommonPlaceEntity(req.bodyValidated.entity);

  if (req.bodyValidated.placeType === PlaceType.ITINERARY) {
    key = `parcours.${key}`;
    fields = FIELDS_FOR_SEARCH.ITINERARY_PUBLIC_SEARCH;
  }

  const query = {
    $geoNear: {
      distanceField: "distance",
      key,
      maxDistance: 5000,
      near: {
        coordinates: sourcePosition.location.coordinates,
        type: "Point",
      },
    },
  };

  const options = {
    page: 1,
    skip: 0,
    sort: {},
    fields,
  };

  const rawDuplicates = await searchPlacesWithParams(query, options);
  const duplicateWeights: DuplicateWeight[] = rawDuplicates.map(
    (rawDuplicate) => {
      const duplicatePosition = new CommonPlacePosition(rawDuplicate.position);
      const duplicateEntity = new CommonPlaceEntity(rawDuplicate.entity);

      const weightDistance = weightDistanceSourceDuplicate(
        sourcePosition.location.coordinates,
        duplicatePosition.location.coordinates
      );
      const weightLevenshteinAddress = weightLevenshteinAddressSourceDuplicate(
        sourcePosition.address,
        duplicatePosition.address
      );
      const weightName = weightNameSourceDuplicate(
        req.bodyValidated.name,
        rawDuplicate.name
      );
      const weightEntity = weightEntitySourceDuplicate(
        sourceEntity,
        duplicateEntity
      );

      const weight =
        weightDistance + weightLevenshteinAddress + weightName + weightEntity;

      return { duplicate: rawDuplicate, weight: weight };
    }
  );

  const sortedDuplicateWeights = duplicateWeights.sort(
    (duplicateA: DuplicateWeight, duplicateB: DuplicateWeight) =>
      duplicateB.weight - duplicateA.weight
  );

  const filteredDuplicateWeights = sortedDuplicateWeights.filter(
    (duplicate) => duplicate.weight > 0.5
  );

  const duplicates = filteredDuplicateWeights.map(
    (duplicate) => duplicate.duplicate
  );

  return duplicates;
};

export const checkInOrga = async (placeObjectId: mongoose.Types.ObjectId) => {
  const result = await countOrgas({
    places: { $in: [placeObjectId] },
  });
  return result > 0;
};
