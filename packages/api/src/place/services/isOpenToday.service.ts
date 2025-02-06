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
import { PlaceStatus } from "@soliguide/common";
import { PlaceModel } from "../models";
import { logger } from "../../general/logger";
import { isPlaceOpenToday, isServiceOpenToday } from "../utils";

export const setIsOpenToday = async () => {
  //
  // 1. Reset open places
  //
  const placesReseted = await PlaceModel.updateMany(
    { isOpenToday: true },
    { $set: { isOpenToday: false } },
    { timestamps: false }
  );

  logger.info(
    `${placesReseted.modifiedCount} PLACES ON WHICH OPENING STATUS HAS BEEN RESETED`
  );

  //
  // 2. Reset open services
  //
  const servicesReseted = await PlaceModel.updateMany(
    { "services_all.isOpenToday": true },
    { $set: { "services_all.$[elem].isOpenToday": false } },
    { arrayFilters: [{ "elem.isOpenToday": true }], timestamps: false }
  );

  logger.info(
    `${servicesReseted.modifiedCount} PLACES ON WHICH OPENING STATUS HAS BEEN RESETED AT LEAST ON ONE SERVICE`
  );

  //
  // 3. Reset the places opening status
  //
  const nPotentiallyOpenedPlaces = await PlaceModel.countDocuments({
    $or: [
      { position: { $exists: true, $ne: null } },
      { "parcours.position": { $exists: true, $ne: null } },
    ],
    status: { $ne: PlaceStatus.PERMANENTLY_CLOSED },
  });

  const batchSize = 500;

  let loopCpt = 0;

  let operations = [];

  let cpt = 0;
  let placeCpt = 0;
  let serviceCpt = 0;

  while (loopCpt < nPotentiallyOpenedPlaces) {
    const places = await PlaceModel.find({
      $or: [
        { position: { $exists: true, $ne: null } },
        { "parcours.position": { $exists: true, $ne: null } },
      ],
      status: { $ne: PlaceStatus.PERMANENTLY_CLOSED },
    })
      .sort({ _id: 1 })
      .skip(loopCpt)
      .limit(batchSize);

    for (const place of places) {
      operations.push({
        updateOne: {
          filter: { lieu_id: place.lieu_id },
          timestamps: false,
          update: {
            $set: {
              isOpenToday: await isPlaceOpenToday(place),
            },
          },
        },
      });

      cpt++;
      placeCpt++;

      for (const service of place.services_all) {
        operations.push({
          updateOne: {
            arrayFilters: [{ "elem.serviceObjectId": service.serviceObjectId }],
            filter: { lieu_id: place.lieu_id },
            timestamps: false,
            update: {
              $set: {
                "services_all.$[elem].isOpenToday": await isServiceOpenToday(
                  service,
                  place
                ),
              },
            },
          },
        });

        cpt++;
        serviceCpt++;

        if (operations.length && cpt % 200 === 0) {
          await PlaceModel.bulkWrite(operations);
          operations = [];
          cpt = 0;
        }
      }

      if (operations.length && cpt % 200 === 0) {
        await PlaceModel.bulkWrite(operations);
        operations = [];
        cpt = 0;
      }
    }

    if (operations.length) {
      await PlaceModel.bulkWrite(operations);

      logger.info(`${placeCpt} PLACES ON WHICH OPENING STATUS HAS BEEN SET`);
      logger.info(
        `${serviceCpt} SERVICES ON WHICH OPENING STATUS HAS BEEN SET`
      );
    }

    loopCpt += batchSize;
  }
};
