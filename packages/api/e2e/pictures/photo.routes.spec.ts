import fs from "fs-extra";

import { supertest, getExpectedStatus, addAuth } from "../endPointTester";
import { TestAccounts, ExpectedStatus } from "../endPointTester.type";

import { getPlaceByParams } from "../../src/place/services/place.service";
import { deletePhoto } from "../../src/place/services/photo.services";

const ALLOWED_USERS = [
  TestAccounts.USER_ADMIN_SOLIGUIDE,
  TestAccounts.USER_ADMIN_TERRITORY,
  TestAccounts.USER_PRO_OWNER,
  TestAccounts.USER_PRO_EDITOR,
  TestAccounts.USER_PRO_OWNER_ORGA1_EDITOR_ORGA2,
];

const lieuId = 2;

const deletePlacePictures = async () => {
  const place = await getPlaceByParams({ lieu_id: lieuId });
  if (place) {
    for (const photo of place.photos) {
      await deletePhoto(photo._id);
    }
  }
};

const postValidPicture = (user: TestAccounts) => {
  return addAuth(
    supertest()
      .post(`/photos/${lieuId}`)
      .attach("file", `${__dirname}/test.png`),
    user
  );
};

describe.each(Object.values(TestAccounts))(
  "Test of the route 'photos'",
  (currentAccountTest) => {
    describe(`POST /photos/ ${currentAccountTest}`, () => {
      // Augmenter le timeout pour les tests d'upload de fichiers (60s)
      jest.setTimeout(60000);
      afterEach(deletePlacePictures);
      test("✅ Correct data", async () => {
        // Successful test
        const expectedStatus = getExpectedStatus(
          ALLOWED_USERS,
          currentAccountTest,
          ExpectedStatus.SUCCESS
        );
        const response = await postValidPicture(currentAccountTest);
        expect(response.status).toEqual(expectedStatus);
        if (response.status !== 200) return;

        const place = await getPlaceByParams({ lieu_id: lieuId });
        expect(place).not.toBeNull();

        const picture = await supertest()
          .get(`/medias/pictures/${place?.photos[0].path}`)
          .set("Origin", "https://soliguide.fr");

        expect(picture.status).toEqual(200);
        expect(picture.body).toEqual(fs.readFileSync(`${__dirname}/test.png`));
      });
      test("❌ Incorrect data", async () => {
        // Successful test
        const expectedStatus = getExpectedStatus(
          ALLOWED_USERS,
          currentAccountTest,
          ExpectedStatus.ERROR
        );
        const response = await addAuth(
          supertest()
            .post(`/photos/${lieuId}`)
            .attach("file", `${__dirname}/wrong_data.txt`),
          currentAccountTest
        );
        expect(response.status).toEqual(expectedStatus);
      });
    });

    describe(`DELETE /photos/ ${currentAccountTest}`, () => {
      // Augmenter le timeout pour les tests d'upload de fichiers (60s)
      jest.setTimeout(60000);
      beforeEach(async () => {
        await postValidPicture(TestAccounts.USER_ADMIN_SOLIGUIDE);
      });
      afterEach(deletePlacePictures);
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
          supertest().delete(`/photos/${lieuId}/${place?.photos[0]._id}`),
          currentAccountTest
        );
        expect(response.status).toEqual(expectedStatus);
      });
    });
  }
);
