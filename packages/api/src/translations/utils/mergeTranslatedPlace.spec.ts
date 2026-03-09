import {
  ApiPlace,
  SupportedLanguagesCode,
  WelcomedPublics,
} from "@soliguide/common";

import { mergeTranslatedPlace } from "./mergeTranslatedPlace";

import {
  ONLINE_PLACE,
  MCP_PLACE,
  TRANSLATED_PLACE,
} from "../../../mocks/places";

describe("Merge place", () => {
  it("should translate place's root elements", () => {
    const mergedPlace = mergeTranslatedPlace(
      MCP_PLACE as ApiPlace,
      TRANSLATED_PLACE,
      SupportedLanguagesCode.EN
    );

    expect(mergedPlace.publics.accueil).toEqual(WelcomedPublics.PREFERENTIAL);
    expect(mergedPlace.modalities.animal).toEqual({
      checked: false,
    });

    expect(mergedPlace.modalities.appointment).toEqual({
      checked: false,
      precisions: "Précisions du rendez-vous",
    });

    expect(mergedPlace.modalities.inscription.precisions).toBeNull();
    expect(mergedPlace.modalities.price.precisions).toBeNull();

    expect(mergedPlace.description).toEqual(
      "This reception center dedicated to women in very great exclusion aims to meet their basic needs by offering shower, laundry, rest area, snacks, SIAO U<p></p><p> Initiate and / or carry out socio-educational follow-up, networking for orientation adapted to the needs of people, psychological and medical permanence</p><p> Initiate the process of personal reconstruction through workshops, cultural actions etc.</p><p></p><p> By appointment in the afternoon. Open on public holidays from 9 a.m. to 4 p.m. (Sunday hours).</p>"
    );

    expect(mergedPlace.tempInfos.closure.description).toEqual(
      "Temporary move to the Carreau du temple: https://soliguide.fr/fr/fiche/8062"
    );
  });

  it("should translate services' elements", () => {
    const mergedPlace = mergeTranslatedPlace(
      ONLINE_PLACE,
      TRANSLATED_PLACE,
      SupportedLanguagesCode.EN
    );
    expect(mergedPlace.services_all).toBeDefined();

    if (mergedPlace.services_all) {
      expect(mergedPlace.services_all[0].description).toEqual(
        "English service Translate"
      );

      expect(
        mergedPlace.services_all[0].modalities.orientation.precisions
      ).toEqual("Orientation précision FR");
    }
  });
});
