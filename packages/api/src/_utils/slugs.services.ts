
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
