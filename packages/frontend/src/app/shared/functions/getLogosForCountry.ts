import { CountryCodes } from "@soliguide/common";
import {
  ALL_LOGOS,
  LOGOS_BY_COUNTRY,
  FUNDERS_BY_COUNTRY,
  LogoWithLink,
} from "../constants";

export function getLogosForCountry(country: CountryCodes): LogoWithLink[] {
  const logoNames = LOGOS_BY_COUNTRY[country] ?? [];
  return ALL_LOGOS.filter((logo) => logoNames.includes(logo.alt));
}

export function getFunderNamesForCountry(country: CountryCodes): string[] {
  return FUNDERS_BY_COUNTRY[country] ?? [];
}
