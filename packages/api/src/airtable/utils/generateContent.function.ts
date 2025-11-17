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
  CAMPAIGN_DEFAULT_NAME,
  type CampaignPlaceAutonomy,
  type PlaceStatus,
  type PlaceType,
  type PlaceVisibility,
  type CampaignStatus,
  type UserStatus,
  parsePhoneNumber,
  CountryCodes,
  getPosition,
  SupportedLanguagesCode,
  Phone,
  CommonPlaceSource,
  PairingSources,
} from "@soliguide/common";

import { AT_FIELDS_IDS } from "../constants";

import {
  EMAIL_STATUS,
  PLACE_AUTONOMY_MAJ,
  PLACE_EXTERNAL_SOURCES,
  PLACE_OPENING_STATUS,
  PLACE_STATUS,
  PLACE_STATUS_MAJ,
  PLACE_TYPE,
  PLACE_VISIBILITY,
  USER_STATUS,
} from "../constants";

import {
  type AirtableEntity,
  AirtableEntityType,
  type AirtableRecordType,
  type User,
  type PlaceOpeningStatus,
} from "../../_models";

import { isCampaignActive } from "../../campaign/controllers";
import { translateServiceName } from "../../autoexport/services/parsers";

const formatOrga = (frontUrl: string, organisations: any[]): string => {
  if (organisations.length) {
    return organisations.reduce((acc: string, value: any, index: number) => {
      return index === 0
        ? `[${value.name}](${frontUrl}/organisations/${value.organization_id})`
        : acc +
            ` - [${value.name}](${frontUrl}/organisations/${value.organization_id})`;
    }, "");
  }
  return "";
};

const formatSources = (sources: CommonPlaceSource[] | undefined): string[] => {
  if (!sources || sources.length === 0) {
    return [];
  }

  return sources
    .map((source: CommonPlaceSource) => {
      if (source.name in PLACE_EXTERNAL_SOURCES) {
        return PLACE_EXTERNAL_SOURCES[source.name as PairingSources];
      }

      return undefined;
    })
    .filter((sourceName): sourceName is string => Boolean(sourceName));
};

