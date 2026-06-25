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
import { AnyBulkWriteOperation, Db, ObjectId } from "mongodb";

import {
  CAMPAIGN_LIST,
  type CampaignName,
  TempInfoType,
} from "@soliguide/common";

import { logger } from "../src/general/logger";
import type { TempServiceClosure } from "../src/temp-info/interfaces";

const message =
  "Generate missing serviceObjectId values and rebuild service closures";

const BATCH_SIZE = 500;

type PlaceServiceForMigration = {
  serviceObjectId?: ObjectId | null;
};

type PlaceForMigration = {
  _id: ObjectId;
  lieu_id: number;
  services_all: PlaceServiceForMigration[];
};

type TempInfoForMigration = {
  _id: ObjectId;
  dateDebut: Date;
  dateFin: Date | null;
  nbDays: number | null;
  place: ObjectId;
  serviceObjectId?: ObjectId | null;
  tempInfoType: TempInfoType;
};

type TempServiceClosureDocument = TempServiceClosure & {
  createdAt?: Date;
  updatedAt?: Date;
};

const missingServiceObjectIdFilter = {
  services_all: {
    $elemMatch: {
      $or: [{ serviceObjectId: { $exists: false } }, { serviceObjectId: null }],
    },
  },
};

const getCampaignName = (
  startDate: Date,
  endDate: Date | null
): string | null => {
  let campaign: string | null = null;

  for (const campaignName in CAMPAIGN_LIST) {
    if (
      endDate &&
      startDate <= CAMPAIGN_LIST[campaignName as CampaignName].dateFin &&
      CAMPAIGN_LIST[campaignName as CampaignName].dateDebutCampagne <= endDate
    ) {
      campaign = campaignName;
    } else if (
      !endDate &&
      startDate <= CAMPAIGN_LIST[campaignName as CampaignName].dateFin
    ) {
      campaign = campaignName;
    }
  }

  return campaign;
};

const buildTempServiceClosure = (
  closure: TempInfoForMigration,
  placeId: ObjectId,
  serviceObjectId: ObjectId
): TempServiceClosureDocument => {
  const now = new Date();

  return {
    startDate: closure.dateDebut,
    endDate: closure.dateFin,
    nbDays: closure.nbDays,
    place: placeId,
    serviceObjectId,
    campaign: getCampaignName(closure.dateDebut, closure.dateFin),
    createdAt: now,
    updatedAt: now,
  };
};

const rebuildTempServiceClosures = async (
  db: Db,
  places: PlaceForMigration[]
) => {
  if (places.length === 0) {
    return;
  }

  const placesById = new Map(
    places.map((place) => [place._id.toString(), place])
  );
  const placeIds = places.map((place) => place._id);

  await db
    .collection("tempServiceClosures")
    .deleteMany({ place: { $in: placeIds } });

  const tempServiceClosuresToInsert: TempServiceClosureDocument[] = [];
  const tempClosuresOnPlace = await db
    .collection<TempInfoForMigration>("tempInfos")
    .find({
      place: { $in: placeIds },
      tempInfoType: {
        $in: [TempInfoType.CLOSURE, TempInfoType.SERVICE_CLOSURE],
      },
    })
    .toArray();

  for (const closure of tempClosuresOnPlace) {
    const place = placesById.get(closure.place.toString());

    if (!place) {
      continue;
    }

    if (closure.tempInfoType === TempInfoType.SERVICE_CLOSURE) {
      if (!closure.serviceObjectId) {
        logger.error(
          `[MIGRATION] Service closure ${closure._id.toString()} has no serviceObjectId`
        );
        continue;
      }

      tempServiceClosuresToInsert.push(
        buildTempServiceClosure(closure, place._id, closure.serviceObjectId)
      );
    } else {
      for (const service of place.services_all) {
        if (!service.serviceObjectId) {
          throw new Error(
            `Place ${place.lieu_id} still has a service without serviceObjectId`
          );
        }

        tempServiceClosuresToInsert.push(
          buildTempServiceClosure(closure, place._id, service.serviceObjectId)
        );
      }
    }
  }

  if (tempServiceClosuresToInsert.length > 0) {
    await db
      .collection<TempServiceClosureDocument>("tempServiceClosures")
      .insertMany(tempServiceClosuresToInsert, { ordered: false });
  }
};

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const placesCollection = db.collection<PlaceForMigration>("lieux");
  const placesToFix = await placesCollection
    .find(missingServiceObjectIdFilter, {
      projection: { _id: 1, lieu_id: 1, services_all: 1 },
    })
    .toArray();

  let fixedServicesCount = 0;
  let batch: AnyBulkWriteOperation<PlaceForMigration>[] = [];

  for (const place of placesToFix) {
    place.services_all.forEach((service, serviceIndex) => {
      if (!service.serviceObjectId) {
        const serviceObjectId = new ObjectId();
        service.serviceObjectId = serviceObjectId;
        fixedServicesCount++;

        batch.push({
          updateOne: {
            filter: { _id: place._id },
            update: {
              $set: {
                [`services_all.${serviceIndex}.serviceObjectId`]:
                  serviceObjectId,
              },
            },
          },
        });
      }
    });

    if (batch.length >= BATCH_SIZE) {
      await placesCollection.bulkWrite(batch, { ordered: false });
      batch = [];
    }
  }

  if (batch.length > 0) {
    await placesCollection.bulkWrite(batch, { ordered: false });
  }

  logger.info(
    `[MIGRATION] Generated ${fixedServicesCount} serviceObjectId values on ${placesToFix.length} places`
  );

  await rebuildTempServiceClosures(db, placesToFix);

  logger.info(
    `[MIGRATION] Rebuilt tempServiceClosures for ${placesToFix.length} places`
  );
};

export const down = async () => {
  logger.info(
    `[ROLLBACK] - ${message} — not reversible, generated serviceObjectId values cannot be distinguished from regular values`
  );
};
