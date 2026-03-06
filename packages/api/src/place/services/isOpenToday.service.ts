import { PlaceStatus } from "@soliguide/common";
import { PlaceModel } from "../models";
import { logger } from "../../general/logger";
import { isPlaceOpenToday, isServiceOpenToday } from "../utils";

export const setIsOpenToday = async () => {
  /**
   * Reset the places opening status
   */
  const nPotentiallyOpenedPlaces = await PlaceModel.countDocuments({
    $or: [
      { position: { $exists: true, $ne: null } },
      { "parcours.position": { $exists: true, $ne: null } },
    ],
    status: { $nin: [PlaceStatus.DRAFT, PlaceStatus.PERMANENTLY_CLOSED] },
  });

  const batchSize = 5000;

  let loopCpt = 0;

  let operations = [];

  let cpt = 0;
  let placeCpt = 0;
  let serviceCpt = 0;
  let lastId: any = null;

  while (loopCpt < nPotentiallyOpenedPlaces) {
    const paginatedFilter = {
      ...(lastId ? { _id: { $gt: lastId } } : {}),
      $or: [
        { position: { $exists: true, $ne: null } },
        { "parcours.position": { $exists: true, $ne: null } },
      ],
      status: { $nin: [PlaceStatus.DRAFT, PlaceStatus.PERMANENTLY_CLOSED] },
    };

    const places = await PlaceModel.find(paginatedFilter)
      .sort({ _id: 1 })
      // MODIF 1 : plus de .skip()
      .limit(batchSize)
      // MODIF 2 : .lean()
      .lean();

    if (places.length === 0) break;

    lastId = places[places.length - 1]._id;

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

        if (operations.length && cpt % 2000 === 0) {
          await PlaceModel.bulkWrite(operations);
          operations = [];
          cpt = 0;
        }
      }

      if (operations.length && cpt % 2000 === 0) {
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
