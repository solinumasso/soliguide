import { Categories } from "@soliguide/common";

export const WIDGET_CATEGORIES: Record<
  string,
  { title: string; subtitle?: string; categories: Categories[] }
> = {
  ACTIVITIES: {
    title: "FIND_ACTIVITIES",
    categories: [Categories.ACTIVITIES],
  },
  ADVICE: {
    title: "GET_ADVISED",
    subtitle: "ADVISING_EXAMPLE",
    categories: [
      Categories.ACCESS_TO_HOUSING,
      Categories.PUBLIC_WRITER,
      Categories.DISABILITY_ADVICE,
      Categories.ADMINISTRATIVE_ASSISTANCE,
      Categories.PARENT_ASSISTANCE,
    ],
  },
  ANIMAL: {
    title: "FOR_MY_ANIMALS",
    categories: [Categories.ANIMAL_ASSITANCE],
  },
  CLOTHING: {
    title: "DRESS_MYSELF",
    categories: [Categories.SOLIDARITY_STORE, Categories.CLOTHING],
  },
  DIGITAL_ACCESS: {
    title: "ACCESS_TO_DIGITAL_EQUIPMENTS",
    categories: [Categories.DIGITAL_TOOLS_TRAINING, Categories.TECHNOLOGY],
  },
  DOMICILIATION: {
    title: "FIND_HOUSING",
    categories: [Categories.DOMICILIATION],
  },
  FOOD: {
    title: "GET_FOOD_DRINK",
    categories: [Categories.FOOD],
  },
  FRENCH_COURSES: {
    title: "FIND_FRENCH_CLASSES",
    categories: [Categories.JOB_COACHING],
  },
  HEALTHCARE: {
    title: "GET_HEALED",
    categories: [Categories.HEALTH],
  },
  HYGIENE: {
    title: "GET_HYGIENE_ACCESS",
    categories: [Categories.HYGIENE_AND_WELLNESS],
  },
  LEGAL_ASSISTANCE: {
    title: "GET_LEGAL_ASSISTANCE",
    categories: [Categories.LEGAL_ADVICE, Categories.ADMINISTRATIVE_ASSISTANCE],
  },
  PROFESSIONAL_TRAINING: {
    title: "FIND_FORMATION_JOB",
    categories: [Categories.TRAINING_AND_JOBS],
  },
  SHELTER: {
    title: "FIND_SHELTER",
    categories: [
      Categories.DAY_HOSTING,
      Categories.REST_AREA,
      Categories.BABYSITTING,
      Categories.FAMILY_AREA,
    ],
  },
  SOCIAL_SUPPORT: {
    title: "GET_SOCIAL_SUPPORT",
    categories: [Categories.SOCIAL_ACCOMPANIMENT],
  },
  TRANSPORT: {
    title: "MOVE",
    categories: [Categories.MOBILITY],
  },
};
