import { CountryCodes, type SoliguideCountries } from "../../location";

// Summer season: June (6) → September (9).
export const isSummerSeason = (now: Date = new Date()): boolean => {
  const month = now.getMonth() + 1;
  return month >= 6 && month <= 9;
};

// Winter season: November → early March (until March 10th).
export const isWinterSeason = (now: Date = new Date()): boolean => {
  const month = now.getMonth() + 1;
  if (month === 11 || month === 12 || month === 1 || month === 2) {
    return true;
  }
  return month === 3 && now.getDate() <= 10;
};

/**
 * Whether thermal comfort information (heat/AC modalities) should be
 * displayed. Only shown for French structures and only during summer.
 */
export const shouldDisplayThermalComfort = (
  country: SoliguideCountries | null | undefined,
  now: Date = new Date()
): boolean => country === CountryCodes.FR && isSummerSeason(now);
