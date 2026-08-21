/** Commas and whitespace left dangling once the tail has been cut off. */
const TRAILING_SEPARATORS_PATTERN = /[\s,]+$/u;

/**
 * The street part of a full address.
 *
 * The location-api does not return the same level of detail from one country to
 * the next: France gives `91 Rue de la Colombette, 31000 Toulouse`, while Spain
 * and Andorra append the whole administrative tail, as in `Carrer de Sancho de
 * Ávila, 08018 Barcelona (Barcelona), Espanya`. Cutting at the postal code
 * isolates the street in every country, without a rule per country.
 *
 * The address is returned untouched when its postal code cannot be located in
 * it, which is the case of a manually typed address: cutting on a guess would
 * risk truncating it.
 */
export const getStreetFromAddress = (fullAddress: string, postalCode?: string): string => {
  if (!postalCode) {
    return fullAddress;
  }

  const postalCodeIndex = fullAddress.indexOf(postalCode);

  // A postal code opening the address leaves no street to extract
  if (postalCodeIndex <= 0) {
    return fullAddress;
  }

  return fullAddress.slice(0, postalCodeIndex).replace(TRAILING_SEPARATORS_PATTERN, '');
};

/**
 * A full address on a single line: street, postal code and city, dropping the
 * province and country that Spanish and Andorran addresses carry.
 *
 * French addresses already have exactly this shape, so they come out unchanged.
 */
export const formatAddressOnOneLine = (
  fullAddress: string,
  postalCode?: string,
  city?: string
): string => {
  const street = getStreetFromAddress(fullAddress, postalCode);

  if (street === fullAddress || !postalCode || !city) {
    return fullAddress;
  }

  return `${street}, ${postalCode} ${city}`;
};
