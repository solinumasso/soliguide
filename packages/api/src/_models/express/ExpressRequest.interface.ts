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
import type { Request } from "express";

import type { ApiPlace } from "@soliguide/common";

import type { AirtableEntity, AirtableEntityType } from "../airtable";
import type { User, UserForLogs, UserPopulateType } from "../users";
import type { ApiTranslatedField } from "../../translations/interfaces";
import type { OrganizationPopulate } from "../organization";
import type {
  PlaceChangesPopulate,
  PlaceChanges,
} from "../../place-changes/interfaces/PlaceChanges.interface";
import type { ModelWithId } from "../mongo";
import { RequestInformation } from "../../middleware";

export interface ExpressRequest extends Request {
  // Airtable identifier, only used to tell that an entity has been deleted
  airtableId?: string;

  bodyValidated?: any; // Forms
  placeDeleted?: ModelWithId<ApiPlace>;
  // Exports log
  exportStartedAt?: Date;

  // Type of entity to synchronize with AT
  airtableEntity?: AirtableEntity;
  airtableEntities?: AirtableEntity[];
  airtableEntityType?: AirtableEntityType;

  // File to upload
  file?: Express.Multer.File | Express.MulterS3.File | any;

  placeChanges?: PlaceChanges | PlaceChangesPopulate | null;
  isAdminOrPro?: boolean;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;

  // Place added to the request with getPlaceFromUrl
  lieu?: any; // TODO: type it

  nbResults?: number;

  organization?: OrganizationPopulate | any;
  token?: string;
  user?: UserPopulateType | any; // TODO: type it
  requestInformation: RequestInformation;
  selectedUser?: UserPopulateType;
  userForLogs: UserForLogs;
  userToSync?: User;

  // Place updated and added to the request for translation
  updatedPlace?: ModelWithId<ApiPlace>;

  translatedField?: ApiTranslatedField;

  entityPlace?: ApiPlace[];

  // Boolean to know if the search comes from the admin of not
  adminSearch?: boolean;
}
