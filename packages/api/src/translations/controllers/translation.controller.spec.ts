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

    await generateElementsToTranslate(req, {} as ExpressResponse, jest.fn());

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

  it("Should delete translation fields when place becomes non-ONLINE", async () => {
    // Place is currently ONLINE with 3 translated fields from the previous test
    translatedFields = await searchTranslatedFields(
      {
        lieu_id: 7,
        status: TranslatedFieldStatus.NEED_AUTO_TRANSLATE,
        country: CountryCodes.FR,
      },
      req.user
    );
    expect(translatedFields.nbResults).toBe(3);

    // Simulate place going DRAFT
    const draftReq = {
      ...req,
      updatedPlace: { ...req.updatedPlace, status: PlaceStatus.DRAFT },
    };
    await generateElementsToTranslate(
      draftReq,
      {} as ExpressResponse,
      jest.fn()
    );

    translatedFields = await searchTranslatedFields(
      { lieu_id: 7, country: CountryCodes.FR },
      req.user
    );
    expect(translatedFields.nbResults).toBe(0);
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