const generateContentForPlace = (
  frontUrl: string,
  place: any,
  isCreation = false
): AirtableRecordType => {
  const position = getPosition(place);
  const territory = position?.departmentCode;

  const content = {
    id: place.atSync.airtableId,
    fields: {
      [AT_FIELDS_IDS[AirtableEntityType.PLACE].name]: place.name,
      [AT_FIELDS_IDS[AirtableEntityType.PLACE].orga]: formatOrga(
        frontUrl,
        place.organizations
      ),
      [AT_FIELDS_IDS[AirtableEntityType.PLACE].postalCode]:
        position?.postalCode,
      [AT_FIELDS_IDS[AirtableEntityType.PLACE].placeId]: place.lieu_id,
      [AT_FIELDS_IDS[AirtableEntityType.PLACE].placeType]:
        PLACE_TYPE[place.placeType as PlaceType],
      [AT_FIELDS_IDS[AirtableEntityType.PLACE].services]:
        place.services_all.map((service: any) =>
          translateServiceName(service.category, SupportedLanguagesCode.FR)
        ),
      [AT_FIELDS_IDS[AirtableEntityType.PLACE].status]:
        PLACE_STATUS[place.status as PlaceStatus],
      [AT_FIELDS_IDS[AirtableEntityType.PLACE].territory]: territory,
      [AT_FIELDS_IDS[AirtableEntityType.PLACE].city]: position?.city,
      [AT_FIELDS_IDS[AirtableEntityType.PLACE].address]: position?.address,
      [AT_FIELDS_IDS[AirtableEntityType.PLACE].visibility]:
        PLACE_VISIBILITY[place.visibility as PlaceVisibility],
      [AT_FIELDS_IDS[AirtableEntityType.PLACE].toUpdate]:
        place.campaigns[CAMPAIGN_DEFAULT_NAME].toUpdate &&
        !place.campaigns[CAMPAIGN_DEFAULT_NAME].general.updated,
      [AT_FIELDS_IDS[AirtableEntityType.PLACE].sources]: formatSources(
        place.sources
      ),
      [AT_FIELDS_IDS[AirtableEntityType.PLACE].website]:
        place.entity?.website || "",
      [AT_FIELDS_IDS[AirtableEntityType.PLACE].mail]: place.entity?.mail || "",
    },
  } as AirtableRecordType;

  if (isCreation) {
    delete content.id;
  }

  if (place.entity.phones.length > 0 && place.entity.phones[0]?.phoneNumber) {
    const phones = place.entity.phones
      .map((phone: Phone) =>
        parsePhoneNumber(phone, phone.countryCode as CountryCodes)
      )
      .filter(Boolean)
      .join("\n");

    content.fields[AT_FIELDS_IDS[AirtableEntityType.PLACE].phone] = phones;
  } else {
    content.fields[AT_FIELDS_IDS[AirtableEntityType.PLACE].phone] = "";
  }

  if (
    territory &&
    isCampaignActive([territory]) &&
    place.campaigns[CAMPAIGN_DEFAULT_NAME] &&
    place.campaigns[CAMPAIGN_DEFAULT_NAME].toUpdate
  ) {
    if (place.campaigns[CAMPAIGN_DEFAULT_NAME].autonomy) {
      content.fields[AT_FIELDS_IDS[AirtableEntityType.PLACE].autonomy] =
        PLACE_AUTONOMY_MAJ[
          place.campaigns[CAMPAIGN_DEFAULT_NAME]
            .autonomy as CampaignPlaceAutonomy
        ];
    }

    if (place.campaigns[CAMPAIGN_DEFAULT_NAME].remindMeDate) {
      content.fields[AT_FIELDS_IDS[AirtableEntityType.PLACE].remindMeDate] =
        place.campaigns[CAMPAIGN_DEFAULT_NAME].remindMeDate;
    }

    if (place.campaigns[CAMPAIGN_DEFAULT_NAME].status) {
      content.fields[AT_FIELDS_IDS[AirtableEntityType.PLACE].statusMaj] =
        PLACE_STATUS_MAJ[
          place.campaigns[CAMPAIGN_DEFAULT_NAME].status as CampaignStatus
        ];
    }
  }

  return content;
};

const generateContentForUser = (
  frontUrl: string,
  user: User,
  isCreation = false
): AirtableRecordType => {
  const content: AirtableRecordType = {
    id: user.atSync.airtableId,
    fields: {
      [AT_FIELDS_IDS[AirtableEntityType.USER].blocked]: user.blocked,
      [AT_FIELDS_IDS[AirtableEntityType.USER].firstName]: user.name,
      [AT_FIELDS_IDS[AirtableEntityType.USER].lastName]: user.lastname,
      [AT_FIELDS_IDS[AirtableEntityType.USER].email]: user.mail,
      [AT_FIELDS_IDS[AirtableEntityType.USER].orga]: formatOrga(
        frontUrl,
        user.organizations
      ),
      [AT_FIELDS_IDS[AirtableEntityType.USER].phone]: user.phone
        ? parsePhoneNumber(user.phone, CountryCodes.FR) ?? ""
        : "",
      [AT_FIELDS_IDS[AirtableEntityType.USER].status]:
        USER_STATUS[user.status as UserStatus],
      [AT_FIELDS_IDS[AirtableEntityType.USER].title]: user.title,
      [AT_FIELDS_IDS[AirtableEntityType.USER].translator]: user.translator,
      [AT_FIELDS_IDS[AirtableEntityType.USER].verified]: user.verified
        ? "Oui"
        : "Non",
      [AT_FIELDS_IDS[AirtableEntityType.USER].deleted]: false,
      [AT_FIELDS_IDS[AirtableEntityType.USER].user_id]: user.user_id,
    },
  };

  if (isCreation) {
    delete content.id;

    content.fields[AT_FIELDS_IDS[AirtableEntityType.USER].creationEmail] =
      user.mail;
    content.fields[AT_FIELDS_IDS[AirtableEntityType.USER].creationName] =
      user.name + " " + user.lastname;
    content.fields[AT_FIELDS_IDS[AirtableEntityType.USER].creationTitle] =
      user.title;
    content.fields[AT_FIELDS_IDS[AirtableEntityType.USER].creationNewUser] =
      true;
    content.fields[AT_FIELDS_IDS[AirtableEntityType.USER].creationPhone] =
      user.phone ? parsePhoneNumber(user.phone, CountryCodes.FR) ?? "" : "";
    content.fields[AT_FIELDS_IDS[AirtableEntityType.USER].creationTerritories] =
      user.territories;
  }

  if (
    isCampaignActive(user.territories) &&
    user.campaigns[CAMPAIGN_DEFAULT_NAME]?.lastEmailStatus &&
    EMAIL_STATUS[user.campaigns[CAMPAIGN_DEFAULT_NAME].lastEmailStatus]
  ) {
    content.fields[AT_FIELDS_IDS[AirtableEntityType.USER].emailStatus] =
      EMAIL_STATUS[user.campaigns[CAMPAIGN_DEFAULT_NAME].lastEmailStatus];
  }

  return content;
};

