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
import { Categories } from "../enums";
import { ChildCategory, FlatCategoriesTreeNode } from "../interfaces";

export const ROOT_CATEGORIES: ChildCategory[] = [
  {
    id: Categories.WELCOME,
    rank: 100,
  },
  {
    id: Categories.ACTIVITIES,
    rank: 200,
  },
  {
    id: Categories.FOOD,
    rank: 300,
  },
  {
    id: Categories.COUNSELING,
    rank: 400,
  },
  {
    id: Categories.TRAINING_AND_JOBS,
    rank: 500,
  },
  {
    id: Categories.ACCOMODATION_AND_HOUSING,
    rank: 600,
  },
  {
    id: Categories.HYGIENE_AND_WELLNESS,
    rank: 700,
  },
  {
    id: Categories.EQUIPMENT,
    rank: 800,
  },
  {
    id: Categories.HEALTH,
    rank: 900,
  },
  {
    id: Categories.TECHNOLOGY,
    rank: 1000,
  },
  {
    id: Categories.MOBILITY,
    rank: 1100,
  },
];

export const CATEGORIES: FlatCategoriesTreeNode[] = [
  {
    id: Categories.WELCOME,
    children: [
      {
        id: Categories.DAY_HOSTING,
        rank: 100,
      },
      {
        id: Categories.REST_AREA,
        rank: 200,
      },
      {
        id: Categories.BABYSITTING,
        rank: 300,
      },
      {
        id: Categories.FAMILY_AREA,
        rank: 400,
      },
      {
        id: Categories.INFORMATION_POINT,
        rank: 500,
      },
    ],
  },
  {
    id: Categories.DAY_HOSTING,
    children: [],
  },
  {
    id: Categories.REST_AREA,
    children: [],
  },
  {
    id: Categories.BABYSITTING,
    children: [],
  },
  {
    id: Categories.FAMILY_AREA,
    children: [],
  },
  {
    id: Categories.INFORMATION_POINT,
    children: [],
  },
  {
    id: Categories.ACTIVITIES,
    children: [
      {
        id: Categories.SPORT_ACTIVITIES,
        rank: 100,
      },
      {
        id: Categories.MUSEUMS,
        rank: 200,
      },
      {
        id: Categories.LIBRARIES,
        rank: 300,
      },
      {
        id: Categories.OTHER_ACTIVITIES,
        rank: 400,
      },
    ],
  },
  {
    id: Categories.SPORT_ACTIVITIES,
    children: [],
  },
  {
    id: Categories.MUSEUMS,
    children: [],
  },
  {
    id: Categories.LIBRARIES,
    children: [],
  },
  {
    id: Categories.OTHER_ACTIVITIES,
    children: [],
  },
  {
    id: Categories.FOOD,
    children: [
      {
        id: Categories.FOOD_DISTRIBUTION,
        rank: 100,
      },
      {
        id: Categories.FOOD_PACKAGES,
        rank: 200,
      },
      {
        id: Categories.BABY_PARCEL,
        rank: 300,
      },
      {
        id: Categories.FOOD_VOUCHER,
        rank: 400,
      },
      {
        id: Categories.SOCIAL_GROCERY_STORES,
        rank: 500,
      },
      {
        id: Categories.FOUNTAIN,
        rank: 600,
      },
      {
        id: Categories.SHARED_KITCHEN,
        rank: 700,
      },
      {
        id: Categories.COOKING_WORKSHOP,
        rank: 800,
      },
      {
        id: Categories.COMMUNITY_GARDEN,
        rank: 900,
      },
      {
        id: Categories.SOLIDARITY_FRIDGE,
        rank: 1000,
      },
    ],
  },
  {
    id: Categories.FOOD_DISTRIBUTION,
    children: [],
  },
  {
    id: Categories.FOOD_PACKAGES,
    children: [],
  },
  {
    id: Categories.SOCIAL_GROCERY_STORES,
    children: [],
  },
  {
    id: Categories.FOUNTAIN,
    children: [],
  },
  {
    id: Categories.SOLIDARITY_FRIDGE,
    children: [],
  },
  {
    id: Categories.SHARED_KITCHEN,
    children: [],
  },
  {
    id: Categories.COOKING_WORKSHOP,
    children: [],
  },
  {
    id: Categories.BABY_PARCEL,
    children: [],
  },
  {
    id: Categories.FOOD_VOUCHER,
    children: [],
  },
  {
    id: Categories.COMMUNITY_GARDEN,
    children: [],
  },
  {
    id: Categories.COUNSELING,
    children: [
      {
        id: Categories.LEGAL_ADVICE,
        rank: 100,
      },
      {
        id: Categories.DOMICILIATION,
        rank: 200,
      },
      {
        id: Categories.SOCIAL_ACCOMPANIMENT,
        rank: 300,
      },
      {
        id: Categories.PUBLIC_WRITER,
        rank: 400,
      },
      {
        id: Categories.DISABILITY_ADVICE,
        rank: 500,
      },
      {
        id: Categories.ADMINISTRATIVE_ASSISTANCE,
        rank: 600,
      },
      {
        id: Categories.PARENT_ASSISTANCE,
        rank: 700,
      },
      {
        id: Categories.BUDGET_ADVICE,
        rank: 800,
      },
    ],
  },
  {
    id: Categories.LEGAL_ADVICE,
    children: [],
  },
  {
    id: Categories.DOMICILIATION,
    children: [],
  },
  {
    id: Categories.SOCIAL_ACCOMPANIMENT,
    children: [],
  },
  {
    id: Categories.PUBLIC_WRITER,
    children: [],
  },
  {
    id: Categories.DISABILITY_ADVICE,
    children: [],
  },
  {
    id: Categories.ADMINISTRATIVE_ASSISTANCE,
    children: [],
  },
  {
    id: Categories.PARENT_ASSISTANCE,
    children: [],
  },
  {
    id: Categories.BUDGET_ADVICE,
    children: [],
  },
  {
    id: Categories.TRAINING_AND_JOBS,
    children: [
      {
        id: Categories.DIGITAL_TOOLS_TRAINING,
        rank: 100,
      },
      {
        id: Categories.JOB_COACHING,
        rank: 200,
      },
      {
        id: Categories.INTEGRATION_THROUGH_ECONOMIC_ACTIVITY,
        rank: 300,
      },
      {
        id: Categories.TUTORING,
        rank: 400,
      },
    ],
  },
  {
    id: Categories.DIGITAL_TOOLS_TRAINING,
    children: [],
  },
  {
    id: Categories.JOB_COACHING,
    children: [],
  },
  {
    id: Categories.INTEGRATION_THROUGH_ECONOMIC_ACTIVITY,
    children: [],
  },
  {
    id: Categories.TUTORING,
    children: [],
  },
  {
    id: Categories.ACCOMODATION_AND_HOUSING,
    children: [
      {
        id: Categories.OVERNIGHT_STOP,
        rank: 100,
      },
      {
        id: Categories.EMERGENCY_ACCOMMODATION,
        rank: 200,
      },
      {
        id: Categories.LONG_TERM_ACCOMODATION,
        rank: 300,
      },
      {
        id: Categories.CITIZEN_HOUSING,
        rank: 400,
      },
      {
        id: Categories.ACCESS_TO_HOUSING,
        rank: 500,
      },
    ],
  },
  {
    id: Categories.OVERNIGHT_STOP,
    children: [],
  },
  {
    id: Categories.EMERGENCY_ACCOMMODATION,
    children: [],
  },
  {
    id: Categories.LONG_TERM_ACCOMODATION,
    children: [],
  },
  {
    id: Categories.CITIZEN_HOUSING,
    children: [],
  },
  {
    id: Categories.ACCESS_TO_HOUSING,
    children: [],
  },
  {
    id: Categories.HYGIENE_AND_WELLNESS,
    children: [
      {
        id: Categories.SHOWER,
        rank: 100,
      },
      {
        id: Categories.LAUNDRY,
        rank: 200,
      },
      {
        id: Categories.WELLNESS,
        rank: 300,
      },
      {
        id: Categories.TOILETS,
        rank: 400,
      },
      {
        id: Categories.HYGIENE_PRODUCTS,
        rank: 500,
      },
      {
        id: Categories.FACE_MASKS,
        rank: 600,
      },
      {
        id: Categories.HAIRDRESSER,
        rank: 700,
      },
    ],
  },
  {
    id: Categories.SHOWER,
    children: [],
  },
  {
    id: Categories.LEGAL_PROTECTION,
    children: [],
  },
  {
    id: Categories.HAIRDRESSER,
    children: [],
  },
  {
    id: Categories.LAUNDRY,
    children: [],
  },
  {
    id: Categories.WELLNESS,
    children: [],
  },
  {
    id: Categories.TOILETS,
    children: [],
  },
  {
    id: Categories.HYGIENE_PRODUCTS,
    children: [],
  },
  {
    id: Categories.FACE_MASKS,
    children: [],
  },
  {
    id: Categories.EQUIPMENT,
    children: [
      {
        id: Categories.LUGGAGE_STORAGE,
        rank: 100,
      },
      {
        id: Categories.SOLIDARITY_STORE,
        rank: 200,
      },
      {
        id: Categories.CLOTHING,
        rank: 300,
      },
      {
        id: Categories.ANIMAL_ASSITANCE,
        rank: 400,
      },
    ],
  },
  {
    id: Categories.LUGGAGE_STORAGE,
    children: [],
  },
  {
    id: Categories.SOLIDARITY_STORE,
    children: [],
  },
  {
    id: Categories.CLOTHING,
    children: [],
  },
  {
    id: Categories.ANIMAL_ASSITANCE,
    children: [],
  },
  {
    id: Categories.HEALTH,
    children: [
      {
        id: Categories.ADDICTION,
        rank: 100,
      },
      {
        id: Categories.STD_TESTING,
        rank: 200,
      },
      {
        id: Categories.PSYCHOLOGICAL_SUPPORT,
        rank: 300,
      },
      {
        id: Categories.CHILD_CARE,
        rank: 400,
      },
      {
        id: Categories.GENERAL_PRACTITIONER,
        rank: 500,
      },
      {
        id: Categories.DENTAL_CARE,
        rank: 600,
      },
      {
        id: Categories.PREGNANCY_CARE,
        rank: 700,
      },
      {
        id: Categories.VACCINATION,
        rank: 800,
      },
      {
        id: Categories.INFIRMARY,
        rank: 900,
      },
      {
        id: Categories.VET_CARE,
        rank: 1000,
      },
      {
        id: Categories.HEALTH_SPECIALISTS,
        rank: 1100,
      },
    ],
  },
  {
    id: Categories.ADDICTION,
    children: [],
  },
  {
    id: Categories.STD_TESTING,
    children: [],
  },
  {
    id: Categories.PSYCHOLOGICAL_SUPPORT,
    children: [],
  },
  {
    id: Categories.CHILD_CARE,
    children: [],
  },
  {
    id: Categories.GENERAL_PRACTITIONER,
    children: [],
  },
  {
    id: Categories.DENTAL_CARE,
    children: [],
  },
  {
    id: Categories.PREGNANCY_CARE,
    children: [],
  },
  {
    id: Categories.VACCINATION,
    children: [],
  },
  {
    id: Categories.INFIRMARY,
    children: [],
  },
  {
    id: Categories.VET_CARE,
    children: [],
  },
  {
    id: Categories.HEALTH_SPECIALISTS,
    children: [
      {
        id: Categories.ALLERGOLOGY,
        rank: 100,
      },
      {
        id: Categories.CARDIOLOGY,
        rank: 200,
      },
      {
        id: Categories.DERMATOLOGY,
        rank: 300,
      },
      {
        id: Categories.ECHOGRAPHY,
        rank: 400,
      },
      {
        id: Categories.ENDOCRINOLOGY,
        rank: 500,
      },
      {
        id: Categories.GASTROENTEROLOGY,
        rank: 600,
      },
      {
        id: Categories.GYNECOLOGY,
        rank: 700,
      },
      {
        id: Categories.KINESITHERAPY,
        rank: 800,
      },
      {
        id: Categories.MAMMOGRAPHY,
        rank: 900,
      },
      {
        id: Categories.OPHTHALMOLOGY,
        rank: 1000,
      },
      {
        id: Categories.OTORHINOLARYNGOLOGY,
        rank: 1100,
      },
      {
        id: Categories.NUTRITION,
        rank: 1200,
      },
      {
        id: Categories.PEDICURE,
        rank: 1300,
      },
      {
        id: Categories.PHLEBOLOGY,
        rank: 1400,
      },
      {
        id: Categories.PNEUMOLOGY,
        rank: 1500,
      },
      {
        id: Categories.RADIOLOGY,
        rank: 1600,
      },
      {
        id: Categories.RHEUMATOLOGY,
        rank: 1700,
      },
      {
        id: Categories.UROLOGY,
        rank: 1800,
      },
      {
        id: Categories.SPEECH_THERAPY,
        rank: 1900,
      },
      {
        id: Categories.STOMATOLOGY,
        rank: 2000,
      },
      {
        id: Categories.OSTEOPATHY,
        rank: 2100,
      },
      {
        id: Categories.ACUPUNCTURE,
        rank: 2200,
      },
    ],
  },
  {
    id: Categories.ALLERGOLOGY,
    children: [],
  },
  {
    id: Categories.CARDIOLOGY,
    children: [],
  },
  {
    id: Categories.DERMATOLOGY,
    children: [],
  },
  {
    id: Categories.ECHOGRAPHY,
    children: [],
  },
  {
    id: Categories.ENDOCRINOLOGY,
    children: [],
  },
  {
    id: Categories.GASTROENTEROLOGY,
    children: [],
  },
  {
    id: Categories.GYNECOLOGY,
    children: [],
  },
  {
    id: Categories.KINESITHERAPY,
    children: [],
  },
  {
    id: Categories.MAMMOGRAPHY,
    children: [],
  },
  {
    id: Categories.OPHTHALMOLOGY,
    children: [],
  },
  {
    id: Categories.OTORHINOLARYNGOLOGY,
    children: [],
  },
  {
    id: Categories.NUTRITION,
    children: [],
  },
  {
    id: Categories.PEDICURE,
    children: [],
  },
  {
    id: Categories.PHLEBOLOGY,
    children: [],
  },
  {
    id: Categories.PNEUMOLOGY,
    children: [],
  },
  {
    id: Categories.RADIOLOGY,
    children: [],
  },
  {
    id: Categories.RHEUMATOLOGY,
    children: [],
  },
  {
    id: Categories.UROLOGY,
    children: [],
  },
  {
    id: Categories.SPEECH_THERAPY,
    children: [],
  },
  {
    id: Categories.STOMATOLOGY,
    children: [],
  },
  {
    id: Categories.OSTEOPATHY,
    children: [],
  },
  {
    id: Categories.ACUPUNCTURE,
    children: [],
  },
  {
    id: Categories.TECHNOLOGY,
    children: [
      {
        id: Categories.COMPUTERS_AT_YOUR_DISPOSAL,
        rank: 100,
      },
      {
        id: Categories.WIFI,
        rank: 200,
      },
      {
        id: Categories.ELECTRICAL_OUTLETS_AVAILABLE,
        rank: 300,
      },
      {
        id: Categories.TELEPHONE_AT_YOUR_DISPOSAL,
        rank: 400,
      },
      {
        id: Categories.DIGITAL_SAFE,
        rank: 500,
      },
    ],
  },
  {
    id: Categories.COMPUTERS_AT_YOUR_DISPOSAL,
    children: [],
  },
  {
    id: Categories.WIFI,
    children: [],
  },
  {
    id: Categories.ELECTRICAL_OUTLETS_AVAILABLE,
    children: [],
  },
  {
    id: Categories.TELEPHONE_AT_YOUR_DISPOSAL,
    children: [],
  },
  {
    id: Categories.DIGITAL_SAFE,
    children: [],
  },
  {
    id: Categories.MOBILITY,
    children: [
      {
        id: Categories.CARPOOLING,
        rank: 100,
      },
      {
        id: Categories.PROVISION_OF_VEHICLES,
        rank: 200,
      },
      {
        id: Categories.CHAUFFEUR_DRIVEN_TRANSPORT,
        rank: 300,
      },
      {
        id: Categories.MOBILITY_ASSISTANCE,
        rank: 400,
      },
    ],
  },
  {
    id: Categories.CARPOOLING,
    children: [],
  },
  {
    id: Categories.PROVISION_OF_VEHICLES,
    children: [],
  },
  {
    id: Categories.CHAUFFEUR_DRIVEN_TRANSPORT,
    children: [],
  },
  {
    id: Categories.MOBILITY_ASSISTANCE,
    children: [],
  },
];

