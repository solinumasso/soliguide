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
import { NextFunction } from "express";

import { PLACE_FIELDS_NAME, USER_FIELDS_NAME } from "../constants";

import * as AirtableService from "../services/airtable.service";
import {
  updateAirtableId,
  setSynced,
} from "../services/airtableEntity.service";

import { getEntityId } from "../utils/airtableEntity.function";
import {
  generateContentForCreation,
  generateContentForDeletion,
  generateContentForOpening,
  generateContentForUpdate,
} from "../utils/generateContent.function";

import {
  AirtableEntity,
  AirtableEntityType,
  AirtableRecordType,
  PlaceOpeningStatus,
  ExpressRequest,
  ExpressResponse,
} from "../../_models";

import { logger } from "../../general/logger";

const getAirtableIdIfRecordExists = async (
  airtableEntityType: AirtableEntityType,
  entityId: number,
  airtableId = "",
  mail = null
): Promise<string | null> => {
  let record = null;
  try {
    if (airtableId) {
      record = await AirtableService.getRecordByAirtableId(
        airtableEntityType,
        airtableId
      );
    }

    if (!record) {
      const formula =
        airtableEntityType === AirtableEntityType.USER
          ? `OR({${USER_FIELDS_NAME.USER_ID}}="${entityId}",{${USER_FIELDS_NAME.EMAIL}}="${mail}")`
          : `{${PLACE_FIELDS_NAME.FICHE_ID}}="${entityId}"`;

      record = (await AirtableService.findEntitiesByFormula(
        airtableEntityType,
        formula,
        true
      )) as AirtableRecordType | null;
    }

    if (record && airtableId !== record.id) {
      await updateAirtableId(airtableEntityType, entityId, record.id ?? "");
    }

    return record?.id ? record.id : null;
  } catch (e) {
    throw new Error(e);
  }
};

export const syncAirtableRecords = async (
  frontUrl: string,
  entities: AirtableEntity[],
  airtableEntityType: AirtableEntityType,
  now: Date
): Promise<void> => {
  const updateContent = [];
  const creationContent = [];
  const creationEntityIds: number[] = [];
  const updateEntityIds: number[] = [];

  try {
    for (const airtableEntity of entities) {
      try {
        airtableEntity.atSync.airtableId = await getAirtableIdIfRecordExists(
          airtableEntityType,
          getEntityId(airtableEntity, airtableEntityType),
          airtableEntity.atSync?.airtableId,
          airtableEntity.mail
        );

        // If there is an airtableId, this means the record already exists
        if (airtableEntity.atSync.airtableId) {
          updateContent.push(
            generateContentForUpdate(
              frontUrl,
              airtableEntityType,
              airtableEntity
            )
          );
          updateEntityIds.push(getEntityId(airtableEntity, airtableEntityType));
        } else {
          creationContent.push(
            generateContentForCreation(
              frontUrl,
              airtableEntityType,
              airtableEntity
            )
          );
          creationEntityIds.push(
            getEntityId(airtableEntity, airtableEntityType)
          );
        }
      } catch (e) {
        logger.error(
          `Error processing ${airtableEntityType} with ID ${getEntityId(
            airtableEntity,
            airtableEntityType
          )}: ${e.message}`
        );
        continue;
      }
    }

    if (updateContent.length) {
      await AirtableService.updateRecords(airtableEntityType, updateContent);
    }

    if (creationContent.length) {
      const airtableIds = await AirtableService.createRecords(
        airtableEntityType,
        creationContent
      );

      for (let i = 0; i < airtableIds.length; i++) {
        await updateAirtableId(
          airtableEntityType,
          creationEntityIds[i],
          airtableIds[i]
        );
      }
    }

    await setSynced(
      airtableEntityType,
      [...creationEntityIds, ...updateEntityIds],
      now
    );
  } catch (e) {
    logger.error(e);
  }
};

export const syncAirtableRecordPlaceIsOpened = async (
  entities: AirtableEntity[],
  value: PlaceOpeningStatus
): Promise<void> => {
  const updateContent = [];
  const placeEntityType = AirtableEntityType.PLACE;

  try {
    for (const airtableEntity of entities) {
      const airtableId = await getAirtableIdIfRecordExists(
        placeEntityType,
        getEntityId(airtableEntity, placeEntityType),
        airtableEntity.atSync?.airtableId,
        airtableEntity.mail
      );

      // If there is an airtableId, this means the record already exists
      if (airtableId) {
        updateContent.push(generateContentForOpening(airtableId, value));
      }
    }

    if (updateContent.length) {
      await AirtableService.updateRecords(placeEntityType, updateContent);
    }
  } catch (e) {
    logger.error(e);
  }
};

// This function will be used as a middleware
export const syncEntityDeletion = async (
  req: ExpressRequest,
  _res: ExpressResponse,
  next: NextFunction
): Promise<void> => {
  if (!req.airtableEntityType) {
    logger.error("ENTITY_TYPE_MISSING");
    next();
  } else {
    try {
      const airtableEntityType = req.airtableEntityType;
      const airtableId = req.airtableId;

      if (airtableId) {
        const content = generateContentForDeletion(
          airtableEntityType,
          airtableId
        );

        await AirtableService.updateRecords(airtableEntityType, content);
      }
    } catch (e) {
      logger.error(e);
    }

    next();
  }
};
