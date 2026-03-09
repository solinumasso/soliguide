import type { DayName } from "../types";

/* eslint-disable */
// The linter is disabled to avoid sorting days in the wrong order
export const DAYS: {
  [key in DayName]: string;
} = {
  monday: "LUNDI",
  tuesday: "MARDI",
  wednesday: "MERCREDI",
  thursday: "JEUDI",
  friday: "VENDREDI",
  saturday: "SAMEDI",
  sunday: "DIMANCHE",
};

export const WEEK_DAYS: DayName[] = Object.keys(DAYS) as DayName[];

export const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
