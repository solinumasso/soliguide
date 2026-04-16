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
        id: Categories.SOCIAL_ACCOMPANIMENT,
        rank: 300,
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
    id: Categories.SOCIAL_ACCOMPANIMENT,
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
        id: Categories.HEALTH_ACCESS,
        rank: 100,
      },
      {
        id: Categories.PHYSICAL_HEALTH,
        rank: 200,
      },
      {
        id: Categories.MENTAL_HEALTH,
        rank: 300,
      },
      {
        id: Categories.ADDICTIONS,
        rank: 400,
      },
      {
        id: Categories.SEXUAL_HEALTH,
        rank: 500,
      },
      {
        id: Categories.PARENTHOOD,
        rank: 600,
      },
      {
        id: Categories.HEALTH_SPECIALISTS,
        rank: 700,
      },
    ],
  },
  {
    id: Categories.HEALTH_ACCESS,
    children: [
      {
        id: Categories.HEALTH_COVERAGE,
        rank: 100,
      },
      {
        id: Categories.FIND_HEALTHCARE,
        rank: 200,
      },
    ],
  },
  {
    id: Categories.HEALTH_COVERAGE,
    children: [],
  },
  {
    id: Categories.FIND_HEALTHCARE,
    children: [],
  },
  {
    id: Categories.PHYSICAL_HEALTH,
    children: [
      {
        id: Categories.GENERAL_PRACTITIONER,
        rank: 100,
      },
      {
        id: Categories.HEALTH_ASSESSMENT,
        rank: 200,
      },
      {
        id: Categories.CHILD_CARE,
        rank: 300,
      },
      {
        id: Categories.DENTAL_CARE,
        rank: 400,
      },
      {
        id: Categories.OPTICAL_CARE,
        rank: 500,
      },
      {
        id: Categories.HEARING_CARE,
        rank: 600,
      },
      {
        id: Categories.INFIRMARY,
        rank: 700,
      },
      {
        id: Categories.VACCINATION,
        rank: 800,
      },
      {
        id: Categories.STD_TESTING,
        rank: 900,
      },
      {
        id: Categories.CHRONIC_DISEASES,
        rank: 1000,
      },
      {
        id: Categories.NUTRITION,
        rank: 1100,
      },
      {
        id: Categories.MEDICAL_ACCOMMODATION,
        rank: 1200,
      },
    ],
  },
  {
    id: Categories.GENERAL_PRACTITIONER,
    children: [],
  },
  {
    id: Categories.HEALTH_ASSESSMENT,
    children: [],
  },
  {
    id: Categories.CHILD_CARE,
    children: [],
  },
  {
    id: Categories.DENTAL_CARE,
    children: [],
  },
  {
    id: Categories.OPTICAL_CARE,
    children: [],
  },
  {
    id: Categories.HEARING_CARE,
    children: [],
  },
  {
    id: Categories.INFIRMARY,
    children: [],
  },
  {
    id: Categories.VACCINATION,
    children: [],
  },
  {
    id: Categories.STD_TESTING,
    children: [],
  },
  {
    id: Categories.CHRONIC_DISEASES,
    children: [],
  },
  {
    id: Categories.NUTRITION,
    children: [],
  },
  {
    id: Categories.MEDICAL_ACCOMMODATION,
    children: [],
  },
  {
    id: Categories.MENTAL_HEALTH,
    children: [
      {
        id: Categories.PSYCHOLOGICAL_SUPPORT,
        rank: 100,
      },
      {
        id: Categories.PSYCHIATRY,
        rank: 200,
      },
      {
        id: Categories.SUPPORT_GROUPS,
        rank: 300,
      },
      {
        id: Categories.MEDICAL_ACCOMMODATION,
        rank: 400,
      },
      {
        id: Categories.MENTAL_HEALTH_EDUCATION,
        rank: 500,
      },
      {
        id: Categories.THERAPEUTIC_ACTIVITIES,
        rank: 600,
      },
    ],
  },
  {
    id: Categories.PSYCHOLOGICAL_SUPPORT,
    children: [],
  },
  {
    id: Categories.PSYCHIATRY,
    children: [],
  },
  {
    id: Categories.SUPPORT_GROUPS,
    children: [],
  },
  {
    id: Categories.MEDICAL_ACCOMMODATION,
    children: [],
  },
  {
    id: Categories.MENTAL_HEALTH_EDUCATION,
    children: [],
  },
  {
    id: Categories.THERAPEUTIC_ACTIVITIES,
    children: [],
  },
  {
    id: Categories.ADDICTIONS,
    children: [
      {
        id: Categories.ADDICTION_CARE,
        rank: 100,
      },
      {
        id: Categories.ADDICTION_PREVENTION_AND_MATERIAL,
        rank: 200,
      },
    ],
  },
  {
    id: Categories.ADDICTION_CARE,
    children: [],
  },
  {
    id: Categories.ADDICTION_PREVENTION_AND_MATERIAL,
    children: [],
  },
  {
    id: Categories.SEXUAL_HEALTH,
    children: [
      {
        id: Categories.EMERGENCY_CONTRACEPTION,
        rank: 100,
      },
      {
        id: Categories.CONTRACEPTION,
        rank: 200,
      },
      {
        id: Categories.GYNECOLOGY,
        rank: 300,
      },
      {
        id: Categories.STI_PREVENTION_TESTING,
        rank: 400,
      },
      {
        id: Categories.HIV_PREVENTION,
        rank: 500,
      },
      {
        id: Categories.SEXUAL_HEALTH_VACCINATION,
        rank: 600,
      },
      {
        id: Categories.SEXUAL_HEALTH_EDUCATION,
        rank: 700,
      },
      {
        id: Categories.SEXUAL_VIOLENCE_SUPPORT,
        rank: 800,
      },
      {
        id: Categories.AFFECTIVE_LIFE,
        rank: 900,
      },
    ],
  },
  {
    id: Categories.EMERGENCY_CONTRACEPTION,
    children: [],
  },
  {
    id: Categories.CONTRACEPTION,
    children: [],
  },
  {
    id: Categories.GYNECOLOGY,
    children: [],
  },
  {
    id: Categories.STI_PREVENTION_TESTING,
    children: [],
  },
  {
    id: Categories.HIV_PREVENTION,
    children: [],
  },
  {
    id: Categories.SEXUAL_HEALTH_VACCINATION,
    children: [],
  },
  {
    id: Categories.SEXUAL_HEALTH_EDUCATION,
    children: [],
  },
  {
    id: Categories.SEXUAL_VIOLENCE_SUPPORT,
    children: [],
  },
  {
    id: Categories.AFFECTIVE_LIFE,
    children: [],
  },
  {
    id: Categories.PARENTHOOD,
    children: [
      {
        id: Categories.CHILD_CARE,
        rank: 100,
      },
      {
        id: Categories.PREGNANCY_CARE,
        rank: 200,
      },
      {
        id: Categories.PARENT_ASSISTANCE,
        rank: 300,
      },
    ],
  },
  {
    id: Categories.CHILD_CARE,
    children: [],
  },
  {
    id: Categories.PREGNANCY_CARE,
    children: [],
  },
  {
    id: Categories.PARENT_ASSISTANCE,
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
        id: Categories.ENDOCRINOLOGY,
        rank: 400,
      },
      {
        id: Categories.GASTROENTEROLOGY,
        rank: 500,
      },
      {
        id: Categories.KINESITHERAPY,
        rank: 600,
      },
      {
        id: Categories.OTORHINOLARYNGOLOGY,
        rank: 700,
      },
      {
        id: Categories.SPEECH_THERAPY,
        rank: 800,
      },
      {
        id: Categories.PEDICURE,
        rank: 900,
      },
      {
        id: Categories.PNEUMOLOGY,
        rank: 1000,
      },
      {
        id: Categories.PSYCHIATRY,
        rank: 1100,
      },
      {
        id: Categories.PSYCHOLOGICAL_SUPPORT,
        rank: 1200,
      },
      {
        id: Categories.RADIOLOGY,
        rank: 1300,
      },
      {
        id: Categories.RHEUMATOLOGY,
        rank: 1400,
      },
      {
        id: Categories.STOMATOLOGY,
        rank: 1500,
      },
      {
        id: Categories.UROLOGY,
        rank: 1600,
      },
      {
        id: Categories.VET_CARE,
        rank: 1700,
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
    id: Categories.ENDOCRINOLOGY,
    children: [],
  },
  {
    id: Categories.GASTROENTEROLOGY,
    children: [],
  },
  {
    id: Categories.KINESITHERAPY,
    children: [],
  },
  {
    id: Categories.OTORHINOLARYNGOLOGY,
    children: [],
  },
  {
    id: Categories.SPEECH_THERAPY,
    children: [],
  },
  {
    id: Categories.PEDICURE,
    children: [],
  },
  {
    id: Categories.PNEUMOLOGY,
    children: [],
  },
  {
    id: Categories.PSYCHIATRY,
    children: [],
  },
  {
    id: Categories.PSYCHOLOGICAL_SUPPORT,
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
    id: Categories.STOMATOLOGY,
    children: [],
  },
  {
    id: Categories.UROLOGY,
    children: [],
  },
  {
    id: Categories.VET_CARE,
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
        id: Categories.TRANSPORTATION_MOBILITY,
        rank: 100,
      },
      {
        id: Categories.MOBILITY_SUPPORT,
        rank: 400,
      },
      {
        id: Categories.MOBILITY_FINANCING,
        rank: 600,
      },
    ],
  },
  {
    id: Categories.TRANSPORTATION_MOBILITY,
    children: [],
  },
  {
    id: Categories.MOBILITY_SUPPORT,
    children: [],
  },
  {
    id: Categories.MOBILITY_FINANCING,
    children: [],
  },
];

