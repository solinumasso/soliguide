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
  ApiPlace,
  PlaceSlugs,
  PlaceType,
  slugString,
  SupportedLanguagesCode,
} from "@soliguide/common";

import slug from "slug";

const defaultSlugOptions = {
  ...slug.defaults.modes.rfc3986,
  mode: "rfc3986" as const,
  locale: SupportedLanguagesCode.FR,
};

// SEO URL : remove special characters, use hyphens, remove useless words (de, à, l', etc.)
// The city is added to the url to improve the SEO
export const seoUrl = (
  referencedItem: Pick<ApiPlace, "name" | "placeType" | "position" | "lieu_id">
) => {
  let newSeoUrl = slug(referencedItem.name, defaultSlugOptions);
  let city = null;

  if (
    referencedItem.placeType === PlaceType.PLACE &&
    referencedItem.position?.city
  ) {
    // TODO: REFACTO because the address won't exist in step 1
    city = slug(referencedItem.position.city, defaultSlugOptions);

    // We avoid showing twice the city if it's already in the title
    // Ex: CCAS de Trappes would become ccas-trappes-trappes --> ccas-trappes
    if (!newSeoUrl.includes(city)) {
      newSeoUrl += `-${city}`;
    }
  }

  newSeoUrl += `-${referencedItem.lieu_id}`;

  return newSeoUrl;
};

export const generateSlugForPlaceInfo = (place: {
  description?: string | null;
  name?: string | null;
}): PlaceSlugs => {
  return {
    infos: {
      description: place?.description ? slugString(place.description) : null,
      name: place?.name ? slugString(place.name) : null,
    },
  };
};
