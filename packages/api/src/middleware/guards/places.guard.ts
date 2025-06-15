/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  CommonNewPlaceService,
  PlaceStatus,
  PlaceType,
  PlaceVisibility,
  UserStatus,
} from "@soliguide/common";

import { NextFunction } from "express";
import { ExpressRequest, ExpressResponse } from "../../_models";
import { getPlaceByParams } from "../../place/services/place.service";

import {
  canAddPlace as UserRightsCanAddPlace,
  canDeletePlace as UserRightsCanDeletePlace,
  canEditPlace as UserRightsCanEditPlace,
} from "../../user/controllers/user-rights.controller";
import { CurrentUserType } from "../../user/interfaces";

export const canAddPlace = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  if (req.user.isLogged() && (await UserRightsCanAddPlace(req.user))) {
    next();
    return;
  }
  return res.status(403).send({ message: "FORBIDDEN_USER" });
};

// Related place Admin or Soliguide admin
export const canDeletePlace = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  if (!req.user.isLogged()) {
    return res.status(403).send({ message: "FORBIDDEN_USER" });
  }

  if (await UserRightsCanDeletePlace(req.user, req.lieu)) {
    next();
    return;
  }
  return res.status(403).send({ message: "FORBIDDEN_USER" });
};

// Admins & edit users
export const canEditPlace = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  if (!req.user.isLogged()) {
    return res.status(403).send({ message: "FORBIDDEN_USER" });
  }

  if (await UserRightsCanEditPlace(req.user, req.lieu)) {
    return next();
  }
  return res.status(403).send({ message: "FORBIDDEN_USER" });
};

export const canGetPlace = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  const currentUser: CurrentUserType = req.user;

  // Cleanup data for non-pro users: no docs
  if (req.lieu.status === PlaceStatus.ONLINE) {
    if (!req.isAdminOrPro) {
      if (req.lieu.visibility === PlaceVisibility.PRO) {
        return res.status(403).send({ message: "FORBIDDEN_USER" });
      }

      req.lieu.modalities.docs = [];
      req.lieu.services_all = req.lieu.services_all.map(
        (service: CommonNewPlaceService) => {
          service.modalities.docs = [];
          return service;
        }
      );
    }

    // API users
    if (currentUser.isLogged() && currentUser.status === UserStatus.API_USER) {
      if (req.lieu.placeType !== PlaceType.PLACE || currentUser.blocked) {
        return res.status(403).send({ message: "FORBIDDEN_USER" });
      }

      const territories = currentUser.territories;
      const categoryService = req.requestInformation.categoryService;
      const categoriesLimitations = currentUser.categoriesLimitations
        ? categoryService.getFlatLeavesFromRootCategories(
            currentUser.categoriesLimitations
          )
        : [];

      if (
        !req.lieu.position ||
        (territories.length &&
          territories.indexOf(req.lieu.position.departmentCode) === -1)
      ) {
        return res.status(403).send({ message: "FORBIDDEN_USER" });
      }

      // Browse authorized categories
      let canAccessToPlace = false;

      if (categoriesLimitations?.length) {
        req.lieu.services_all.forEach((service: CommonNewPlaceService) => {
          if (
            service.category &&
            categoriesLimitations.indexOf(service.category) !== -1
          ) {
            canAccessToPlace = true;
          }
        });
        if (!canAccessToPlace) {
          return res.status(403).send({ message: "FORBIDDEN_USER" });
        }
      }
    }
    next();
    return;
  }
  if (
    req.lieu.status === PlaceStatus.PERMANENTLY_CLOSED ||
    req.lieu.status === PlaceStatus.DRAFT
  ) {
    if (!req.isAdminOrPro) {
      if (
        req.lieu.visibility === PlaceVisibility.PRO ||
        currentUser.status === UserStatus.API_USER
      ) {
        return res.status(403).send({ message: "FORBIDDEN_USER" });
      }

      req.lieu.modalities.docs = [];
      req.lieu.services_all = req.lieu.services_all.map(
        (service: CommonNewPlaceService) => {
          service.modalities.docs = [];
          return service;
        }
      );
    }
    next();
    return;
  }
  if (req.lieu.status === PlaceStatus.OFFLINE) {
    if (!req.isAdminOrPro) {
      if (req.lieu.visibility === PlaceVisibility.PRO) {
        return res.status(403).send({ message: "FORBIDDEN_USER" });
      }

      req.lieu.modalities.docs = [];
      req.lieu.services_all = req.lieu.services_all.map(
        (service: CommonNewPlaceService) => {
          service.modalities.docs = [];
          return service;
        }
      );

      if (currentUser.status === UserStatus.API_USER) {
        if (req.lieu?.placeType !== PlaceType.PLACE || currentUser.blocked) {
          return res.status(403).send({ message: "FORBIDDEN_USER" });
        }

        const territories = currentUser.territories;
        const categoriesLimitations = currentUser.categoriesLimitations;

        if (
          territories.length !== 0 &&
          territories.indexOf(req.lieu.position.departmentCode) === -1
        ) {
          return res.status(403).send({ message: "FORBIDDEN_USER" });
        }

        // Browse authorized categories
        let canAccessToPlace = false;

        if (categoriesLimitations?.length) {
          req.lieu.services_all.forEach((service: CommonNewPlaceService) => {
            if (
              service.category &&
              categoriesLimitations.indexOf(service.category) !== -1
            ) {
              canAccessToPlace = true;
            }
          });
          if (!canAccessToPlace) {
            return res.status(403).send({ message: "FORBIDDEN_USER" });
          }
        }
      }
    }
    next();
    return;
  }

  return res.status(403).send({ message: "FORBIDDEN_USER" });
};

export const canSearchPlaces = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  if (req.isAdmin) {
    next();
  } else {
    return res.status(403).send({ message: "FORBIDDEN_USER" });
  }
};

// Checks whether a place exists and add it to req
export const getPlaceFromUrl = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  const { lieu_id } = req.params;

  if (!lieu_id || lieu_id === "null") {
    return res.status(400).send({ message: "LIEU_ID_NOT_EXIST" });
  }

  const params = /^\d+$/.test(lieu_id)
    ? { lieu_id: parseInt(lieu_id, 10) }
    : { seo_url: lieu_id };

  const lieu = await getPlaceByParams(params);
  if (lieu) {
    req.lieu = lieu;
    next();
  } else {
    return res.status(404).send({ message: "PLACE_NOT_EXIST" });
  }
};
