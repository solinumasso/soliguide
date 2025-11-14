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
import Airtable from "airtable";

import { logger } from "../../general/logger";

import {
  SOLIGUIDE_BASE_ID,
  SOLIGUIDE_TABLE_ID,
} from "../constants/AT_BASES_TABLES.const";

import { CONFIG } from "../../_models/config/constants/CONFIG.const";

import {
  AirtableQueryType,
  AirtableRecordType,
  AirtableEntityType,
  AirtableEntity,
} from "../../_models/airtable";

const getAtTable = (
  airtableEntityType: AirtableEntityType
): Airtable.Table<Airtable.FieldSet> => {
  const base = new Airtable({ apiKey: CONFIG.AT_API_KEY }).base(
    SOLIGUIDE_BASE_ID
  );

  return base(SOLIGUIDE_TABLE_ID[airtableEntityType]);
};

export const createRecords = async (
  airtableEntityType: AirtableEntityType,
  content: AirtableEntity
): Promise<string[]> => {
  const table = getAtTable(airtableEntityType);

  try {
    const response = await table.create(content);

    return response.map((record) => record.getId());
  } catch (e) {
    logger.error(content, `AT_CREATION for ${airtableEntityType}`);
    throw new Error(e);
  }
};

export const updateRecords = async (
  airtableEntityType: AirtableEntityType,
  content: AirtableEntity
): Promise<void> => {
  const table = getAtTable(airtableEntityType);

  try {
    // Deduplicate records by ID, keeping the last occurrence
    const uniqueContent = content.reduce(
      (acc: AirtableEntity, record: AirtableRecordType) => {
        const existingIndex = acc.findIndex(
          (item: AirtableRecordType) => item.id === record.id
        );
        if (existingIndex !== -1) {
          acc[existingIndex] = record;
        } else {
          acc.push(record);
        }
        return acc;
      },
      []
    );

    const q = Math.floor(uniqueContent.length / 10);
    const r = uniqueContent.length % 10;

    let i = 0;

    for (i; i < q; i++) {
      await table.update(uniqueContent.slice(i * 10, (i + 1) * 10));
    }

    if (r) {
      await table.update(uniqueContent.slice(i * 10, (i + 1) * 10));
    }
  } catch (e) {
    logger.error(content, `AT_UPDATE for ${airtableEntityType}`);
    throw new Error(e);
  }
};

export const getRecordByAirtableId = async (
  airtableEntityType: AirtableEntityType,
  airtableId: string
): Promise<AirtableRecordType | null> => {
  const table = getAtTable(airtableEntityType);

  try {
    const record = await table.find(airtableId);

    return { fields: record.fields, id: record.getId() };
  } catch (e) {
    if (e.statusCode !== 403 && e.statusCode !== 404) {
      logger.error(airtableId, `AT_FIND for ${airtableEntityType}`);
      throw new Error(e);
    }
    return null;
  }
};

export const findEntitiesByFormula = async (
  airtableEntityType: AirtableEntityType,
  formula: string,
  unique = false,
  fields = []
): Promise<AirtableRecordType | AirtableRecordType[] | null> => {
  const table = getAtTable(airtableEntityType);

  const atRecord: AirtableRecordType[] = [];

  const query: AirtableQueryType = { filterByFormula: formula };

  if (unique) {
    query.maxRecords = 1;
  }

  if (fields && fields.length) {
    query.fields = fields;
  }

  try {
    await table.select(query).eachPage((records, fetchNextPage) => {
      records.forEach((record) => {
        atRecord.push({ fields: record.fields, id: record.getId() });
      });

      fetchNextPage();
    });

    return atRecord.length > 0 ? (unique ? atRecord[0] : atRecord) : null;
  } catch (e) {
    logger.error(query, `AT_FIND_BY_FORMULA for ${airtableEntityType}`);

    throw new Error(e);
  }
};