export const generateContentForCreation = (
  frontUrl: string,
  airtableEntityType: AirtableEntityType,
  airtableEntity: AirtableEntity
): AirtableRecordType => {
  let content: AirtableRecordType;

  if (airtableEntityType === AirtableEntityType.PLACE) {
    content = generateContentForPlace(frontUrl, airtableEntity, true);
  } else if (airtableEntityType === AirtableEntityType.USER) {
    content = generateContentForUser(frontUrl, airtableEntity, true);
  } else {
    throw new Error("WRONG_ENTITY_TYPE");
  }

  content.fields = getValidData(content.fields);

  return content;
};

export const generateContentForUpdate = (
  frontUrl: string,
  airtableEntityType: AirtableEntityType,
  airtableEntity: AirtableEntity
): AirtableRecordType => {
  let content: AirtableRecordType;

  if (airtableEntityType === AirtableEntityType.PLACE) {
    content = generateContentForPlace(frontUrl, airtableEntity);
  } else if (airtableEntityType === AirtableEntityType.USER) {
    content = generateContentForUser(frontUrl, airtableEntity);
  } else {
    throw new Error("WRONG_ENTITY_TYPE");
  }

  content.fields = getValidData(content.fields);

  return content;
};

export const generateContentForDeletion = (
  airtableEntityType: AirtableEntityType,
  airtableId: string
): AirtableRecordType[] => {
  if (airtableEntityType === AirtableEntityType.PLACE) {
    return [
      {
        id: airtableId,
        fields: {
          [AT_FIELDS_IDS[airtableEntityType].status]: PLACE_STATUS.DELETED,
        },
      },
    ];
  } else if (airtableEntityType === AirtableEntityType.USER) {
    return [
      {
        id: airtableId,
        fields: {
          [AT_FIELDS_IDS[airtableEntityType].deleted]: true,
        },
      },
    ];
  }

  throw new Error("WRONG_ENTITY_TYPE");
};

export const generateContentForOpening = (
  airtableId: string,
  value: PlaceOpeningStatus
): AirtableRecordType => {
  return {
    id: airtableId,
    fields: {
      [AT_FIELDS_IDS[AirtableEntityType.PLACE].opening]:
        PLACE_OPENING_STATUS[value],
    },
  };
};

const getValidData = (
  fields: AirtableRecordType["fields"]
): AirtableRecordType["fields"] => {
  fields = Object.keys(fields)
    .filter((key) => fields[key] != null) // !null and !undefined
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: fields[key],
      };
    }, {});

  return fields;
};
