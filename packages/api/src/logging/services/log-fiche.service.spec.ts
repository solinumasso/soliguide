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
import "../../place/models/place.model";

import {
  PlaceStatus,
  PlaceVisibility,
  PlaceType,
  Categories,
  CountryCodes,
  SupportedLanguagesCode,
} from "@soliguide/common";

import mongoose from "mongoose";

import { generateFullName } from "../../_utils";

import * as LogFicheService from "../../logging/services/log-fiche.service";

import {
  ONLINE_PLACE,
  USER_PRO,
  USER_ADMIN_SOLIGUIDE,
  ORIGIN_SOLIGUIDE_REQUEST,
  ORIGIN_SOLINUM_ORG_REQUEST,
} from "../../../mocks";
import {
  getUserForLogs,
  getPlaceLogsFromRequest,
  logPlace,
} from "../../middleware";

describe("Teste le middleware pour logger la consultation d'une fiche", () => {
  const next = () => console.log("Test de logPlaceView");

  afterEach(async () => {
    await LogFicheService.deleteMany({});
  });

  it("Doit logger la consultation de 'ONLINE_PLACE' en français", async () => {
    const req: any = {
      lieu: ONLINE_PLACE,
      userForLogs: getUserForLogs({
        ...ORIGIN_SOLIGUIDE_REQUEST,
        params: {},
        user: USER_PRO,
      } as any),
    };

    const ficheLog = getPlaceLogsFromRequest(req);

    expect(ficheLog).toEqual({
      fiche: "5a58c0c7c1797fe45e3772ab",
      ficheId: 33,
      location: {
        areas: {
          codePostal: "75013",
          postalCode: "75013",
          department: "paris",
          departement: "paris",
          region: "ile-de-france",
          city: "paris",
          ville: "paris",
        },
        country: CountryCodes.FR,
        city: "paris",
        department: "paris",
        postalCode: "75013",
        region: "ile-de-france",
        coordinates: [2.3631959, 48.8418381],
        label: "11-bis-boulevard-de-l-hopital-75013-paris",
      },
      placeType: PlaceType.PLACE,
      seoUrl: "antenne-marcel-paul-paris-33",
      serviceCategories: [Categories.SOCIAL_ACCOMPANIMENT],
      status: PlaceStatus.ONLINE,
      userDatas: {
        email: USER_PRO.mail,
        orgaId: USER_PRO.organizations[0].organization_id,
        orgaName: USER_PRO.organizations[0].name,
        origin: "SOLIGUIDE",
        referrer: null,
        role: null,
        status: USER_PRO.status,
        territory: USER_PRO.territories[0],
        userName: generateFullName(USER_PRO.name, USER_PRO.lastname),
        user_id: USER_PRO.user_id,
        language: SupportedLanguagesCode.FR,
      },
      visibility: PlaceVisibility.ALL,
    });

    await logPlace(req, {} as any, next);

    const placeLogged = (await LogFicheService.findOne({
      ficheId: ONLINE_PLACE.lieu_id,
    })) as any;

    expect(placeLogged.ficheId).toBe(ONLINE_PLACE.lieu_id);
  });

  it("Doit logger la consultation de 'ONLINE_PLACE' en espagnol", async () => {
    const req: any = {
      lieu: ONLINE_PLACE,
      userForLogs: getUserForLogs({
        ...ORIGIN_SOLINUM_ORG_REQUEST,
        params: { lang: SupportedLanguagesCode.ES },
        user: USER_ADMIN_SOLIGUIDE,
      } as any),
    };

    const ficheLog = getPlaceLogsFromRequest(req);

    expect(ficheLog).toEqual({
      fiche: "5a58c0c7c1797fe45e3772ab",
      ficheId: 33,
      location: {
        areas: {
          codePostal: "75013",
          postalCode: "75013",
          departement: "paris",
          department: "paris",
          region: "ile-de-france",
          ville: "paris",
          city: "paris",
        },
        city: "paris",
        country: CountryCodes.FR,
        department: "paris",
        postalCode: "75013",
        region: "ile-de-france",
        coordinates: [2.3631959, 48.8418381],
        label: "11-bis-boulevard-de-l-hopital-75013-paris",
      },
      placeType: PlaceType.PLACE,
      seoUrl: "antenne-marcel-paul-paris-33",
      serviceCategories: [Categories.SOCIAL_ACCOMPANIMENT],
      status: PlaceStatus.ONLINE,
      userDatas: {
        email: USER_ADMIN_SOLIGUIDE.mail,
        orgaId: null,
        orgaName: null,
        origin: "SOLINUM_ORG",
        referrer: null,
        role: null,
        status: USER_ADMIN_SOLIGUIDE.status,
        territory: USER_ADMIN_SOLIGUIDE.territories[0],
        userName: generateFullName(
          USER_ADMIN_SOLIGUIDE.name,
          USER_ADMIN_SOLIGUIDE.lastname
        ),
        language: SupportedLanguagesCode.ES,
        user_id: 123,
      },
      visibility: PlaceVisibility.ALL,
    });

    await logPlace(
      {
        lieu: ONLINE_PLACE,
        userForLogs: getUserForLogs({
          ...ORIGIN_SOLINUM_ORG_REQUEST,
          user: USER_ADMIN_SOLIGUIDE,
        } as any),
      } as any,
      {} as any,
      next
    );

    const placeLogged = (await LogFicheService.findOne({
      ficheId: ONLINE_PLACE.lieu_id,
    })) as any;

    expect(placeLogged.ficheId).toBe(ONLINE_PLACE.lieu_id);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
