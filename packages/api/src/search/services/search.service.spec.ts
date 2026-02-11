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

import mongoose from "mongoose";

import { ApiPlacePhoto, ModelWithId } from "../../_models";

import { DocsModel, PhotoModel } from "../../place/models";

import { PHOTO_MOCK, ONLINE_PLACE, USER_SIMPLE } from "../../../mocks";
import { FIELDS_FOR_SEARCH } from "../constants/requests";
import {
  addNewPlace,
  getNextPlaceId,
} from "../../place/services/admin-place.service";
import { deletePlace } from "../../place/controllers";
import {
  ApiPlace,
  CommonPlaceDocument,
  CountryAreaTerritories,
  CountryCodes,
  UserStatus,
} from "@soliguide/common";
import {
  adminSearchPlacesWithParams,
  apiSearchPlacesWithParams,
  searchPlacesWithParams,
} from "./search.service";

let doc: CommonPlaceDocument;
let photo: ApiPlacePhoto;
let place: ModelWithId<ApiPlace>;

const docForTest = new CommonPlaceDocument({
  createdAt: new Date("2021-02-09T10:29:33.470Z"),
  encoding: "7bit",
  filename: "epi-sol-5e-paris-11137-1612866573453.pdf",
  lieu_id: 16303,
  mimetype: "application/pdf",
  name: "EPISOL Dossier demande accès étudiants ",
  path: "6022629d534fea359f470efe/epi-sol-5e-paris-11137-1612866573453.pdf",
  serviceId: null,
  size: 173181,
  updatedAt: new Date("2021-02-09T10:29:33.470Z"),
});

const photoForTest: ApiPlacePhoto = { ...PHOTO_MOCK };
const user: any = structuredClone(USER_SIMPLE);
user.categoriesLimitations = [];
user.status = UserStatus.API_USER;
user.areas = {
  fr: new CountryAreaTerritories<CountryCodes.FR>({
    departments: ["75"],
  }),
};

describe("Search services", () => {
  beforeAll(async () => {
    delete docForTest["_id"];

    docForTest.lieu_id = await getNextPlaceId();

    doc = await DocsModel.create(docForTest);

    delete photoForTest["_id"];
    delete photoForTest["createdAt"];
    delete photoForTest["updatedAt"];

    photo = await PhotoModel.create(photoForTest);

    delete ONLINE_PLACE["_id"];
    delete ONLINE_PLACE["lieu_id"];
    delete ONLINE_PLACE["createdAt"];
    delete ONLINE_PLACE["updatedByUserAt"];

    place = ONLINE_PLACE;
    place.modalities.docs = [doc._id];
    place.modalities.orientation.checked = true;
    place.photos = [photo._id];
    place.lieu_id = await getNextPlaceId();

    place = await addNewPlace(place);
  });

  describe("Public search should return a place without photos nor documents", () => {
    it("should return a place without photos", async () => {
      const places = await searchPlacesWithParams(
        {
          photos: {
            $exists: true,
            $type: "array",
            $ne: [],
            $not: { $size: 0 },
          },
        },
        {
          limit: 1,
          sort: { lieu_id: -1 },
          skip: 0,
          page: 0,
          fields: FIELDS_FOR_SEARCH.PLACE_PUBLIC_SEARCH,
        }
      );

      expect(places[0].photos).toBeUndefined();
    });

    it("should return a place without documents", async () => {
      const places = await searchPlacesWithParams(
        {
          "modalities.docs": {
            $exists: true,
            $type: "array",
            $ne: [],
            $not: { $size: 0 },
          },
        },
        {
          limit: 1,
          sort: { lieu_id: -1 },
          skip: 0,
          page: 0,
          fields: FIELDS_FOR_SEARCH.PLACE_PUBLIC_SEARCH,
        }
      );

      expect(places[0].modalities.docs).toBeUndefined();
    });
  });

  describe("Admin search should return a place without photos nor documents", () => {
    it("should return a place without photos", async () => {
      const places = await adminSearchPlacesWithParams({
        photos: { $not: { $size: 0 } },
      });

      expect(places[0].photos).toBeUndefined();
    });

    it("should return a place without documents", async () => {
      const places = await adminSearchPlacesWithParams({
        "modalities.docs.0": { $exists: true },
      });

      expect(places[0].modalities).toBeUndefined();
    });
  });

  describe("API search should return a place without photos nor documents", () => {
    it("should return a place without photos nor documents and without the address and the address details", async () => {
      let places = await apiSearchPlacesWithParams(
        {
          "modalities.orientation.checked": true,
          photos: { $not: { $size: 0 } },
        },
        user,
        {
          limit: 100,
          page: 1,
          skip: 0,
          sort: {},
          fields: FIELDS_FOR_SEARCH.API,
        }
      );

      expect(places[0].position.address).toBeNull();
      expect(places[0].position.complementAdresse).toBeNull();
      expect(places[0].photos).toBeUndefined();

      places = await apiSearchPlacesWithParams(
        {
          "modalities.docs": { $not: { $size: 0 } },
          "modalities.orientation.checked": true,
        },
        user,
        {
          limit: 100,
          page: 1,
          skip: 0,
          sort: {},
          fields: FIELDS_FOR_SEARCH.API,
        }
      );

      expect(places[0].position.address).toBeNull();
      expect(places[0].position.complementAdresse).toBeNull();
      expect(places[0].modalities.docs).toBeUndefined();
    });
  });

  afterAll(async () => {
    await DocsModel.findOneAndDelete({ _id: doc._id });
    await PhotoModel.findOneAndDelete({ _id: photo._id });
    await deletePlace(place);
    mongoose.connection.close();
  });
});
