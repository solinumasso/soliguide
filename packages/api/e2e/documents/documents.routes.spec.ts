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
import fs from "fs-extra";

import { ExpectedStatus, TestAccounts } from "../endPointTester.type";
import { supertest, getExpectedStatus, addAuth } from "../endPointTester";
import documentService from "./../../src/place/services/document.services";
import { getPlaceByParams } from "../../src/place/services/place.service";

const ALLOWED_USERS = [
  TestAccounts.USER_ADMIN_SOLIGUIDE,
  TestAccounts.USER_ADMIN_TERRITORY,
  TestAccounts.USER_PRO_OWNER,
  TestAccounts.USER_PRO_EDITOR,
  TestAccounts.USER_PRO_OWNER_ORGA1_EDITOR_ORGA2,
];

const lieuId = 2;

const deletePlaceLastDocument = async () => {
  const place = await getPlaceByParams({ lieu_id: lieuId });
  if (place?.modalities.docs?.length) {
    await documentService.deleteDocument(
      place.modalities.docs[place.modalities.docs.length - 1]._id
    );
  }
};

const postValidDocument = (user: TestAccounts) => {
  return addAuth(
    supertest()
      .post(`/documents/${lieuId}`)
      .field("name", "Test")
      .attach("file", `${__dirname}/test.png`),
    user
  );
};

describe.each(Object.values(TestAccounts))(
  "Test of the route 'documents'",
  (currentAccountTest) => {
    describe(`POST /documents/ ${currentAccountTest}`, () => {
      test("✅ Correct data", async () => {
        // Successful test
        const expectedStatus = getExpectedStatus(
          ALLOWED_USERS,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );
        const response = await postValidDocument(currentAccountTest);

        expect(response.status).toEqual(expectedStatus);

        if (response.status !== 200) return;

        const place = await getPlaceByParams({ lieu_id: lieuId });
        expect(place).not.toBeNull();
        const doc = await supertest()
          .get(`/medias/documents/${place?.modalities.docs[0].path}`)
          .set("Origin", "https://soliguide.fr");

        expect(doc.status).toEqual(200);
        expect(doc.body).toEqual(fs.readFileSync(`${__dirname}/test.png`));

        await deletePlaceLastDocument();
      });

      test("❌ Data incorrect", async () => {
        // Successful test
        const expectedStatus = getExpectedStatus(
          ALLOWED_USERS,
          currentAccountTest,
          ExpectedStatus.ERROR
        );
        const response = await addAuth(
          supertest()
            .post(`/documents/${lieuId}`)
            .field("name", "Test")
            .attach("file", `${__dirname}/wrong_data.txt`),
          currentAccountTest
        );
        expect(response.status).toEqual(expectedStatus);
      });
    });

    describe(`DELETE /documents/ ${currentAccountTest}`, () => {
      beforeEach(async () => {
        await postValidDocument(TestAccounts.USER_ADMIN_SOLIGUIDE);
      });

      afterEach(async () => {
        await deletePlaceLastDocument();
      });

      test("✅ Correct data", async () => {
        const place = await getPlaceByParams({ lieu_id: lieuId });
        expect(place).not.toBeNull();
        // Successful test
        const expectedStatus = getExpectedStatus(
          ALLOWED_USERS,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );
        const response = await addAuth(
          supertest().delete(
            `/documents/${lieuId}/${place?.modalities.docs[0]._id}`
          ),
          currentAccountTest
        );

        expect(response.status).toEqual(expectedStatus);
      });
    });
  }
);
