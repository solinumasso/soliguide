import {
  Categories,
  CountryCodes,
  EXTERNAL_UPDATES_ONLY_SOURCES,
  PairingSources,
  PlaceStatus,
} from "@soliguide/common";

// Status of places to include in the MAJ campaign
export const statusIncludeInMAJ = {
  status: { $in: [PlaceStatus.ONLINE, PlaceStatus.OFFLINE] },
};
// Countries to include in the MAJ campaign
export const countryIncludeInMAJ = {
  country: { $in: [CountryCodes.FR, CountryCodes.ES, CountryCodes.AD] },
};

// Include places except those with sources that make updates themselves
// or ALISOL/DORA if they are the origin of the data
export const sourceToIncludeInMaj = {
  $and: [
    {
      $nor: [
        {
          sources: {
            $elemMatch: {
              name: { $in: EXTERNAL_UPDATES_ONLY_SOURCES },
            },
          },
        },
      ],
    },

    {
      $nor: [
        {
          sources: {
            $elemMatch: {
              name: { $in: [PairingSources.ALISOL, PairingSources.DORA] },
              isOrigin: true,
            },
          },
        },
      ],
    },
  ],
};

// Exclude places with services who are only (wifi, toilets, fountain, electrical outlets)
export const excludeBasicServicesFilter = {
  $nor: [
    {
      $expr: {
        $setIsSubset: [
          "$services_all.category",
          [
            Categories.WIFI,
            Categories.TOILETS,
            Categories.FOUNTAIN,
            Categories.ELECTRICAL_OUTLETS_AVAILABLE,
          ],
        ],
      },
    },
  ],
};
