import { Categories } from "../enums";
import { CategoriesGraph, ChildCategory } from "../interfaces";

/**
 * Root categories displayed at the top level of the UI.
 * Ordered by rank for display purposes.
 */
export const ROOT_CATEGORIES: ChildCategory[] = [
  { id: Categories.WELCOME, rank: 100 },
  { id: Categories.ACTIVITIES, rank: 200 },
  { id: Categories.FOOD, rank: 300 },
  { id: Categories.COUNSELING, rank: 400 },
  { id: Categories.TRAINING_AND_JOBS, rank: 500 },
  { id: Categories.ACCOMODATION_AND_HOUSING, rank: 600 },
  { id: Categories.HYGIENE_AND_WELLNESS, rank: 700 },
  { id: Categories.EQUIPMENT, rank: 800 },
  { id: Categories.HEALTH, rank: 900 },
  { id: Categories.TECHNOLOGY, rank: 1000 },
  { id: Categories.MOBILITY, rank: 1100 },
];

/**
 * Base categories graph shared across all themes.
 *
 * This is a DAG (Directed Acyclic Graph): each key is a parent category,
 * and its value lists the direct children with their display rank.
 * Leaf categories are implicit — they don't need entries.
 * Multi-parental categories appear as children of multiple parents.
 *
 * Example: PSYCHIATRY is a child of both MENTAL_HEALTH and HEALTH_SPECIALISTS.
 */