export const CATEGORIES_SOLIGUIDE_FR: FlatCategoriesTreeNode[] = [
  {
    id: Categories.TRAINING_AND_JOBS,
    children: [
      {
        id: Categories.FRENCH_COURSE,
        rank: 150,
      },
    ],
  },
  {
    id: Categories.FRENCH_COURSE,
    children: [],
  },
];

export const CATEGORIES_SOLIGUIA_ES: FlatCategoriesTreeNode[] = [
  {
    id: Categories.TRAINING_AND_JOBS,
    children: [
      {
        id: Categories.SPANISH_COURSE,
        rank: 130,
      },
      {
        id: Categories.CATALAN_COURSE,
        rank: 170,
      },
    ],
  },
  {
    id: Categories.SPANISH_COURSE,
    children: [],
  },
  {
    id: Categories.CATALAN_COURSE,
    children: [],
  },
];

export const CATEGORIES_SOLIGUIA_AD: FlatCategoriesTreeNode[] = [
  {
    id: Categories.TRAINING_AND_JOBS,
    children: [
      {
        id: Categories.SPANISH_COURSE,
        rank: 130,
      },
      {
        id: Categories.CATALAN_COURSE,
        rank: 170,
      },
    ],
  },
  {
    id: Categories.SPANISH_COURSE,
    children: [],
  },
  {
    id: Categories.CATALAN_COURSE,
    children: [],
  },
  {
    id: Categories.COUNSELING,
    children: [
      {
        id: Categories.LEGAL_PROTECTION,
        rank: 820,
      },
    ],
  },
];