export const CATEGORIES_SOLIGUIDE_FR: FlatCategoriesTreeNode[] = [
  {
    id: Categories.COUNSELING,
    children: [
      {
        id: Categories.DOMICILIATION,
        rank: 200,
      },
      {
        id: Categories.PUBLIC_WRITER,
        rank: 400,
      },
    ],
  },
  {
    id: Categories.ACCOMODATION_AND_HOUSING,
    children: [
      {
        id: Categories.CITIZEN_HOUSING,
        rank: 400,
      },
    ],
  },
  {
    id: Categories.MOBILITY,
    children: [
      {
        id: Categories.DRIVING_LICENSE,
        rank: 500,
      },
      {
        id: Categories.PERSONAL_VEHICLE_ACCESS,
        rank: 200,
      },
      {
        id: Categories.VEHICLE_MAINTENANCE,
        rank: 300,
      },
    ],
  },
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
    id: Categories.SEXUAL_HEALTH,
    children: [
      {
        id: Categories.ABORTION,
        rank: 150,
      },
    ],
  },
  {
    id: Categories.HEALTH_SPECIALISTS,
    children: [
      {
        id: Categories.OSTEOPATHY,
        rank: 850,
      },
      {
        id: Categories.PHLEBOLOGY,
        rank: 950,
      },
    ],
  },
  {
    id: Categories.CITIZEN_HOUSING,
    children: [],
  },
  {
    id: Categories.FRENCH_COURSE,
    children: [],
  },
  {
    id: Categories.DOMICILIATION,
    children: [],
  },
  {
    id: Categories.PUBLIC_WRITER,
    children: [],
  },
  {
    id: Categories.DRIVING_LICENSE,
    children: [],
  },
  {
    id: Categories.PERSONAL_VEHICLE_ACCESS,
    children: [],
  },
  {
    id: Categories.VEHICLE_MAINTENANCE,
    children: [],
  },
  {
    id: Categories.ABORTION,
    children: [],
  },
  {
    id: Categories.PHLEBOLOGY,
    children: [],
  },
  {
    id: Categories.OSTEOPATHY,
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
    id: Categories.SEXUAL_HEALTH,
    children: [
      {
        id: Categories.ABORTION,
        rank: 150,
      },
    ],
  },
  {
    id: Categories.HEALTH_SPECIALISTS,
    children: [
      {
        id: Categories.NEUROLOGY,
        rank: 1800,
      },
      {
        id: Categories.VASCULAR_SURGERY,
        rank: 1900,
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
    id: Categories.ABORTION,
    children: [],
  },
  {
    id: Categories.NEUROLOGY,
    children: [],
  },
  {
    id: Categories.VASCULAR_SURGERY,
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
    id: Categories.COUNSELING,
    children: [
      {
        id: Categories.LEGAL_PROTECTION,
        rank: 820,
      },
    ],
  },
  {
    id: Categories.HEALTH_SPECIALISTS,
    children: [
      {
        id: Categories.NEUROLOGY,
        rank: 1800,
      },
      {
        id: Categories.VASCULAR_SURGERY,
        rank: 1900,
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
    id: Categories.LEGAL_PROTECTION,
    children: [],
  },
  {
    id: Categories.NEUROLOGY,
    children: [],
  },
  {
    id: Categories.VASCULAR_SURGERY,
    children: [],
  },
];
