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

import "../../place/models/document.model";
import "../../place/models/photo.model";

import mongoose from "mongoose";

import {
  CountryCodes,
  PlaceStatus,
  PlaceTranslatedFieldElement,
  PlaceType,
  PlaceVisibility,
  SearchResults,
  TranslatedField,
  TranslatedFieldStatus,
} from "@soliguide/common";

import { ExpressResponse } from "../../_models/express/ExpressResponse.interface";

import { USER_ADMIN_SOLIGUIDE } from "../../../mocks/users/USER_ADMIN_SOLIGUIDE.mock";
import {
  generateElementsToTranslate,
  searchTranslatedFields,
} from "./translation.controller";
import { deleteTranslatedField } from "../services/translatedField.service";

describe("Tests the translations controller", () => {
  let req: any;
  let translatedFields: SearchResults<TranslatedField>;

  beforeAll(() => {
    req = {
      log: {
        error: jest.fn(),
      },
      updatedPlace: {
        description:
          "<p>Une description d'un lieu à traduire pour des tests.</p>",
        isOpenToday: true,
        lieu_id: 7,
        modalities: {
          appointment: {
            precisions: "Une précision sur le RDV à traduire pour des tests",
          },
        },
        placeType: PlaceType.PLACE,
        position: {
          departmentCode: "56",
          country: CountryCodes.FR,
        },
        services_all: [
          {
            description:
              "</p>Une description d'un service à traduire pour des tests.</p>",
            modalities: {
              description: "",
            },
            serviceObjectId: "6181a6d08ac6b179ffb9fcb3",
          },
        ],
        status: PlaceStatus.ONLINE,
        visibility: PlaceVisibility.ALL,
        country: CountryCodes.FR,
      },
      user: USER_ADMIN_SOLIGUIDE,
    };
  });

  it("Should find the three created elements", async () => {
    translatedFields = await searchTranslatedFields(
      {
        lieu_id: 7,
        status: TranslatedFieldStatus.NEED_AUTO_TRANSLATE,
      },
      req.user
    );

    expect(translatedFields.nbResults).toBe(0);

    await generateElementsToTranslate(req, {} as ExpressResponse, () => {});

    translatedFields = await searchTranslatedFields(
      {
        lieu_id: 7,
        status: TranslatedFieldStatus.NEED_AUTO_TRANSLATE,
        country: CountryCodes.FR,
      },
      req.user
    );

    expect(translatedFields.nbResults).toBe(3);
  });

  it("Should have description in translated elements", () => {
    const fields = translatedFields.results.filter(
      (element: TranslatedField) =>
        element.elementName === PlaceTranslatedFieldElement.DESCRIPTION
    );
    expect(fields.length).toEqual(1);
  });

  it("Should delete created elements", async () => {
    await deleteTranslatedField({ lieu_id: 7 });
    translatedFields = await searchTranslatedFields({ lieu_id: 7 }, req.user);
    expect(translatedFields.nbResults).toBe(0);
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
