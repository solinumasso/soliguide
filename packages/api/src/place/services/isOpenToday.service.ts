import mongoose from "mongoose";
import { ApiPlace, PlaceStatus } from "@soliguide/common";
import { PlaceModel } from "../models";
import { logger } from "../../general/logger";
import {
  getThemeAndUrlFromPlace,
  isPlaceOpenToday,
  isServiceOpenToday,
} from "../utils";
import { ModelWithId } from "../../_models";
import {
  AmqpSynchroAirtablePlaceEvent,
  amqpEventsSender,
  Exchange,
  RoutingKey,
} from "../../events";

/**
 * @summary Emits an Airtable synchro event for a single place whose place-level
 * isOpenToday changed. Uses the same exchange and routing key as the other
 * synchro events (`Exchange.PLACES` / `places.synchro_at`), so the message
 * reaches the n8n queue that writes back to Airtable.
 */
async function syncPlaceToAirtable(
  place: ModelWithId<ApiPlace>
): Promise<void> {
  try {
    const { theme, frontendUrl } = getThemeAndUrlFromPlace(place);

    const payload = new AmqpSynchroAirtablePlaceEvent(
      place,
      frontendUrl,
      theme
    );

    await amqpEventsSender.sendToQueue(
      Exchange.PLACES,
      `${RoutingKey.PLACES}.synchro_at`,
      payload
    );
  } catch (err) {
    logger.error(
      `SET IS_OPEN_TODAY - failed to send synchro event for place ${place.lieu_id}: ${err}`
    );
  }
}

export interface SetIsOpenTodayResult {
  placesProcessed: number;
  placesSyncedToAirtable: number;
  servicesProcessed: number;
}

export const setIsOpenToday = async (): Promise<SetIsOpenTodayResult> => {
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
  let syncCpt = 0;
  let lastId: mongoose.Types.ObjectId | null = null;

  while (loopCpt < nPotentiallyOpenedPlaces) {
    const paginatedFilter: any = {
      ...(lastId ? { _id: { $gt: lastId } } : {}),
      $or: [
        { position: { $exists: true, $ne: null } },
        { "parcours.position": { $exists: true, $ne: null } },
      ],
      status: { $nin: [PlaceStatus.DRAFT, PlaceStatus.PERMANENTLY_CLOSED] },
    };

    const places = await PlaceModel.find<ModelWithId<ApiPlace>>(paginatedFilter)
      .sort({ _id: 1 })
      // MODIF 1 : plus de .skip()
      .limit(batchSize)
      // MODIF 2 : .lean()
      .lean<Array<ModelWithId<ApiPlace>>>();

    if (places.length === 0) {
      break;
    }

    lastId = places[places.length - 1]._id;

    for (const place of places) {
      const newIsOpenToday = await isPlaceOpenToday(place);

      // Airtable holds `place.isOpenToday ?? false`: only sync on a real change
      if (newIsOpenToday !== (place.isOpenToday ?? false)) {
        place.isOpenToday = newIsOpenToday;
        await syncPlaceToAirtable(place);
        syncCpt++;
      }

      operations.push({
        updateOne: {
          filter: { lieu_id: place.lieu_id },
          timestamps: false,
          update: {
            $set: {
              isOpenToday: newIsOpenToday,
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
      operations = [];

      logger.info(`${placeCpt} PLACES ON WHICH OPENING STATUS HAS BEEN SET`);
      logger.info(
        `${serviceCpt} SERVICES ON WHICH OPENING STATUS HAS BEEN SET`
      );
    }

    loopCpt += batchSize;
  }

  logger.info(
    `${syncCpt} PLACES SYNCED TO AIRTABLE AFTER IS_OPEN_TODAY CHANGE`
  );

  return {
    placesProcessed: placeCpt,
    placesSyncedToAirtable: syncCpt,
    servicesProcessed: serviceCpt,
  };
};
