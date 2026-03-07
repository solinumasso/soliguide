import { translator } from "./i18n.config";

import {
  PLACE_MODALITIES_MOCK,
  PlaceModalitiesMock,
} from "./mocks/PLACE_MODALITIES.mock";

import { SupportedLanguagesCode } from "../enums";
import { translateModalities } from "../functions";

import { Modalities } from "../../modalities";

describe("Should translate modalities french", () => {
  it("Welcome by appointment, registration and orientation", () => {
    const modalities = new Modalities({
      inconditionnel: false,
      appointment: { checked: true, precisions: null },
      inscription: { checked: true, precisions: null },
      orientation: { checked: true, precisions: null },
    });
    expect(
      translateModalities(translator, SupportedLanguagesCode.FR, modalities)
    ).toStrictEqual(
      "Sur rendez-vous\n" + "Sur inscription\n" + "Sur orientation uniquement"
    );
  });
});

PLACE_MODALITIES_MOCK.forEach((modalitiesForTest: PlaceModalitiesMock) => {
  describe(`Should translate modalities in all languages ${modalitiesForTest.name}`, () => {
    it("French", () => {
      expect(
        translateModalities(
          translator,
          SupportedLanguagesCode.FR,
          modalitiesForTest.modalities
        )
      ).toEqual(modalitiesForTest.expectedResults.fr);
    });
    it("Arabic", () => {
      expect(
        translateModalities(
          translator,
          SupportedLanguagesCode.AR,
          modalitiesForTest.modalities
        )
      ).toEqual(modalitiesForTest.expectedResults.ar);
    });
    it("Catalan", () => {
      expect(
        translateModalities(
          translator,
          SupportedLanguagesCode.CA,
          modalitiesForTest.modalities
        )
      ).toEqual(modalitiesForTest.expectedResults.ca);
    });
    it("English", () => {
      expect(
        translateModalities(
          translator,
          SupportedLanguagesCode.EN,
          modalitiesForTest.modalities
        )
      ).toEqual(modalitiesForTest.expectedResults.en);
    });
    it("Spanish", () => {
      expect(
        translateModalities(
          translator,
          SupportedLanguagesCode.ES,
          modalitiesForTest.modalities
        )
      ).toEqual(modalitiesForTest.expectedResults.es);
    });
    it("Farsi", () => {
      expect(
        translateModalities(
          translator,
          SupportedLanguagesCode.FA,
          modalitiesForTest.modalities
        )
      ).toEqual(modalitiesForTest.expectedResults.fa);
    });
    it("Georgian", () => {
      expect(
        translateModalities(
          translator,
          SupportedLanguagesCode.KA,
          modalitiesForTest.modalities
        )
      ).toEqual(modalitiesForTest.expectedResults.ka);
    });
    it("Pachto", () => {
      expect(
        translateModalities(
          translator,
          SupportedLanguagesCode.PS,
          modalitiesForTest.modalities
        )
      ).toEqual(modalitiesForTest.expectedResults.ps);
    });
    it("Romanian", () => {
      expect(
        translateModalities(
          translator,
          SupportedLanguagesCode.RO,
          modalitiesForTest.modalities
        )
      ).toEqual(modalitiesForTest.expectedResults.ro);
    });
    it("Russian", () => {
      expect(
        translateModalities(
          translator,
          SupportedLanguagesCode.RU,
          modalitiesForTest.modalities
        )
      ).toEqual(modalitiesForTest.expectedResults.ru);
    });
    it("Ukrainian", () => {
      expect(
        translateModalities(
          translator,
          SupportedLanguagesCode.UK,
          modalitiesForTest.modalities
        )
      ).toEqual(modalitiesForTest.expectedResults.uk);
    });

    it("English", () => {
      expect(
        translateModalities(
          translator,
          SupportedLanguagesCode.EN,
          modalitiesForTest.modalities
        )
      ).toEqual(modalitiesForTest.expectedResults.en);
    });
  });
});