export const CATEGORIES_GRAPH: CategoriesGraph = {
  // ── Welcome ───────────────────────────────────────────────────────────
  [Categories.WELCOME]: [
    { id: Categories.DAY_HOSTING, rank: 100 },
    { id: Categories.REST_AREA, rank: 200 },
    { id: Categories.BABYSITTING, rank: 300 },
    { id: Categories.FAMILY_AREA, rank: 400 },
    { id: Categories.INFORMATION_POINT, rank: 500 },
  ],

  // ── Activities ────────────────────────────────────────────────────────
  [Categories.ACTIVITIES]: [
    { id: Categories.SPORT_ACTIVITIES, rank: 100 },
    { id: Categories.MUSEUMS, rank: 200 },
    { id: Categories.LIBRARIES, rank: 300 },
    { id: Categories.OTHER_ACTIVITIES, rank: 400 },
  ],

  // ── Food ──────────────────────────────────────────────────────────────
  [Categories.FOOD]: [
    { id: Categories.FOOD_DISTRIBUTION, rank: 100 },
    { id: Categories.FOOD_PACKAGES, rank: 200 },
    { id: Categories.BABY_PARCEL, rank: 300 },
    { id: Categories.FOOD_VOUCHER, rank: 400 },
    { id: Categories.SOCIAL_GROCERY_STORES, rank: 500 },
    { id: Categories.FOUNTAIN, rank: 600 },
    { id: Categories.SHARED_KITCHEN, rank: 700 },
    { id: Categories.COOKING_WORKSHOP, rank: 800 },
    { id: Categories.COMMUNITY_GARDEN, rank: 900 },
    { id: Categories.SOLIDARITY_FRIDGE, rank: 1000 },
  ],

  // ── Counseling ────────────────────────────────────────────────────────
  [Categories.COUNSELING]: [
    { id: Categories.LEGAL_ADVICE, rank: 100 },
    { id: Categories.SOCIAL_ACCOMPANIMENT, rank: 300 },
    { id: Categories.DISABILITY_ADVICE, rank: 500 },
    { id: Categories.ADMINISTRATIVE_ASSISTANCE, rank: 600 },
    { id: Categories.PARENT_ASSISTANCE, rank: 700 }, // multi-parental: also under PARENTHOOD
    { id: Categories.BUDGET_ADVICE, rank: 800 },
  ],

  // ── Training & Jobs ───────────────────────────────────────────────────
  [Categories.TRAINING_AND_JOBS]: [
    { id: Categories.DIGITAL_TOOLS_TRAINING, rank: 100 },
    { id: Categories.JOB_COACHING, rank: 200 },
    { id: Categories.INTEGRATION_THROUGH_ECONOMIC_ACTIVITY, rank: 300 },
    { id: Categories.TUTORING, rank: 400 },
  ],

  // ── Accommodation & Housing ───────────────────────────────────────────
  [Categories.ACCOMODATION_AND_HOUSING]: [
    { id: Categories.OVERNIGHT_STOP, rank: 100 },
    { id: Categories.EMERGENCY_ACCOMMODATION, rank: 200 },
    { id: Categories.LONG_TERM_ACCOMODATION, rank: 300 },
    { id: Categories.ACCESS_TO_HOUSING, rank: 500 },
  ],

  // ── Hygiene & Wellness ────────────────────────────────────────────────
  [Categories.HYGIENE_AND_WELLNESS]: [
    { id: Categories.SHOWER, rank: 100 },
    { id: Categories.LAUNDRY, rank: 200 },
    { id: Categories.WELLNESS, rank: 300 },
    { id: Categories.TOILETS, rank: 400 },
    { id: Categories.HYGIENE_PRODUCTS, rank: 500 },
    { id: Categories.FACE_MASKS, rank: 600 },
    { id: Categories.HAIRDRESSER, rank: 700 },
  ],

  // ── Equipment ─────────────────────────────────────────────────────────
  [Categories.EQUIPMENT]: [
    { id: Categories.LUGGAGE_STORAGE, rank: 100 },
    { id: Categories.SOLIDARITY_STORE, rank: 200 },
    { id: Categories.CLOTHING, rank: 300 },
    { id: Categories.ANIMAL_ASSITANCE, rank: 400 },
  ],

  // ── Health (3-level DAG with multi-parental nodes) ────────────────────
  [Categories.HEALTH]: [
    { id: Categories.HEALTH_ACCESS, rank: 100 },
    { id: Categories.PHYSICAL_HEALTH, rank: 200 },
    { id: Categories.MENTAL_HEALTH, rank: 300 },
    { id: Categories.ADDICTIONS, rank: 400 },
    { id: Categories.SEXUAL_HEALTH, rank: 500 },
    { id: Categories.PARENTHOOD, rank: 600 },
    { id: Categories.HEALTH_SPECIALISTS, rank: 700 },
  ],

  [Categories.HEALTH_ACCESS]: [
    { id: Categories.HEALTH_COVERAGE, rank: 100 },
    { id: Categories.FIND_HEALTHCARE, rank: 200 },
  ],

  [Categories.PHYSICAL_HEALTH]: [
    { id: Categories.GENERAL_PRACTITIONER, rank: 100 },
    { id: Categories.HEALTH_ASSESSMENT, rank: 200 },
    { id: Categories.CHILD_CARE, rank: 300 },        // multi-parental: also under PARENTHOOD
    { id: Categories.DENTAL_CARE, rank: 400 },
    { id: Categories.OPTICAL_CARE, rank: 500 },
    { id: Categories.HEARING_CARE, rank: 600 },
    { id: Categories.INFIRMARY, rank: 700 },
    { id: Categories.VACCINATION, rank: 800 },
    { id: Categories.STD_TESTING, rank: 900 },
    { id: Categories.CHRONIC_DISEASES, rank: 1000 },
    { id: Categories.NUTRITION, rank: 1100 },
    { id: Categories.MEDICAL_ACCOMMODATION, rank: 1200 }, // multi-parental: also under MENTAL_HEALTH
  ],

  [Categories.MENTAL_HEALTH]: [
    { id: Categories.PSYCHOLOGICAL_SUPPORT, rank: 100 }, // multi-parental: also under HEALTH_SPECIALISTS
    { id: Categories.PSYCHIATRY, rank: 200 },            // multi-parental: also under HEALTH_SPECIALISTS
    { id: Categories.SUPPORT_GROUPS, rank: 300 },
    { id: Categories.MEDICAL_ACCOMMODATION, rank: 400 }, // multi-parental: also under PHYSICAL_HEALTH
    { id: Categories.MENTAL_HEALTH_EDUCATION, rank: 500 },
    { id: Categories.THERAPEUTIC_ACTIVITIES, rank: 600 },
  ],

  [Categories.ADDICTIONS]: [
    { id: Categories.ADDICTION_CARE, rank: 100 },
    { id: Categories.ADDICTION_PREVENTION_AND_MATERIAL, rank: 200 },
  ],

  [Categories.SEXUAL_HEALTH]: [
    { id: Categories.EMERGENCY_CONTRACEPTION, rank: 100 },
    { id: Categories.CONTRACEPTION, rank: 200 },
    { id: Categories.GYNECOLOGY, rank: 300 },
    { id: Categories.STI_PREVENTION_TESTING, rank: 400 },
    { id: Categories.HIV_PREVENTION, rank: 500 },
    { id: Categories.SEXUAL_HEALTH_VACCINATION, rank: 600 },
    { id: Categories.SEXUAL_HEALTH_EDUCATION, rank: 700 },
    { id: Categories.SEXUAL_VIOLENCE_SUPPORT, rank: 800 },
    { id: Categories.AFFECTIVE_LIFE, rank: 900 },
  ],

  [Categories.PARENTHOOD]: [
    { id: Categories.CHILD_CARE, rank: 100 },          // multi-parental: also under PHYSICAL_HEALTH
    { id: Categories.PREGNANCY_CARE, rank: 200 },
    { id: Categories.PARENT_ASSISTANCE, rank: 300 },   // multi-parental: also under COUNSELING
  ],

  [Categories.HEALTH_SPECIALISTS]: [
    { id: Categories.ALLERGOLOGY, rank: 100 },
    { id: Categories.CARDIOLOGY, rank: 200 },
    { id: Categories.DERMATOLOGY, rank: 300 },
    { id: Categories.ENDOCRINOLOGY, rank: 400 },
    { id: Categories.GASTROENTEROLOGY, rank: 500 },
    { id: Categories.KINESITHERAPY, rank: 600 },
    { id: Categories.OTORHINOLARYNGOLOGY, rank: 700 },
    { id: Categories.SPEECH_THERAPY, rank: 800 },
    { id: Categories.PEDICURE, rank: 900 },
    { id: Categories.PNEUMOLOGY, rank: 1000 },
    { id: Categories.PSYCHIATRY, rank: 1100 },            // multi-parental: also under MENTAL_HEALTH
    { id: Categories.PSYCHOLOGICAL_SUPPORT, rank: 1200 }, // multi-parental: also under MENTAL_HEALTH
    { id: Categories.RADIOLOGY, rank: 1300 },
    { id: Categories.RHEUMATOLOGY, rank: 1400 },
    { id: Categories.STOMATOLOGY, rank: 1500 },
    { id: Categories.UROLOGY, rank: 1600 },
    { id: Categories.VET_CARE, rank: 1700 },
  ],

  // ── Technology ────────────────────────────────────────────────────────
  [Categories.TECHNOLOGY]: [
    { id: Categories.COMPUTERS_AT_YOUR_DISPOSAL, rank: 100 },
    { id: Categories.WIFI, rank: 200 },
    { id: Categories.ELECTRICAL_OUTLETS_AVAILABLE, rank: 300 },
    { id: Categories.TELEPHONE_AT_YOUR_DISPOSAL, rank: 400 },
    { id: Categories.DIGITAL_SAFE, rank: 500 },
  ],

  // ── Mobility ──────────────────────────────────────────────────────────
  [Categories.MOBILITY]: [
    { id: Categories.TRANSPORTATION_MOBILITY, rank: 100 },
    { id: Categories.MOBILITY_SUPPORT, rank: 400 },
    { id: Categories.MOBILITY_FINANCING, rank: 600 },
  ],
};

