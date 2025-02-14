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
/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from "mongoose";
import {
  FAMILY_DEFAULT_VALUES,
  PlaceType,
  PublicsAdministrative,
  PublicsGender,
  PublicsOther,
  WelcomedPublics,
  CountryCodes,
} from "@soliguide/common";

import { STEP_EMPLACEMENT_POSITION_OK } from "./bodies/STEP_EMPLACEMENT.const";
import { HOURS_OK } from "./bodies/STEP_HOURS.const";
import {
  STEP_INFOS_OK,
  STEP_INFOS_FAIL,
  PATCH_STEP_INFOS_OK,
  PATCH_STEP_INFOS_UPDATE_OK,
} from "./bodies/STEP_INFOS.const";
import { STEP_PUBLICS_OK } from "./bodies/STEP_PUBLICS.const";
import { STEP_SERVICES_OK } from "./bodies/STEP_SERVICES.const";
import {
  STEP_SOURCES_OK,
  STEP_SOURCES2_OK,
  STEP_SOURCES_FAIL,
} from "./bodies/STEP_SOURCES.const";

import { supertest, getExpectedStatus, addAuth } from "../endPointTester";

import { TestAccounts, ExpectedStatus } from "../endPointTester.type";
import { STEP_PARCOURS_OK } from "./bodies/STEP_PARCOURS.const";

const CAN_CREATE = [
  TestAccounts.USER_ADMIN_SOLIGUIDE,
  TestAccounts.USER_ADMIN_TERRITORY,
  TestAccounts.USER_PRO_OWNER,
  TestAccounts.USER_PRO_OWNER_ORGA1_EDITOR_ORGA2,
];

const CAN_EDIT = [
  TestAccounts.USER_ADMIN_SOLIGUIDE,
  TestAccounts.USER_ADMIN_TERRITORY,
  TestAccounts.USER_PRO_OWNER,
  TestAccounts.USER_PRO_OWNER_ORGA1_EDITOR_ORGA2,
];

const CAN_DELETE = [
  TestAccounts.USER_ADMIN_SOLIGUIDE,
  TestAccounts.USER_ADMIN_TERRITORY,
];

let lieu_id: null | string = null;

// Do not call location-api
jest.mock("../../src/search/services/location-api.service");

