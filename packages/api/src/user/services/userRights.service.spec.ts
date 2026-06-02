import {
  CAMPAIGN_DEFAULT_NAME,
  LAST_END_YEAR_CAMPAIGN_NAME,
  LAST_MID_YEAR_CAMPAIGN_NAME,
} from "@soliguide/common";

import {
  getUserLastCampaignsChangesStatus,
  getUserToUpdateStatus,
} from "./userRights.service";

const itIfCampaignDefined = (
  campaignName: string | undefined,
  description: string,
  fn: (campaignName: string) => void
) => {
  if (campaignName) {
    it(description, () => fn(campaignName));
  } else {
    it.skip(description, () => {});
  }
};

const itIfBothCampaignsDefined = (
  campaignA: string | undefined,
  campaignB: string | undefined,
  description: string,
  fn: (campaignA: string, campaignB: string) => void
) => {
  if (campaignA && campaignB) {
    it(description, () => fn(campaignA, campaignB));
  } else {
    it.skip(description, () => {});
  }
};

describe("getUserToUpdateStatus", () => {
  it("returns false for an empty rights array", () => {
    expect(getUserToUpdateStatus([])).toBe(false);
  });

  it("returns false when place is null", () => {
    expect(getUserToUpdateStatus([{ place: null }])).toBe(false);
  });

  it("returns false when no place has toUpdate = true in the current campaign", () => {
    const rights = [
      {
        place: {
          campaigns: { [CAMPAIGN_DEFAULT_NAME]: { toUpdate: false } },
        },
      },
    ];

    expect(getUserToUpdateStatus(rights)).toBe(false);
  });

  it("returns true when at least one place has toUpdate = true in the current campaign", () => {
    const rights = [
      {
        place: {
          campaigns: { [CAMPAIGN_DEFAULT_NAME]: { toUpdate: true } },
        },
      },
    ];

    expect(getUserToUpdateStatus(rights)).toBe(true);
  });

  it("returns true when at least one among multiple rights has toUpdate = true", () => {
    const rights = [
      {
        place: {
          campaigns: { [CAMPAIGN_DEFAULT_NAME]: { toUpdate: false } },
        },
      },
      {
        place: {
          campaigns: { [CAMPAIGN_DEFAULT_NAME]: { toUpdate: true } },
        },
      },
      {
        place: {
          campaigns: { [CAMPAIGN_DEFAULT_NAME]: { toUpdate: false } },
        },
      },
    ];

    expect(getUserToUpdateStatus(rights)).toBe(true);
  });
});

describe("getUserLastCampaignsChangesStatus", () => {
  it("returns null for both when rights array is empty", () => {
    expect(getUserLastCampaignsChangesStatus([])).toEqual({
      midYear: null,
      endYear: null,
    });
  });

  it("returns null for both when place is null", () => {
    expect(getUserLastCampaignsChangesStatus([{ place: null }])).toEqual({
      midYear: null,
      endYear: null,
    });
  });

  describe("midYear campaign", () => {
    itIfCampaignDefined(
      LAST_MID_YEAR_CAMPAIGN_NAME,
      "returns null when no place has toUpdate = true",
      (midYearCampaign) => {
        const rights = [
          {
            place: {
              campaigns: {
                [midYearCampaign]: {
                  toUpdate: false,
                  general: { changes: true },
                },
              },
            },
          },
        ];

        expect(getUserLastCampaignsChangesStatus(rights)).toMatchObject({
          midYear: null,
        });
      }
    );

    itIfCampaignDefined(
      LAST_MID_YEAR_CAMPAIGN_NAME,
      "returns false when places have toUpdate = true but no changes",
      (midYearCampaign) => {
        const rights = [
          {
            place: {
              campaigns: {
                [midYearCampaign]: {
                  toUpdate: true,
                  general: { changes: false },
                },
              },
            },
          },
        ];

        expect(getUserLastCampaignsChangesStatus(rights)).toMatchObject({
          midYear: false,
        });
      }
    );

    itIfCampaignDefined(
      LAST_MID_YEAR_CAMPAIGN_NAME,
      "returns true when at least one place has toUpdate = true and changes",
      (midYearCampaign) => {
        const rights = [
          {
            place: {
              campaigns: {
                [midYearCampaign]: {
                  toUpdate: true,
                  general: { changes: false },
                },
              },
            },
          },
          {
            place: {
              campaigns: {
                [midYearCampaign]: {
                  toUpdate: true,
                  general: { changes: true },
                },
              },
            },
          },
        ];

        expect(getUserLastCampaignsChangesStatus(rights)).toMatchObject({
          midYear: true,
        });
      }
    );
  });

  describe("endYear campaign", () => {
    itIfCampaignDefined(
      LAST_END_YEAR_CAMPAIGN_NAME,
      "returns null when no place has toUpdate = true",
      (endYearCampaign) => {
        const rights = [
          {
            place: {
              campaigns: {
                [endYearCampaign]: {
                  toUpdate: false,
                  general: { changes: true },
                },
              },
            },
          },
        ];

        expect(getUserLastCampaignsChangesStatus(rights)).toMatchObject({
          endYear: null,
        });
      }
    );

    itIfCampaignDefined(
      LAST_END_YEAR_CAMPAIGN_NAME,
      "returns false when places have toUpdate = true but no changes",
      (endYearCampaign) => {
        const rights = [
          {
            place: {
              campaigns: {
                [endYearCampaign]: {
                  toUpdate: true,
                  general: { changes: false },
                },
              },
            },
          },
        ];

        expect(getUserLastCampaignsChangesStatus(rights)).toMatchObject({
          endYear: false,
        });
      }
    );

    itIfCampaignDefined(
      LAST_END_YEAR_CAMPAIGN_NAME,
      "returns true when at least one place has toUpdate = true and changes",
      (endYearCampaign) => {
        const rights = [
          {
            place: {
              campaigns: {
                [endYearCampaign]: {
                  toUpdate: true,
                  general: { changes: false },
                },
              },
            },
          },
          {
            place: {
              campaigns: {
                [endYearCampaign]: {
                  toUpdate: true,
                  general: { changes: true },
                },
              },
            },
          },
        ];

        expect(getUserLastCampaignsChangesStatus(rights)).toMatchObject({
          endYear: true,
        });
      }
    );
  });

  describe("both campaigns combined", () => {
    itIfBothCampaignsDefined(
      LAST_MID_YEAR_CAMPAIGN_NAME,
      LAST_END_YEAR_CAMPAIGN_NAME,
      "returns independent results for midYear and endYear",
      (midYearCampaign, endYearCampaign) => {
        const rights = [
          {
            place: {
              campaigns: {
                [midYearCampaign]: {
                  toUpdate: true,
                  general: { changes: true },
                },
                [endYearCampaign]: {
                  toUpdate: true,
                  general: { changes: false },
                },
              },
            },
          },
        ];

        expect(getUserLastCampaignsChangesStatus(rights)).toEqual({
          midYear: true,
          endYear: false,
        });
      }
    );
  });
});
