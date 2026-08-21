import { describe, expect, it } from 'vitest';

import { formatAddressOnOneLine, getStreetFromAddress } from './address';

// The examples of the "Affichage des adresses espagnoles et andorannes" ticket
describe('getStreetFromAddress', () => {
  it.each([
    ['91 Rue de la Colombette, 31000 Toulouse', '31000', '91 Rue de la Colombette'],
    ['Place Saint-Sernin, 31000 Toulouse', '31000', 'Place Saint-Sernin'],
    ['Gare Matabiau, 31000 Toulouse', '31000', 'Gare Matabiau'],
    ['Voie Cd/18, 75018 Paris', '75018', 'Voie Cd/18']
  ])('keeps the street of the French address %s', (fullAddress, postalCode, expected) => {
    expect(getStreetFromAddress(fullAddress, postalCode)).toBe(expected);
  });

  it.each([
    [
      'Carrer de Sancho de Ávila, 105, 08018 Barcelona (Barcelona), Espanya',
      '08018',
      'Carrer de Sancho de Ávila, 105'
    ],
    ['Plaça de Catalunya, 08002 Barcelona (Barcelona), Espanya', '08002', 'Plaça de Catalunya']
  ])(
    'drops the province and the country of the Spanish address %s',
    (fullAddress, postalCode, expected) => {
      expect(getStreetFromAddress(fullAddress, postalCode)).toBe(expected);
    }
  );

  it.each([
    ['Av. de Tarragona, 113, AD500 Andorra la Vella, Andorra', 'AD500', 'Av. de Tarragona, 113'],
    ['Plaça del Poble, AD500 Andorra la Vella, Andorra', 'AD500', 'Plaça del Poble']
  ])('drops the country of the Andorran address %s', (fullAddress, postalCode, expected) => {
    expect(getStreetFromAddress(fullAddress, postalCode)).toBe(expected);
  });

  it('leaves a manually typed address without a postal code untouched', () => {
    expect(getStreetFromAddress('Behind the church', '31000')).toBe('Behind the church');
  });

  it('leaves the address untouched when no postal code is known', () => {
    expect(getStreetFromAddress('91 Rue de la Colombette, 31000 Toulouse')).toBe(
      '91 Rue de la Colombette, 31000 Toulouse'
    );
  });

  it('leaves the address untouched when it opens with its postal code', () => {
    expect(getStreetFromAddress('31000 Toulouse', '31000')).toBe('31000 Toulouse');
  });
});

describe('formatAddressOnOneLine', () => {
  it('leaves a French address unchanged, it already has the expected shape', () => {
    expect(
      formatAddressOnOneLine('91 Rue de la Colombette, 31000 Toulouse', '31000', 'Toulouse')
    ).toBe('91 Rue de la Colombette, 31000 Toulouse');
  });

  it('shortens a Spanish address to street, postal code and city', () => {
    expect(
      formatAddressOnOneLine(
        'Carrer de Sancho de Ávila, 105, 08018 Barcelona (Barcelona), Espanya',
        '08018',
        'Barcelona'
      )
    ).toBe('Carrer de Sancho de Ávila, 105, 08018 Barcelona');
  });

  it('shortens an Andorran address to street, postal code and city', () => {
    expect(
      formatAddressOnOneLine(
        'Av. de Tarragona, 113, AD500 Andorra la Vella, Andorra',
        'AD500',
        'Andorra la Vella'
      )
    ).toBe('Av. de Tarragona, 113, AD500 Andorra la Vella');
  });

  it('keeps a manually typed address as it was written', () => {
    expect(formatAddressOnOneLine('Behind the church', '31000', 'Toulouse')).toBe(
      'Behind the church'
    );
  });
});
