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
import { CONFIG, AirtableEntityType } from "../../_models";

import { KeyStringValueString } from "@soliguide/common";
export const AT_FIELDS_IDS: {
  [key in AirtableEntityType]: KeyStringValueString;
} = {
  PLACE: {
    autonomy: CONFIG.AT_FIELD_PLACE_CAMPAIGN_AUTONOMY,
    city: CONFIG.AT_FIELD_PLACE_CITY,
    name: CONFIG.AT_FIELD_PLACE_NAME,
    opening: CONFIG.AT_FIELD_PLACE_OPENING,
    orga: CONFIG.AT_FIELD_PLACE_ORGA,
    placeId: CONFIG.AT_FIELD_PLACE_ID,
    placeType: CONFIG.AT_FIELD_PLACE_TYPE,
    postalCode: CONFIG.AT_FIELD_PLACE_POSTAL_CODE,
    remindMeDate: CONFIG.AT_FIELD_PLACE_CAMPAIGN_REMIND_DATE,
    services: CONFIG.AT_FIELD_PLACE_SERVICES,
    status: CONFIG.AT_FIELD_PLACE_STATUS,
    statusMaj: CONFIG.AT_FIELD_PLACE_CAMPAIGN_STATUS_MAJ,
    territory: CONFIG.AT_FIELD_PLACE_TERRITORY,
    visibility: CONFIG.AT_FIELD_PLACE_VISIBILITY,
    phone: CONFIG.AT_FIELD_PLACE_PHONE,
    mail: CONFIG.AT_FIELD_PLACE_MAIL,
    toUpdate: CONFIG.AT_FIELD_PLACE_TO_UPDATE,
    sources: CONFIG.AT_FIELD_PLACE_SOURCES,
    website: CONFIG.AT_FIELD_PLACE_WEBSITE,
    address: CONFIG.AT_FIELD_PLACE_ADDRESS,
  },
  USER: {
    blocked: CONFIG.AT_FIELD_USER_BLOCKED,
    creationEmail: CONFIG.AT_FIELD_USER_CREATION_EMAIL,
    creationName: CONFIG.AT_FIELD_USER_CREATION_NAME,
    creationNewUser: CONFIG.AT_FIELD_USER_CREATION_NEW,
    creationPhone: CONFIG.AT_FIELD_USER_CREATION_PHONE,
    creationTerritories: CONFIG.AT_FIELD_USER_CREATION_TERRITORIES,
    creationTitle: CONFIG.AT_FIELD_USER_CREATION_TITLE,
    firstName: CONFIG.AT_FIELD_USER_FIRSTNAME,
    lastName: CONFIG.AT_FIELD_USER_LASTNAME,
    email: CONFIG.AT_FIELD_USER_EMAIL,
    emailStatus: CONFIG.AT_FIELD_USER_CAMPAIGN_EMAIL_STATUS,
    orga: CONFIG.AT_FIELD_USER_ORGA,
    phone: CONFIG.AT_FIELD_USER_PHONE,
    status: CONFIG.AT_FIELD_USER_STATUS,
    title: CONFIG.AT_FIELD_USER_TITLE,
    translator: CONFIG.AT_FIELD_USER_TRANSLATOR,
    verified: CONFIG.AT_FIELD_USER_VERIFIED,
    deleted: CONFIG.AT_FIELD_USER_DELETED,
    user_id: CONFIG.AT_FIELD_USER_ID,
  },
};