describe.each(Object.values(TestAccounts))(
  "Test admin place",
  (currentAccountTest) => {
    describe("POST /admin/places/infos", () => {
      test(`✅ Correct data - ${currentAccountTest}`, async () => {
        const response = await addAuth(
          supertest().post("/admin/places/infos").send(STEP_INFOS_OK),
          currentAccountTest
        );

        // Successful test
        const expectedStatus = getExpectedStatus(
          CAN_CREATE,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          const response = await addAuth(
            supertest().post("/admin/places/infos").send(STEP_INFOS_OK),
            CAN_CREATE[0]
          );
          lieu_id = response.body.lieu_id;
          return;
        }

        lieu_id = response.body.lieu_id;
        expect(response.body.name).toEqual("[TEST] Seconde structure de test");
        expect(response.body.placeType).toEqual(PlaceType.PLACE);
        expect(response.body.position).toEqual(null);
      });

      test(`❌ Incorrect data - ${currentAccountTest}`, async () => {
        const response = await addAuth(
          supertest().post("/admin/places/infos").send(STEP_INFOS_FAIL),
          currentAccountTest
        );

        // Failed test
        const expectedStatus = getExpectedStatus(
          CAN_CREATE,
          currentAccountTest,
          ExpectedStatus.FAIL
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        expect(response.body.length).toBeGreaterThan(1);
      });
    });

    describe("PATCH /admin/places/infos/:lieu_id", () => {
      test(`✅  Correct data - ${currentAccountTest}`, async () => {
        const response = await addAuth(
          supertest()
            .patch(`/admin/places/infos/${lieu_id}`)
            .send(PATCH_STEP_INFOS_OK),
          currentAccountTest
        );

        // Successful test
        const expectedStatus = getExpectedStatus(
          CAN_EDIT,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        const updatedPlace = response.body;
        expect(updatedPlace.entity.phones[0].label).toEqual("Marcel");
        expect(updatedPlace.historicEntry).toEqual(true);
      });

      test(`❌ Incorrect data - ${currentAccountTest}`, async () => {
        const PATCH_INFOS_FAIL = structuredClone(PATCH_STEP_INFOS_OK);
        // @ts-expect-error - delete is easier here and acceptable in tests
        delete PATCH_INFOS_FAIL.name;

        const response = await addAuth(
          supertest()
            .patch(`/admin/places/infos/${lieu_id}`)
            .send(PATCH_INFOS_FAIL),
          currentAccountTest
        );

        // Failed test
        const expectedStatus = getExpectedStatus(
          CAN_EDIT,
          currentAccountTest,
          ExpectedStatus.FAIL
        );

        expect(response.status).toEqual(expectedStatus);
      });
    });

    describe("[LIEU] PATCH POSITION /admin/places/position/:lieu_id", () => {
      test(`✅  Correct data - ${currentAccountTest}`, async () => {
        const response = await addAuth(
          supertest()
            .patch(`/admin/places/position/${lieu_id}`)
            .send(STEP_EMPLACEMENT_POSITION_OK),
          currentAccountTest
        );

        if (response.status === 400) {
          return;
        }
        // Successful test
        const expectedStatus = getExpectedStatus(
          CAN_EDIT,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        const updatedPlace = response.body;
        expect(updatedPlace.position.adresse).toEqual(
          "27 Rue Saint-Martin, 75004 Paris, France"
        );
        expect(updatedPlace.position.address).toEqual(
          "27 Rue Saint-Martin, 75004 Paris, France"
        );
        expect(updatedPlace.position.codePostal).toEqual("75004");
        expect(updatedPlace.position.postalCode).toEqual("75004");
        expect(updatedPlace.position.complementAdresse).toEqual(
          "Au coin du feu"
        );
        expect(updatedPlace.position.region).toEqual("Île-de-France");
        expect(updatedPlace.position.country).toEqual(CountryCodes.FR);
        expect(updatedPlace.position.city).toEqual("Paris");

        // @deprecated: test kept to check the code retro-compatibility
        expect(updatedPlace.position.ville).toEqual("Paris");
        expect(updatedPlace.position.departement).toEqual("Paris");
        expect(updatedPlace.position.pays).toEqual(CountryCodes.FR);
        expect(updatedPlace.historicEntry).toEqual(true);
      });

      test(`❌ Incorrect data - ${currentAccountTest}`, async () => {
        const STEP_EMPLACEMENT_POSITION_FAIL = structuredClone(
          STEP_EMPLACEMENT_POSITION_OK
        );
        delete STEP_EMPLACEMENT_POSITION_FAIL.address;

        const response = await addAuth(
          supertest()
            .patch(`/admin/places/position/${lieu_id}`)
            .send(STEP_EMPLACEMENT_POSITION_FAIL),
          currentAccountTest
        );

        // Failed test
        const expectedStatus = getExpectedStatus(
          CAN_EDIT,
          currentAccountTest,
          ExpectedStatus.FAIL
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        expect(response.body.length).toBeGreaterThan(1);
      });
    });

    describe("[LIEU] PATCH PARCOURS /admin/places/parcours/:lieu_id", () => {
      test(`✅  Correct data - ${currentAccountTest}`, async () => {
        const response = await addAuth(
          supertest()
            .patch(`/admin/places/parcours/${lieu_id}`)
            .send(STEP_PARCOURS_OK),
          currentAccountTest
        );

        if (response.status === 400) {
          return;
        }

        // Successful test
        const expectedStatus = getExpectedStatus(
          CAN_EDIT,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        const updatedPlace = response.body;

        expect(updatedPlace.parcours[0].position.address).toEqual(
          "27 Rue Saint-Martin, 75004 Paris, France"
        );

        expect(updatedPlace.parcours[0].position.postalCode).toEqual("75004");

        expect(updatedPlace.parcours[0].hours.monday.timeslot[0]).toEqual({
          end: 1230,
          start: 800,
        });
        expect(updatedPlace.parcours[0].hours.saturday.timeslot).toEqual([]);
        expect(updatedPlace.parcours[0].hours.description).toEqual(
          "Les horaires sont sympas"
        );
        expect(updatedPlace.parcours[0].description).toEqual(
          "La description de test"
        );
        expect(updatedPlace.parcours[0].photos).toEqual([]);
      });

      test(`❌ Incorrect data - ${currentAccountTest}`, async () => {
        const STEP_PARCOURS_FAIL = structuredClone(STEP_PARCOURS_OK);

        // @ts-expect-error - delete is easier here and acceptable in tests
        delete STEP_PARCOURS_FAIL[0].hours.monday;

        const response = await addAuth(
          supertest()
            .patch(`/admin/places/parcours/${lieu_id}`)
            .send(STEP_PARCOURS_FAIL),
          currentAccountTest
        );

        // Failed test
        const expectedStatus = getExpectedStatus(
          CAN_EDIT,
          currentAccountTest,
          ExpectedStatus.FAIL
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }
      });
    });

    describe("PATCH HOURS /admin/places/hours/:lieu_id", () => {
      test(`✅  Correct data - ${currentAccountTest}`, async () => {
        const PATCH_HOURS_OK = structuredClone(HOURS_OK);

        // @ts-expect-error - delete is easier here and acceptable in tests
        delete PATCH_HOURS_OK.newhours.friday;
        // @ts-expect-error - delete is easier here and acceptable in tests
        delete PATCH_HOURS_OK.newhours.saturday;

        const response = await addAuth(
          supertest()
            .patch(`/admin/places/hours/${lieu_id}`)
            .send(PATCH_HOURS_OK),
          currentAccountTest
        );

        // Successful test
        const expectedStatus = getExpectedStatus(
          CAN_EDIT,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        const updatedPlace = response.body;

        expect(updatedPlace.newhours.monday.open).toBe(true);
        expect(updatedPlace.newhours.thursday.timeslot).toEqual([
          { end: 1230, start: 800 },
          { end: 1630, start: 1400 },
          { end: 2359, start: 2300 },
        ]);
        expect(updatedPlace.newhours.friday.timeslot).toEqual([
          { end: 500, start: 0 },
        ]);
        expect(updatedPlace.newhours.saturday).toEqual({
          open: false,
          timeslot: [],
        });
        expect(updatedPlace.historicEntry).toEqual(true);
        // TODO: Resolve the problem of newhours.description being undefined
        // expect(updatedPlace.newhours.description).toEqual(
        //   "Les horaires sont sympas"
        // );
      });

      test(`❌ Incorrect data - ${currentAccountTest}`, async () => {
        const PATCH_HOURS_FAIL = structuredClone(HOURS_OK);

        PATCH_HOURS_FAIL.newhours.friday.timeslot.push({
          end: "18:00",
          start: "15:00",
        });

        const response = await addAuth(
          supertest()
            .patch(`/admin/places/hours/${lieu_id}`)
            .send(PATCH_HOURS_FAIL),
          currentAccountTest
        );

        // Failed test
        const expectedStatus = getExpectedStatus(
          CAN_EDIT,
          currentAccountTest,
          ExpectedStatus.FAIL
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        expect(response.body).toBeDefined();
      });
    });

    describe("PATCH PUBLICS /admin/places/publics/:lieu_id", () => {
      test(`✅  Correct data - ${currentAccountTest}`, async () => {
        const response = await addAuth(
          supertest()
            .patch(`/admin/places/publics/${lieu_id}`)
            .send(STEP_PUBLICS_OK.EXCLUSIVE),
          currentAccountTest
        );

        // Successful test
        const expectedStatus = getExpectedStatus(
          CAN_EDIT,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        const updatedPlace = response.body;
        expect(updatedPlace.publics).toEqual({
          accueil: WelcomedPublics.EXCLUSIVE,
          administrative: [PublicsAdministrative.regular],
          age: { max: 99, min: 18 },
          description: "Adultes masculins",
          familialle: FAMILY_DEFAULT_VALUES,
          gender: [PublicsGender.men],
          other: [
            PublicsOther.lgbt,
            PublicsOther.hiv,
            PublicsOther.prostitution,
          ],
        });
        expect(updatedPlace.historicEntry).toEqual(true);
      });

      test(`❌ Incorrect data - ${currentAccountTest}`, async () => {
        const PATCH_PUBLICS_FAIL = structuredClone(STEP_PUBLICS_OK);
        // @ts-expect-error - we are specifically testing an error case
        PATCH_PUBLICS_FAIL.EXCLUSIVE.accueil = 19;

        const response = await addAuth(
          supertest()
            .patch(`/admin/places/publics/${lieu_id}`)
            .send(PATCH_PUBLICS_FAIL),
          currentAccountTest
        );

        // Failed test
        const expectedStatus = getExpectedStatus(
          CAN_EDIT,
          currentAccountTest,
          ExpectedStatus.FAIL
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        expect(response.body).toBeDefined();
      });
    });

    describe("PATCH /admin/places/services/:lieu_id", () => {
      test(`✅  Correct data - ${currentAccountTest}`, async () => {
        const response = await addAuth(
          supertest()
            .patch(`/admin/places/services/${lieu_id}`)
            .send(STEP_SERVICES_OK),
          currentAccountTest
        );

        // Successful test
        const expectedStatus = getExpectedStatus(
          CAN_EDIT,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        const updatedPlace = response.body;
        expect(updatedPlace.services_all.length).toEqual(4);
        expect(updatedPlace.historicEntry).toEqual(true);
      });

      test(`❌ Incorrect data - ${currentAccountTest}`, async () => {
        const response = await addAuth(
          supertest().patch(`/admin/places/services/${lieu_id}`),
          currentAccountTest
        );

        // Failed test
        const expectedStatus = getExpectedStatus(
          CAN_EDIT,
          currentAccountTest,
          ExpectedStatus.FAIL
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        expect(response.body.length).toBeGreaterThan(1);
      });
    });

    describe("PUT SOURCE /admin/places/sources/:lieu_id", () => {
      test(`✅  Correct data (+url +license) - ${currentAccountTest}`, async () => {
        const response = await addAuth(
          supertest()
            .put(`/admin/places/sources/${lieu_id}`)
            .send(STEP_SOURCES_OK),
          currentAccountTest
        );

        // Successful test
        const expectedStatus = getExpectedStatus(
          CAN_EDIT,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        const updatedPlace = response.body;
        expect(updatedPlace.sources).toEqual([
          {
            name: "restos",
            ids: [
              {
                id: "111a1aa1-11a1-1111-11aa-1aa111a1aa11",
                url: "https://url.com",
              },
            ],
            license: "https://license.com",
            isOrigin: true,
          },
        ]);
        expect(updatedPlace.historicEntry).toEqual(true);
      });

      test(`✅  Correct data (-url -license) - ${currentAccountTest}`, async () => {
        const response = await addAuth(
          supertest()
            .put(`/admin/places/sources/${lieu_id}`)
            .send(STEP_SOURCES2_OK),
          currentAccountTest
        );

        // Successful test
        const expectedStatus = getExpectedStatus(
          CAN_EDIT,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        const updatedPlace = response.body;
        expect(updatedPlace.sources).toEqual([
          {
            name: "restos",
            ids: [
              {
                id: "111a1aa1-11a1-1111-11aa-1aa111a1aa11",
                url: "https://url.com",
              },
            ],
            license: "https://license.com",
            isOrigin: true,
          },
          {
            name: "dora",
            ids: [
              {
                id: "222b2bb2-22b2-2222-22bb-2bb222b2bb22",
              },
            ],
            isOrigin: false,
          },
        ]);
        expect(updatedPlace.historicEntry).toEqual(true);
      });

      test(`❌ Incorrect data - ${currentAccountTest}`, async () => {
        const response = await addAuth(
          supertest()
            .put(`/admin/places/sources/${lieu_id}`)
            .send(STEP_SOURCES_FAIL),
          currentAccountTest
        );

        // Failed test
        const expectedStatus = getExpectedStatus(
          CAN_EDIT,
          currentAccountTest,
          ExpectedStatus.FAIL
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        expect(response.body).toBeDefined();
      });
    });

    describe("DELETE SOURCE /admin/places/sources/:lieu_id", () => {
      test(`❌ Incorrect data - ${currentAccountTest}`, async () => {
        const response = await addAuth(
          supertest()
            .delete(`/admin/places/sources/${lieu_id}`)
            .send(STEP_SOURCES_FAIL),
          currentAccountTest
        );

        // Failed test
        const expectedStatus = getExpectedStatus(
          CAN_EDIT,
          currentAccountTest,
          ExpectedStatus.FAIL
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        expect(response.body).toBeDefined();
      });

      test(`✅  Correct data - ${currentAccountTest}`, async () => {
        const response = await addAuth(
          supertest()
            .delete(`/admin/places/sources/${lieu_id}`)
            .send(STEP_SOURCES_OK),
          currentAccountTest
        );

        // Successful test
        const expectedStatus = getExpectedStatus(
          CAN_EDIT,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        const updatedPlace = response.body;
        expect(updatedPlace.sources).toEqual([
          {
            name: "dora",
            ids: [
              {
                id: "222b2bb2-22b2-2222-22bb-2bb222b2bb22",
              },
            ],
            isOrigin: false,
          },
        ]);
        expect(updatedPlace.historicEntry).toEqual(true);
      });
    });

    describe("PATCH /admin/places/{field} verify historic entries", () => {
      test(`✅  Correct data (Update & No forceChanges) - ${currentAccountTest}`, async () => {
        const response = await addAuth(
          supertest()
            .patch(`/admin/places/infos/${lieu_id}`)
            .send({
              ...PATCH_STEP_INFOS_UPDATE_OK,
              forceChanges: false,
            }),
          currentAccountTest
        );

        // Successful test
        const expectedStatus = getExpectedStatus(
          CAN_EDIT,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        const updatedPlace = response.body;
        expect(updatedPlace.entity.phones[0].label).toEqual("Jean-Bertrand");
        expect(updatedPlace.historicEntry).toEqual(true);
      });
      test(`✅  Correct data (No update & forceChanges) - ${currentAccountTest}`, async () => {
        const response = await addAuth(
          supertest()
            .patch(`/admin/places/infos/${lieu_id}`)
            .send({
              ...PATCH_STEP_INFOS_UPDATE_OK,
              forceChanges: true,
            }),
          currentAccountTest
        );

        // Successful test
        const expectedStatus = getExpectedStatus(
          CAN_EDIT,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        const updatedPlace = response.body;
        expect(updatedPlace.entity.phones[0].label).toEqual("Jean-Bertrand");
        expect(updatedPlace.historicEntry).toEqual(true);
      });

      test(`✅  Correct data (No update & No forceChanges) - ${currentAccountTest}`, async () => {
        const response = await addAuth(
          supertest()
            .patch(`/admin/places/infos/${lieu_id}`)
            .send({
              ...PATCH_STEP_INFOS_UPDATE_OK,
              forceChanges: false,
            }),
          currentAccountTest
        );

        // Successful test
        const expectedStatus = getExpectedStatus(
          CAN_EDIT,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        const updatedPlace = response.body;
        expect(updatedPlace.entity.phones[0].label).toEqual("Jean-Bertrand");
        expect(updatedPlace.historicEntry).toEqual(false);
      });
    });

    describe("DELETE /admin/places/:lieu_id", () => {
      test(`✅  Correct data - ${currentAccountTest}`, async () => {
        const response = await addAuth(
          supertest().delete(`/admin/places/${lieu_id}`),
          currentAccountTest
        );

        // Successful test
        const expectedStatus = getExpectedStatus(
          CAN_DELETE,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          await addAuth(
            supertest().delete(`/admin/places/${lieu_id}`),
            CAN_DELETE[0]
          );
          return;
        }

        expect(response.body).toEqual({ message: "PLACE_DELETED" });
      });

      test(`❌ Incorrect data - ${currentAccountTest}`, async () => {
        const response = await addAuth(
          supertest().delete("/admin/places/192282888"),
          currentAccountTest
        );

        // Failed test
        const expectedStatus = getExpectedStatus(
          CAN_DELETE,
          currentAccountTest,
          ExpectedStatus.NOT_FOUND
        );

        expect(response.status).toEqual(expectedStatus);
        if (expectedStatus === 403 && response.status === 403) {
          return;
        }

        expect(response.body).toEqual({ message: "PLACE_NOT_EXIST" });
      });
    });
  }
);

afterAll(() => {
  mongoose.connection.close();
});
