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
export const countryIncludeInMAJ = { country: { $in: [CountryCodes.FR] } };

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
        $or: [
          {
            $and: [
              { $eq: [{ $size: "$services_all.category" }, 2] },
              {
                $setIsSubset: [
                  "$services_all.category",
                  [Categories.WIFI, Categories.TOILETS],
                ],
              },
            ],
          },
          {
            $and: [
              { $eq: [{ $size: "$services_all.category" }, 2] },
              {
                $setIsSubset: [
                  "$services_all.category",
                  [Categories.WIFI, Categories.FOUNTAIN],
                ],
              },
            ],
          },
          {
            $and: [
              { $eq: [{ $size: "$services_all.category" }, 2] },
              {
                $setIsSubset: [
                  "$services_all.category",
                  [Categories.WIFI, Categories.ELECTRICAL_OUTLETS_AVAILABLE],
                ],
              },
            ],
          },
          {
            $and: [
              { $eq: [{ $size: "$services_all.category" }, 2] },
              {
                $setIsSubset: [
                  "$services_all.category",
                  [Categories.TOILETS, Categories.FOUNTAIN],
                ],
              },
            ],
          },
          {
            $and: [
              { $eq: [{ $size: "$services_all.category" }, 2] },
              {
                $setIsSubset: [
                  "$services_all.category",
                  [Categories.TOILETS, Categories.ELECTRICAL_OUTLETS_AVAILABLE],
                ],
              },
            ],
          },
          {
            $and: [
              { $eq: [{ $size: "$services_all.category" }, 2] },
              {
                $setIsSubset: [
                  "$services_all.category",
                  [
                    Categories.FOUNTAIN,
                    Categories.ELECTRICAL_OUTLETS_AVAILABLE,
                  ],
                ],
              },
            ],
          },
          {
            $and: [
              { $eq: [{ $size: "$services_all.category" }, 3] },
              {
                $setIsSubset: [
                  "$services_all.category",
                  [Categories.WIFI, Categories.TOILETS, Categories.FOUNTAIN],
                ],
              },
            ],
          },
          {
            $and: [
              { $eq: [{ $size: "$services_all.category" }, 3] },
              {
                $setIsSubset: [
                  "$services_all.category",
                  [
                    Categories.WIFI,
                    Categories.TOILETS,
                    Categories.ELECTRICAL_OUTLETS_AVAILABLE,
                  ],
                ],
              },
            ],
          },
          {
            $and: [
              { $eq: [{ $size: "$services_all.category" }, 3] },
              {
                $setIsSubset: [
                  "$services_all.category",
                  [
                    Categories.WIFI,
                    Categories.FOUNTAIN,
                    Categories.ELECTRICAL_OUTLETS_AVAILABLE,
                  ],
                ],
              },
            ],
          },
          {
            $and: [
              { $eq: [{ $size: "$services_all.category" }, 3] },
              {
                $setIsSubset: [
                  "$services_all.category",
                  [
                    Categories.TOILETS,
                    Categories.FOUNTAIN,
                    Categories.ELECTRICAL_OUTLETS_AVAILABLE,
                  ],
                ],
              },
            ],
          },
          {
            $and: [
              { $eq: [{ $size: "$services_all.category" }, 4] },
              {
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
            ],
          },
        ],
      },
    },
  ],
};
