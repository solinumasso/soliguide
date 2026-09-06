import { RegistrationScheme } from "@soliguide/common";
import { validCIF } from "spain-id";
import validator from "validator";

// La Poste's establishments do not follow the Luhn algorithm: the sum of digits must be a multiple of 5
const LA_POSTE_SIREN = "356000000";

const sumOfDigits = (value: string): number =>
  [...value].reduce((sum, digit) => sum + Number(digit), 0);

/**
 * SIRET: 14 digits, Luhn-valid (validator.js), except La Poste
 */
export const isValidSiret = (value: string): boolean => {
  if (!/^\d{14}$/.test(value)) {
    return false;
  }
  if (value.startsWith(LA_POSTE_SIREN)) {
    return sumOfDigits(value) % 5 === 0;
  }
  return validator.isLuhnNumber(value);
};

/**
 * RNA (Répertoire National des Associations): "W" followed by 9 digits. No public checksum.
 */
export const isValidRna = (value: string): boolean => /^W\d{9}$/.test(value);

/**
 * Spanish NIF for legal entities (ex-CIF): letter, 7 digits, control character, checked by spain-id.
 * Individuals (DNI / NIE) are deliberately refused: a place is identified by an entity, not a person.
 */
export const isValidNif = (value: string): boolean => validCIF(value);

/**
 * Andorran NRT (Número de Registre Tributari): letter, 6 digits, letter. Format check only, no library available.
 */
export const isValidNrt = (value: string): boolean =>
  /^[A-Z]\d{6}[A-Z]$/.test(value);

/**
 * One validator per scheme. Values are normalized (no spaces / dashes, uppercase) before being checked.
 */
export const REGISTRATION_VALIDATORS: Record<
  RegistrationScheme,
  (value: string) => boolean
> = {
  [RegistrationScheme.SIRET]: isValidSiret,
  [RegistrationScheme.RNA]: isValidRna,
  [RegistrationScheme.NIF]: isValidNif,
  [RegistrationScheme.NRT]: isValidNrt,
};
