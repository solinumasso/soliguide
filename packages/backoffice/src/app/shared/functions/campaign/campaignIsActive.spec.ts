import { CAMPAIGN_DEFAULT_NAME, CAMPAIGN_LIST } from "@soliguide/common";

import { campaignIsActiveWithTheme } from "./campaignIsActive";

describe("Test la fonction campaignIsActive", () => {
  it("Doit renvoyer 'false' si on est hors période de campagne et 'true' sinon", () => {
    const TODAY = new Date();

    if (
      TODAY < CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].dateDebutCampagne ||
      TODAY > CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].dateFin
    ) {
      expect(
        campaignIsActiveWithTheme(
          CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].territories
        )
      ).toBeFalsy();
    } else {
      expect(
        campaignIsActiveWithTheme(
          CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].territories
        )
      ).toBeTruthy();
    }
  });
});
