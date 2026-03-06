import { PlaceType } from "@soliguide/common";
import { seoUrl } from "./slugs.services";

describe("seoUrl", () => {
  [
    {
      in: {
        name: "CCAS du 3ème arrondissement de Paris",
        placeType: PlaceType.PLACE,
        position: {
          ville: "Paris",
        },
        lieu_id: 0,
      },
      out: "ccas-du-3eme-arrondissement-de-paris-0",
    },
    {
      in: {
        name: "Maraude Cébazat",
        placeType: PlaceType.ITINERARY,
        lieu_id: 100,
      },
      out: "maraude-cebazat-100",
    },
  ].forEach((value) => {
    it(`SEO URL: ${value.in}`, () => {
      expect(seoUrl(value.in as any)).toEqual(value.out);
    });
  });
});
