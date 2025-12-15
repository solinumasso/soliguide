import { PlaceChanges } from "../../place-changes/interfaces/PlaceChanges.interface";
import {
  ExpressRequest,
  ExpressResponse,
  ModelWithId,
  UserPopulateType,
} from "../../_models";
import { ApiPlace } from "@soliguide/common";
import { getPlaceByParams } from "../../place/services/place.service";
import { sendPlaceChangesToMq } from "../../place-changes/middlewares/send-place-changes-to-mq.middleware";
import { getUserByParams } from "../../user/services";
import { sendUserChangesToMq } from "../../user/middlewares/send-user-changes-event-to-mq.middleware";
import { NextFunction } from "express";

export const syncPlaces = async (
  req: ExpressRequest & {
    placeChanges: PlaceChanges;
    updatedPlace: ModelWithId<ApiPlace>;
  }
) => {
  if (req.updatedPlaces) {
    for (const place of req.updatedPlaces) {
      req.updatedPlace = place;

      sendPlaceChangesToMq(req);
    }
  }
};

export const syncUsers = async (
  req: ExpressRequest & {
    isUserDeleted: boolean;
    updatedUser: UserPopulateType;
  }
) => {
  if (req.updatedUsers) {
    for (const user of req.updatedUsers) {
      req.updatedUser = user;

      sendUserChangesToMq(req);
    }
  }
};

export const syncPlacesAndNext = async (
  req: ExpressRequest & {
    placeChanges: PlaceChanges;
    updatedPlace: ModelWithId<ApiPlace>;
  },
  _res: ExpressResponse,
  next: NextFunction
) => {
  syncPlaces(req);

  return next();
};

export const syncUsersAndNext = async (
  req: ExpressRequest & {
    isUserDeleted: boolean;
    updatedUser: UserPopulateType;
  },
  _res: ExpressResponse,
  next: NextFunction
) => {
  syncUsers(req);

  return next();
};

export const getPlacesAndSync = async (
  req: ExpressRequest & {
    placeChanges: PlaceChanges;
    updatedPlace: ModelWithId<ApiPlace>;
  }
) => {
  if (req.updatedPlaces) {
    req.updatedPlaces = await Promise.all(
      req.updatedPlaces.map(
        async (place) => await getPlaceByParams({ _id: place._id })
      )
    ).then(
      (values): Array<ModelWithId<ApiPlace>> =>
        values.filter((place): place is ModelWithId<ApiPlace> => place !== null)
    );

    syncPlaces(req);
  }
};

export const getUsersAndSync = async (
  req: ExpressRequest & {
    isUserDeleted: boolean;
    updatedUser: UserPopulateType;
  }
) => {
  if (req.updatedUsers) {
    req.updatedUsers = await Promise.all(
      req.updatedUsers.map(
        async (user) => await getUserByParams({ _id: user._id })
      )
    ).then(
      (values): Array<UserPopulateType> =>
        values.filter((user): user is UserPopulateType => user !== null)
    );

    syncUsers(req);
  }
};

export const getPlacesAndUsersAndSync = async (
  req: ExpressRequest & {
    placeChanges: PlaceChanges;
    updatedPlace: ModelWithId<ApiPlace>;
  } & { isUserDeleted: boolean; updatedUser: UserPopulateType }
) => {
  getPlacesAndSync(req);

  getUsersAndSync(req);
};