/**
 * Theme-specific graph overlay for Soliguide France.
 * Merged on top of CATEGORIES_GRAPH at runtime.
 * Adds children to existing parents and introduces new leaf categories.
 */
export const CATEGORIES_GRAPH_SOLIGUIDE_FR: CategoriesGraph = {
  [Categories.COUNSELING]: [
    { id: Categories.DOMICILIATION, rank: 200 },
    { id: Categories.PUBLIC_WRITER, rank: 400 },
  ],
  [Categories.ACCOMODATION_AND_HOUSING]: [
    { id: Categories.CITIZEN_HOUSING, rank: 400 },
  ],
  [Categories.MOBILITY]: [
    { id: Categories.PERSONAL_VEHICLE_ACCESS, rank: 200 },
    { id: Categories.VEHICLE_MAINTENANCE, rank: 300 },
    { id: Categories.DRIVING_LICENSE, rank: 500 },
  ],
  [Categories.TRAINING_AND_JOBS]: [
    { id: Categories.FRENCH_COURSE, rank: 150 },
  ],
  [Categories.SEXUAL_HEALTH]: [
    { id: Categories.ABORTION, rank: 150 },
  ],
  [Categories.HEALTH_SPECIALISTS]: [
    { id: Categories.OSTEOPATHY, rank: 850 },
    { id: Categories.PHLEBOLOGY, rank: 950 },
  ],
};

/**
 * Theme-specific graph overlay for Soliguia Spain.
 */
export const CATEGORIES_GRAPH_SOLIGUIA_ES: CategoriesGraph = {
  [Categories.TRAINING_AND_JOBS]: [
    { id: Categories.SPANISH_COURSE, rank: 130 },
    { id: Categories.CATALAN_COURSE, rank: 170 },
  ],
  [Categories.SEXUAL_HEALTH]: [
    { id: Categories.ABORTION, rank: 150 },
  ],
  [Categories.HEALTH_SPECIALISTS]: [
    { id: Categories.NEUROLOGY, rank: 1800 },
    { id: Categories.VASCULAR_SURGERY, rank: 1900 },
  ],
};

/**
 * Theme-specific graph overlay for Soliguia Andorra.
 */
export const CATEGORIES_GRAPH_SOLIGUIA_AD: CategoriesGraph = {
  [Categories.TRAINING_AND_JOBS]: [
    { id: Categories.SPANISH_COURSE, rank: 130 },
    { id: Categories.CATALAN_COURSE, rank: 170 },
  ],
  [Categories.COUNSELING]: [
    { id: Categories.LEGAL_PROTECTION, rank: 820 },
  ],
  [Categories.HEALTH_SPECIALISTS]: [
    { id: Categories.NEUROLOGY, rank: 1800 },
    { id: Categories.VASCULAR_SURGERY, rank: 1900 },
  ],
};
