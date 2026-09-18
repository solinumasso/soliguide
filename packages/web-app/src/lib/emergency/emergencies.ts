import AcUnit from 'svelte-google-materialdesign-icons/Ac_unit.svelte';
import { Categories, CountryCodes } from '@soliguide/common';

import thermalIcon from '../../assets/images/emergency/thermal_icon.png';
import type { EmergencyDefinition } from './types';

const AIR_CONDITIONED_FILTER = 'airConditioned';

/**
 * The heatwave emergency: cool places shortcuts on the home page, an air
 * conditioning filter on the results page, and air conditioning tags on places.
 */
const HEATWAVE: EmergencyDefinition = {
  id: 'heatwave',
  active: true,
  countries: [CountryCodes.FR],

  highlight: {
    titleKey: 'HEATWAVE_EMERGENCY_TITLE',
    descriptionKey: 'HEATWAVE_EMERGENCY_DESCRIPTION',
    iconUrl: thermalIcon,
    backgroundIcon: AcUnit,
    quickSearches: [
      { category: Categories.FOUNTAIN },
      { category: Categories.SHOWER },
      { category: Categories.DAY_HOSTING, filters: [AIR_CONDITIONED_FILTER] },
      { category: Categories.LIBRARIES, filters: [AIR_CONDITIONED_FILTER] }
    ]
  },

  filter: {
    name: AIR_CONDITIONED_FILTER,
    translationKey: 'ACCESS_CONDITION_AIR_CONDITIONED',
    icon: AcUnit,
    modalities: { thermalComfort: { airConditioned: true } }
  },

  tag: {
    icon: AcUnit,
    resolve: ({ modalities }) => {
      if (modalities.thermalComfort?.airConditioned === true) {
        return { translationKey: 'AIR_CONDITIONED_RIBBON', variant: 'info' };
      }

      if (modalities.thermalComfort?.airConditioned === false) {
        return { translationKey: 'NOT_AIR_CONDITIONED_RIBBON', variant: 'error' };
      }

      return null;
    }
  }
};

/**
 * Promotes a set of categories on the home page after a taxonomy change.
 *
 * Highlight only: there is nothing to filter on and nothing to tag, so both
 * surfaces are simply left out.
 *
 * TODO: the translation keys below do not exist yet, so the card renders them
 * verbatim — i18next falls back to the key itself. Create them in the 12 locale
 * files of `@soliguide/common`, and drop a dedicated image next to
 * `thermal_icon.png` to replace the borrowed one, before shipping.
 */
// const NEW_CATEGORIES: EmergencyDefinition = {
//   id: 'new-categories',
//   active: true,
//   countries: [CountryCodes.FR],

//   highlight: {
//     titleKey: 'NEW_CATEGORIES_TITLE',
//     descriptionKey: 'NEW_CATEGORIES_DESCRIPTION',
//     iconUrl: thermalIcon,
//     quickSearches: [
//       { category: Categories.WIFI },
//       { category: Categories.LAUNDRY },
//       { category: Categories.COUNSELING },
//       { category: Categories.FOOD_DISTRIBUTION }
//     ]
//   }
// };

/**
 * Every emergency the web-app knows about, active or not.
 *
 * This is the only file to edit to run one: flip `active`, list the countries,
 * and declare the surfaces you need. `HEATWAVE` uses all three of them;
 * `NEW_CATEGORIES` is the other end of the range, a home page highlight and
 * nothing else.
 *
 * Retiring an emergency means setting `active: false` rather than deleting it,
 * so that running it again is a one-word change. At most one emergency may be
 * active per country; `emergencies.spec.ts` guards that invariant.
 */
export const EMERGENCIES: EmergencyDefinition[] = [HEATWAVE];
